/** Domeniul emailurilor sintetice create de scriptul de seed (backend/src/constants.ts). */
const DOMENIU_EMAIL_AUTENTIFICARE = 'demo.kiddoflux.ro';

/**
 * Aduce un numar de telefon romanesc la forma nationala cu 10 cifre ("07xxxxxxxx").
 * Accepta spatii, puncte, liniute si prefixele +40 / 0040 / 40.
 * Intoarce null daca nu este un mobil romanesc valid.
 * Copie a functiei din `backend/src/auth.ts`.
 */
export function normalizeazaTelefon(telefon: string): string | null {
  let cifre = telefon.replace(/[^\d+]/g, '');
  if (cifre.startsWith('+')) cifre = cifre.slice(1);
  if (cifre.startsWith('0040')) cifre = cifre.slice(4);
  else if (cifre.startsWith('40') && cifre.length === 11) cifre = cifre.slice(2);
  if (cifre.length === 9 && cifre.startsWith('7')) cifre = `0${cifre}`;
  return /^07\d{8}$/.test(cifre) ? cifre : null;
}

/** Emailul din Firebase Auth pentru un telefon, sau null daca telefonul e invalid. */
export function telefonLaEmail(telefon: string): string | null {
  const normalizat = normalizeazaTelefon(telefon);
  return normalizat ? `${normalizat}@${DOMENIU_EMAIL_AUTENTIFICARE}` : null;
}
