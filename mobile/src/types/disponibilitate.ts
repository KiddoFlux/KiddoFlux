/**
 * Documentul Firestore `parinti/{uid}/disponibilitati/{saptamana}`.
 * Copie a tipului din `backend/src/types.ts`: pastreaza-le la fel cand schimbi unul dintre ele.
 */

import type { ZiSaptamana } from './profil';

/** Dimineata: acasa → scoala. Dupa-amiaza: scoala → acasa. */
export type DirectieCursa = 'spreScoala' | 'spreCasa';

/** O cursa pe care parintele o poate face (nu inseamna ca o va face: decide algoritmul). */
export type CursaDisponibila = {
  /** Data cursei, "YYYY-MM-DD". */
  data: string;
  zi: ZiSaptamana;
  directie: DirectieCursa;
  /** "HH:mm": plecarea de acasa (spreScoala) sau de la scoala (spreCasa). */
  oraPlecare: string;
  /** "HH:mm": sosirea la scoala (spreScoala) sau acasa (spreCasa). */
  oraSosire: string;
  /** Locuri oferite copiilor, fara cel al soferului. */
  locuriDisponibile: number;
};

export type Disponibilitate = {
  parinteId: string;
  /** Lunea saptamanii, "YYYY-MM-DD"; este si id-ul documentului. */
  saptamana: string;
  /** Adresa de plecare pentru aceasta saptamana (poate diferi de profil.adresaAcasa). */
  adresaAcasa: string;
  /** Cel putin 3 curse, fara maxim (cel mult cele 10 sloturi ale saptamanii). */
  curse: CursaDisponibila[];
  /** Timestamp Firestore, pus de server la fiecare publicare. */
  actualizatLa: unknown;
};
