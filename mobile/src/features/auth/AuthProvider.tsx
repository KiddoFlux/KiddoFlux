import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { auth, db } from '@/lib/firebase';
import type { Copil, ProfilParinte } from '@/types/profil';
import { determinaTipScaun, extrageCopiiProfil } from '@/utils/scaunAuto';

import { telefonLaEmail } from './phone';

const COLECTIE_PARINTI = 'parinti';

/** `se-incarca`: se verifica sesiunea salvata. `conectat` inseamna ca profilul e deja incarcat. */
export type StareAutentificare = 'se-incarca' | 'deconectat' | 'conectat';

/** Eroare cu un mesaj gata de afisat in interfata. */
export class EroareAutentificare extends Error {}

type AuthContextValue = {
  stare: StareAutentificare;
  profil: ProfilParinte | null;
  autentifica: (telefon: string, cod: string) => Promise<void>;
  deconecteaza: () => Promise<void>;
  salveazaInaltimeCopii: (copiiNoi: Copil[]) => Promise<void>;
  confirmaInaltimeNeschimbata: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function incarcaProfil(uid: string): Promise<ProfilParinte> {
  const snapshot = await getDoc(doc(db, COLECTIE_PARINTI, uid));
  if (!snapshot.exists()) {
    throw new EroareAutentificare('Nu am găsit profilul acestui cont.');
  }
  return snapshot.data() as ProfilParinte;
}

function mesajPentruEroare(eroare: unknown): string {
  if (eroare instanceof EroareAutentificare) return eroare.message;

  const cod = (eroare as { code?: string } | null)?.code ?? '';
  switch (cod) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return 'Telefon sau cod incorect.';
    case 'auth/network-request-failed':
    case 'unavailable':
      return 'Nu ai conexiune la internet. Încearcă din nou.';
    case 'auth/too-many-requests':
      return 'Prea multe încercări. Încearcă din nou peste câteva minute.';
    case 'permission-denied':
      return 'Nu ai acces la acest profil.';
    default:
      return 'Nu te-am putut conecta. Încearcă din nou.';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [stare, setStare] = useState<StareAutentificare>('se-incarca');
  const [profil, setProfil] = useState<ProfilParinte | null>(null);
  // Cat timp `autentifica` ruleaza, ea incarca singura profilul (si poate afisa erori).
  const seAutentifica = useRef(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (utilizator) => {
      if (seAutentifica.current) return;

      if (!utilizator) {
        setProfil(null);
        setStare('deconectat');
        return;
      }

      // Sesiune salvata de la o deschidere anterioara a aplicatiei.
      try {
        setProfil(await incarcaProfil(utilizator.uid));
        setStare('conectat');
      } catch {
        setProfil(null);
        setStare('deconectat');
      }
    });
  }, []);

  const autentifica = useCallback(async (telefon: string, cod: string) => {
    const email = telefonLaEmail(telefon);
    if (!email) {
      throw new EroareAutentificare(
        'Introdu un număr de telefon valid, de forma 07xx xxx xxx.',
      );
    }
    if (!cod.trim()) {
      throw new EroareAutentificare('Introdu codul de acces.');
    }

    seAutentifica.current = true;
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        email,
        cod.trim(),
      );
      try {
        setProfil(await incarcaProfil(user.uid));
        setStare('conectat');
      } catch (eroare) {
        // Fara profil nu are sens sa ramana conectat.
        await signOut(auth);
        throw eroare;
      }
    } catch (eroare) {
      throw new EroareAutentificare(mesajPentruEroare(eroare));
    } finally {
      seAutentifica.current = false;
    }
  }, []);

  const deconecteaza = useCallback(async () => {
    await signOut(auth);
  }, []);

  const salveazaInaltimeCopii = useCallback(
    async (copiiNoi: Copil[]) => {
      const uid = auth.currentUser?.uid ?? profil?.id;
      if (!uid || !profil) {
        throw new EroareAutentificare('Nu ești conectat.');
      }

      const nowIso = new Date().toISOString();
      const copiiProcesati = copiiNoi.map((copil) => {
        const info = determinaTipScaun(copil.inaltimeCm);
        return {
          ...copil,
          necesitaScaunAuto: info.necesitaScaunAuto,
          tipScaun: info.tip,
          inaltimeActualizataLa: nowIso,
        };
      });

      const copilPrincipal = copiiProcesati[0] ?? profil.copil;
      const dateActualizate: Partial<ProfilParinte> = {
        copil: copilPrincipal,
        copii: copiiProcesati,
        ultimaDeclarareInaltime: nowIso,
      };

      try {
        const docRef = doc(db, COLECTIE_PARINTI, uid);
        await updateDoc(docRef, dateActualizate as Record<string, unknown>);
      } catch (eroare) {
        console.error('Eroare updateDoc inaltime:', eroare);
        const cod = (eroare as { code?: string })?.code;
        if (cod === 'permission-denied') {
          throw new EroareAutentificare(
            'Permisiune refuzată de baza de date (verifică regulile Firestore).',
          );
        }
        if (cod === 'unavailable' || cod === 'network-request-failed') {
          throw new EroareAutentificare(
            'Nu ai conexiune la internet. Încearcă din nou.',
          );
        }
        throw new EroareAutentificare(
          `Nu am putut salva: ${(eroare as Error)?.message ?? 'Eroare necunoscută'}`,
        );
      }

      setProfil((prev) =>
        prev
          ? {
              ...prev,
              ...dateActualizate,
            }
          : null,
      );
    },
    [profil],
  );

  const confirmaInaltimeNeschimbata = useCallback(async () => {
    const uid = auth.currentUser?.uid ?? profil?.id;
    if (!uid || !profil) {
      throw new EroareAutentificare('Nu ești conectat.');
    }

    const nowIso = new Date().toISOString();
    const copii = extrageCopiiProfil(profil);
    const copiiProcesati = copii.map((copil) => {
      const info = determinaTipScaun(copil.inaltimeCm);
      return {
        ...copil,
        necesitaScaunAuto: info.necesitaScaunAuto,
        tipScaun: info.tip,
        inaltimeActualizataLa: nowIso,
      };
    });

    const copilPrincipal = copiiProcesati[0] ?? profil.copil;
    const dateActualizate: Partial<ProfilParinte> = {
      copil: copilPrincipal,
      copii: copiiProcesati,
      ultimaDeclarareInaltime: nowIso,
    };

    try {
      const docRef = doc(db, COLECTIE_PARINTI, uid);
      await updateDoc(docRef, dateActualizate as Record<string, unknown>);
    } catch (eroare) {
      console.error('Eroare updateDoc confirma inaltime:', eroare);
      const cod = (eroare as { code?: string })?.code;
      if (cod === 'permission-denied') {
        throw new EroareAutentificare(
          'Permisiune refuzată de baza de date (verifică regulile Firestore).',
        );
      }
      if (cod === 'unavailable' || cod === 'network-request-failed') {
        throw new EroareAutentificare(
          'Nu ai conexiune la internet. Încearcă din nou.',
        );
      }
      throw new EroareAutentificare(
        `Nu am putut confirma: ${(eroare as Error)?.message ?? 'Eroare necunoscută'}`,
      );
    }

    setProfil((prev) =>
      prev
        ? {
            ...prev,
            ...dateActualizate,
          }
        : null,
    );
  }, [profil]);

  const value = useMemo(
    () => ({
      stare,
      profil,
      autentifica,
      deconecteaza,
      salveazaInaltimeCopii,
      confirmaInaltimeNeschimbata,
    }),
    [
      stare,
      profil,
      autentifica,
      deconecteaza,
      salveazaInaltimeCopii,
      confirmaInaltimeNeschimbata,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuth trebuie folosit in interiorul AuthProvider.');
  return context;
}

/**
 * Profilul parintelui conectat. Poate fi null pentru o clipa cand utilizatorul se deconecteaza,
 * deci ecranele trebuie sa nu afiseze nimic in acel caz.
 */
export function useProfil(): ProfilParinte | null {
  return useAuth().profil;
}
