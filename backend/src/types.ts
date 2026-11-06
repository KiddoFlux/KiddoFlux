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
  /** Numar de inmatriculare (fictiv), format Sibiu: "SB 21 KFA". */
  numarInmatriculare: string;
  /** Cate scaune auto pentru copii are masina (cel mult numarLocuri - 1). */
  locuriScaunCopii: number;
};

export type Copil = {
  /** Doar prenumele: nu stocam numele de familie al copiilor. */
  prenume: string;
  inaltimeCm: number;
  /** Numar matricol, text (poate contine separatori), ex. "2024/0187". */
  numarMatricol: string;
  /** Clasa, ex. "a III-a" sau "pregătitoare". */
  clasa: string;
  /** Adevarat daca inaltimeCm < INALTIME_SCAUN_AUTO_CM. */
  necesitaScaunAuto: boolean;
};

export type Consimtamant = {
  acordat: boolean;
  /** Data acordului (YYYY-MM-DD) sau null daca nu a fost acordat. */
  data: string | null;
};

/** Documentul Firestore `parinti/{id}`. */
export type ProfilParinte = {
  /** Si uid-ul din Firebase Auth: "parinte-01" ... "parinte-15". */
  id: string;
  prenume: string;
  nume: string;
  numeComplet: string;
  /** Format afisat, ex. "0700 100 001". */
  telefon: string;
  email: string;
  adresaAcasa: string;
  scoala: Scoala;
  vehicul: Vehicul;
  copil: Copil;
  zileDisponibile: ZiSaptamana[];
  consimtamant: Consimtamant;
};
