import { collection, onSnapshot, type Unsubscribe } from 'firebase/firestore';

import type { AvatarTone } from '@/components/ui/Avatar';
import type { NextRide } from '@/features/home/types';
import { db } from '@/lib/firebase';
import type { DirectieCursa } from '@/types/disponibilitate';
import type { ProfilParinte, ZiSaptamana } from '@/types/profil';
import type { Child } from '@/types/ride';
import type { TimeString } from '@/utils/time';

export const COLECTIE_CURSE = 'curse';

export type CopilCursa = {
  id: string;
  parinteId: string;
  prenume: string;
  initiala: string;
  clasa: string;
  necesitaScaunAuto: boolean;
};

export type CursaGrup = {
  id: string;
  data: string;
  zi: ZiSaptamana;
  directie: DirectieCursa;
  oraPlecare: string;
  oraSosire: string;
  soferId: string;
  soferNume: string;
  soferPrenume: string;
  soferTelefon: string;
  soferMasina: string;
  locuriTotale: number;
  locuriOcupate: number;
  copii: CopilCursa[];
  necesitaInlocuitor: boolean;
};

const TONES: AvatarTone[] = ['peach', 'sage', 'steel'];

export function copilLaAvatarTone(index: number): AvatarTone {
  return TONES[index % TONES.length];
}

/** Asculta live modificarile din colectia Firestore `curse`. */
export function subscribeCurse(
  onChange: (curse: CursaGrup[]) => void,
): Unsubscribe {
  const ref = collection(db, COLECTIE_CURSE);
  return onSnapshot(
    ref,
    (snapshot) => {
      const curse = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<CursaGrup, 'id'>),
      }));
      // Sortam cronologic dupa data si ora plecarii
      curse.sort((a, b) => {
        const cmp = a.data.localeCompare(b.data);
        return cmp !== 0 ? cmp : a.oraPlecare.localeCompare(b.oraPlecare);
      });
      onChange(curse);
    },
    (eroare) => {
      console.warn('Nu s-au putut asculta cursele din Firestore:', eroare);
      onChange([]);
    },
  );
}

/** Formateaza eticheta de zi raportata la ziua de astazi. */
export function formateazaEtichetaZi(
  dataIso: string,
  azi = new Date(),
): string {
  const an = azi.getFullYear();
  const luna = String(azi.getMonth() + 1).padStart(2, '0');
  const zi = String(azi.getDate()).padStart(2, '0');
  const aziIso = `${an}-${luna}-${zi}`;

  const maine = new Date(azi);
  maine.setDate(maine.getDate() + 1);
  const maineAn = maine.getFullYear();
  const maineLuna = String(maine.getMonth() + 1).padStart(2, '0');
  const maineZi = String(maine.getDate()).padStart(2, '0');
  const maineIso = `${maineAn}-${maineLuna}-${maineZi}`;

  if (dataIso === aziIso) return 'azi';
  if (dataIso === maineIso) return 'mâine';

  const d = new Date(dataIso);
  const zile = [
    'duminică',
    'luni',
    'marți',
    'miercuri',
    'joi',
    'vineri',
    'sâmbătă',
  ];
  return zile[d.getDay()] ?? dataIso;
}

/** Transforma o cursa de grup in structura afisata de `NextRideCard` pe Home. */
export function cursaLaNextRide(
  cursa: CursaGrup,
  currentUserId: string,
): NextRide {
  const children: Child[] = cursa.copii.map((copil, idx) => ({
    id: copil.id,
    name: copil.prenume,
    initial: copil.initiala,
    tone: copilLaAvatarTone(idx),
  }));

  const esteSofer = cursa.soferId === currentUserId;

  return {
    dayLabel: formateazaEtichetaZi(cursa.data),
    direction: cursa.directie === 'spreScoala' ? 'toSchool' : 'toHome',
    departureTime: cursa.oraPlecare as TimeString,
    arrivalTime: cursa.oraSosire as TimeString,
    children,
    driverName: esteSofer ? null : cursa.soferPrenume || cursa.soferNume,
  };
}

/** Construieste o cursa implicita personalizata pentru utilizatorul logat cand nu exista inca curse in Firestore. */
export function creeazaFallbackNextRide(profil: ProfilParinte): NextRide {
  const acum = new Date();
  const ora = acum.getHours();
  const minute = acum.getMinutes();
  const oraFormatata = `${String(ora).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  let dayLabel = 'azi';
  let direction: 'toSchool' | 'toHome' = 'toSchool';
  let departureTime: TimeString = '07:35';
  let arrivalTime: TimeString = '08:00';

  if (oraFormatata < '08:00') {
    dayLabel = 'azi';
    direction = 'toSchool';
    departureTime = '07:35';
    arrivalTime = '08:00';
  } else if (oraFormatata < '15:00') {
    dayLabel = 'azi';
    direction = 'toHome';
    departureTime = '14:30';
    arrivalTime = '15:00';
  } else {
    const ziSaptamana = acum.getDay(); // 5 = Vineri, 6 = Sambata
    dayLabel = ziSaptamana === 5 || ziSaptamana === 6 ? 'luni' : 'mâine';
    direction = 'toSchool';
    departureTime = '07:35';
    arrivalTime = '08:00';
  }

  const esteSoferAstazi = profil.zileDisponibile.length > 0;
  const soferFallback = profil.id === 'parinte-03' ? 'Ioana P.' : 'Mihai D.';

  const child: Child = {
    id: `copil-${profil.id}`,
    name: profil.copil.prenume,
    initial: profil.copil.prenume.charAt(0).toUpperCase(),
    tone: 'peach',
  };

  return {
    dayLabel,
    direction,
    departureTime,
    arrivalTime,
    children: [child],
    driverName: esteSoferAstazi ? null : soferFallback,
  };
}
