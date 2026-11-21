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

/**
 * 3 categorii standard de echipare conform Codului Rutier si UN R129:
 * - `scaun_integrat`: copil < 105 cm (scaun auto pentru copii mici, cu spatar si ham propriu)
 * - `inaltator`: 105 cm - 134 cm (inaltator auto omologat / booster seat)
 * - `centura_normala`: >= 135 cm (centura de siguranta a masinii, fara scaun special)
 */
export type TipScaunAuto = 'scaun_integrat' | 'inaltator' | 'centura_normala';

export type Copil = {
  /** Doar prenumele: nu stocam numele de familie al copiilor. */
  prenume: string;
  inaltimeCm: number;
  numarMatricol: string;
  clasa: string;
  necesitaScaunAuto: boolean;
  /** Categoria specifica de scaun ceruta de inaltimea copilului. */
  tipScaun?: TipScaunAuto;
  /** Data (ISO) la care a fost inregistrata/actualizata inaltimea copilului. */
  inaltimeActualizataLa?: string;
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
  avatarUrl?: string | null;
  adresaAcasa: string;
  scoala: Scoala;
  vehicul: Vehicul;
  /** Copilul principal sau unic. */
  copil: Copil;
  /** Lista completa de copii (pentru familii cu mai multi copii). */
  copii?: Copil[];
  /** Data (ISO) ultimei declarari a inaltimii. Daca lipseste/este null => prima autentificare. */
  ultimaDeclarareInaltime?: string | null;
  zileDisponibile: ZiSaptamana[];
  consimtamant: Consimtamant;
};
