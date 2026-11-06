/**
 * Documentul Firestore `parinti/{uid}`.
 * Copie a tipului din `backend/src/types.ts`: pastreaza-le la fel cand schimbi unul dintre ele.
 */

export type ZiSaptamana = 'luni' | 'marți' | 'miercuri' | 'joi' | 'vineri';

export type Scoala = {
  denumire: string;
  adresa: string;
};

export type Vehicul = {
  marca: string;
  model: string;
  anFabricatie: number;
  culoare: string;
  /** Locuri totale, inclusiv al soferului. */
  numarLocuri: number;
  numarInmatriculare: string;
  /** Cate scaune auto pentru copii are masina. */
  locuriScaunCopii: number;
};

export type Copil = {
  /** Doar prenumele: nu stocam numele de familie al copiilor. */
  prenume: string;
  inaltimeCm: number;
  numarMatricol: string;
  clasa: string;
  necesitaScaunAuto: boolean;
};

export type Consimtamant = {
  acordat: boolean;
  data: string | null;
};

export type ProfilParinte = {
  /** Si uid-ul din Firebase Auth. */
  id: string;
  prenume: string;
  nume: string;
  numeComplet: string;
  telefon: string;
  email: string;
  adresaAcasa: string;
  scoala: Scoala;
  vehicul: Vehicul;
  copil: Copil;
  zileDisponibile: ZiSaptamana[];
  consimtamant: Consimtamant;
};
