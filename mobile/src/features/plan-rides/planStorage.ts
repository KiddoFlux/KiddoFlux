import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';
import type {
  CursaDisponibila,
  DirectieCursa,
  Disponibilitate,
} from '@/types/disponibilitate';
import type { ZiSaptamana } from '@/types/profil';
import type { TimeString } from '@/utils/time';

import type { DateString, PlannedRide, RideDirection, WeekPlan } from './types';

const COLECTIE_PARINTI = 'parinti';
const SUBCOLECTIE_DISPONIBILITATI = 'disponibilitati';

// Indexed by Date.getDay(); weekends never occur in a plan.
const DAY_NAMES: readonly (ZiSaptamana | null)[] = [
  null,
  'luni',
  'marți',
  'miercuri',
  'joi',
  'vineri',
  null,
];

const TO_DIRECTIE: Record<RideDirection, DirectieCursa> = {
  toSchool: 'spreScoala',
  toHome: 'spreCasa',
};

const FROM_DIRECTIE: Record<DirectieCursa, RideDirection> = {
  spreScoala: 'toSchool',
  spreCasa: 'toHome',
};

function getDayName(date: DateString): ZiSaptamana {
  const [year, month, day] = date.split('-').map(Number);
  const name = DAY_NAMES[new Date(year, month - 1, day).getDay()];
  if (!name) throw new Error(`${date} nu este o zi de școală.`);
  return name;
}

function planDoc(parentId: string, weekStart: DateString) {
  return doc(
    db,
    COLECTIE_PARINTI,
    parentId,
    SUBCOLECTIE_DISPONIBILITATI,
    weekStart,
  );
}

function toCursa(ride: PlannedRide): CursaDisponibila {
  return {
    data: ride.date,
    zi: getDayName(ride.date),
    directie: TO_DIRECTIE[ride.direction],
    oraPlecare: ride.departureTime,
    oraSosire: ride.arrivalTime,
    locuriDisponibile: ride.seats,
  };
}

function fromCursa(cursa: CursaDisponibila): PlannedRide {
  return {
    date: cursa.data,
    direction: FROM_DIRECTIE[cursa.directie],
    departureTime: cursa.oraPlecare as TimeString,
    arrivalTime: cursa.oraSosire as TimeString,
    seats: cursa.locuriDisponibile,
  };
}

/** The plan the parent already published for this week, or null. */
export async function loadWeekPlan(
  parentId: string,
  weekStart: DateString,
): Promise<WeekPlan | null> {
  const snapshot = await getDoc(planDoc(parentId, weekStart));
  if (!snapshot.exists()) return null;

  const data = snapshot.data() as Disponibilitate;
  return { homeAddress: data.adresaAcasa, rides: data.curse.map(fromCursa) };
}

/**
 * Calls `onChange` with the published plan for the week, now and after every publish.
 * Failures (for example no connection) are reported as "no plan" so the screen keeps working.
 */
export function subscribeWeekPlan(
  parentId: string,
  weekStart: DateString,
  onChange: (plan: WeekPlan | null) => void,
): Unsubscribe {
  return onSnapshot(
    planDoc(parentId, weekStart),
    (snapshot) => {
      if (!snapshot.exists()) return onChange(null);
      const data = snapshot.data() as Disponibilitate;
      onChange({
        homeAddress: data.adresaAcasa,
        rides: data.curse.map(fromCursa),
      });
    },
    () => onChange(null),
  );
}

/** Saves (or replaces) the parent's availability for the week starting `weekStart`. */
export async function saveWeekPlan(
  parentId: string,
  weekStart: DateString,
  plan: WeekPlan,
): Promise<void> {
  const disponibilitate: Disponibilitate = {
    parinteId: parentId,
    saptamana: weekStart,
    adresaAcasa: plan.homeAddress,
    curse: plan.rides.map(toCursa),
    actualizatLa: serverTimestamp(),
  };

  await setDoc(planDoc(parentId, weekStart), disponibilitate);
}

export function getSaveErrorMessage(error: unknown): string {
  const code = (error as { code?: string } | null)?.code ?? '';
  switch (code) {
    // The deadline is checked before sending, so a refusal means the server rejected the data.
    case 'permission-denied':
      return 'Serverul nu a acceptat planificarea. Verifică cursele și încearcă din nou.';
    case 'unavailable':
      return 'Nu ai conexiune la internet. Încearcă din nou.';
    default:
      return 'Nu am putut publica cursele. Încearcă din nou.';
  }
}
