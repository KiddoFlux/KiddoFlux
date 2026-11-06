import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
import type { ProfilParinte } from '@/types/profil';

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
      throw new EroareAutentificare('Introdu un număr de telefon valid, de forma 07xx xxx xxx.');
    }
    if (!cod.trim()) {
      throw new EroareAutentificare('Introdu codul de acces.');
    }

    seAutentifica.current = true;
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, cod.trim());
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

  const value = useMemo(
    () => ({ stare, profil, autentifica, deconecteaza }),
    [stare, profil, autentifica, deconecteaza],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth trebuie folosit in interiorul AuthProvider.');
  return context;
}

/**
 * Profilul parintelui conectat. Poate fi null pentru o clipa cand utilizatorul se deconecteaza,
 * deci ecranele trebuie sa nu afiseze nimic in acel caz.
 */
export function useProfil(): ProfilParinte | null {
  return useAuth().profil;
}
