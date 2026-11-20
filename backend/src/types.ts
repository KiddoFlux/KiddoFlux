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
  /** Numar matricol, text (poate contine separatori), ex. "2024/0187". */
  numarMatricol: string;
  /** Clasa, ex. "a III-a" sau "pregătitoare". */
  clasa: string;
  /** Adevarat daca inaltimeCm < INALTIME_SCAUN_AUTO_CM. */
  necesitaScaunAuto: boolean;
  /** Categoria specifica de scaun ceruta de inaltimea copilului. */
  tipScaun?: TipScaunAuto;
  /** Data (ISO) la care a fost inregistrata/actualizata inaltimea copilului. */
  inaltimeActualizataLa?: string;
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
  /** Copilul principal sau unic. */
  copil: Copil;
  /** Lista completa de copii (pentru familii cu mai multi copii). */
  copii?: Copil[];
  /** Data (ISO) ultimei declarari a inaltimii. Daca lipseste/este null => prima autentificare. */
  ultimaDeclarareInaltime?: string | null;
  zileDisponibile: ZiSaptamana[];
  consimtamant: Consimtamant;
};

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
  /** Locuri oferite copiilor, fara cel al soferului (cel mult vehicul.numarLocuri - 1). */
  locuriDisponibile: number;
};

/** Documentul Firestore `parinti/{uid}/disponibilitati/{saptamana}`, scris din aplicatie. */
export type Disponibilitate = {
  parinteId: string;
  /** Lunea saptamanii, "YYYY-MM-DD"; este si id-ul documentului. */
  saptamana: string;
  /** Adresa de plecare pentru aceasta saptamana (poate diferi de profil.adresaAcasa). */
  adresaAcasa: string;
  /** Cel putin CURSE_MIN curse, fara maxim (cel mult cele 10 sloturi ale saptamanii). */
  curse: CursaDisponibila[];
  /** Timestamp pus de server la fiecare publicare. */
  actualizatLa: unknown;
};
