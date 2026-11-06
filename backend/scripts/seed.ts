/**
 * Incarca cele 15 profiluri demo:
 *   - creeaza/actualizeaza utilizatorii din Firebase Auth (email sintetic din telefon + COD_DEMO)
 *   - scrie documentele `parinti/{uid}` in Firestore
 *
 * Se poate rula de mai multe ori (uid-urile sunt fixe, deci nu apar dubluri).
 *
 * Emulatoare:  FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 npm run seed
 * Proiectul real: GOOGLE_APPLICATION_CREDENTIALS=<cale cheie service account> npm run seed
 */
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'node:fs';

import { telefonLaEmail } from '../src/auth';
import { COD_DEMO, COLECTIE_PARINTI } from '../src/constants';
import { PROFILURI } from '../src/data/profiluri';

const PROJECT_ID = process.env.GCLOUD_PROJECT ?? process.env.FIREBASE_PROJECT_ID ?? 'kiddoflux2026';
const folosesteEmulator = Boolean(
  process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST,
);

function initializeazaApp() {
  if (getApps().length > 0) return;
  const cale = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!folosesteEmulator && !cale) {
    throw new Error(
      'Lipseste GOOGLE_APPLICATION_CREDENTIALS (cheia de service account) si nu e setat niciun emulator.',
    );
  }
  if (!folosesteEmulator && cale) {
    initializeApp({ credential: cert(JSON.parse(readFileSync(cale, 'utf8'))), projectId: PROJECT_ID });
  } else {
    initializeApp({ projectId: PROJECT_ID });
  }
}

async function main() {
  initializeazaApp();
  const auth = getAuth();
  const db = getFirestore();

  console.log(
    `Proiect: ${PROJECT_ID} (${folosesteEmulator ? 'EMULATOR' : 'PRODUCTIE'}) - ${PROFILURI.length} profiluri`,
  );

  for (const profil of PROFILURI) {
    const email = telefonLaEmail(profil.telefon);
    if (!email) throw new Error(`Telefon invalid pentru ${profil.id}: ${profil.telefon}`);

    const dateAuth = { email, password: COD_DEMO, displayName: profil.numeComplet, emailVerified: true };
    try {
      await auth.updateUser(profil.id, dateAuth);
    } catch (eroare) {
      if ((eroare as { code?: string }).code !== 'auth/user-not-found') throw eroare;
      await auth.createUser({ uid: profil.id, ...dateAuth });
    }

    await db
      .collection(COLECTIE_PARINTI)
      .doc(profil.id)
      .set({ ...profil, creatLa: FieldValue.serverTimestamp() });

    console.log(`  ${profil.id}  ${profil.numeComplet.padEnd(22)} ${profil.telefon}`);
  }

  console.log(`Gata. Autentificare: telefon + cod "${COD_DEMO}".`);
}

main().catch((eroare) => {
  console.error(eroare);
  process.exit(1);
});
