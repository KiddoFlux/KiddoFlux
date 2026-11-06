import type { Scoala } from './types';

/** Aceeasi scoala pentru toate cele 15 profiluri. */
export const SCOALA: Scoala = {
  denumire: 'Scoala Gimnaziala Ion Luca Caragiale Sibiu',
  adresa: 'Strada Vasile Alecsandri 10, 550372 Sibiu',
};

/** Colectia Firestore cu profilurile parintilor. */
export const COLECTIE_PARINTI = 'parinti';

/** Codul de acces comun tuturor conturilor demo (parola din Firebase Auth; minim 6 caractere). */
export const COD_DEMO = '123456';

/** Domeniul adreselor de email sintetice folosite pentru autentificare. */
export const DOMENIU_EMAIL_AUTENTIFICARE = 'demo.kiddoflux.ro';

/** Copiii sub aceasta inaltime au nevoie de scaun auto omologat (cerinte, sectiunea 6.2). */
export const INALTIME_SCAUN_AUTO_CM = 135;

/** Subcolectia `parinti/{uid}/disponibilitati/{saptamana}` cu planul saptamanal al parintelui. */
export const SUBCOLECTIE_DISPONIBILITATI = 'disponibilitati';

/** Minimum de curse oferite de un parinte pe saptamana (din 10: 5 zile × dimineata/dupa-amiaza). Fara maxim. */
export const CURSE_MIN = 3;
