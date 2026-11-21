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
import { existsSync, readFileSync } from 'node:fs';

import { telefonLaEmail } from '../src/auth';
import { COD_DEMO, COLECTIE_CURSE, COLECTIE_PARINTI } from '../src/constants';
import { PROFILURI } from '../src/data/profiluri';
import type { CopilCursa, CursaGrup, DirectieCursa, ProfilParinte, ZiSaptamana } from '../src/types';

const PROJECT_ID = process.env.GCLOUD_PROJECT ?? process.env.FIREBASE_PROJECT_ID ?? 'kiddoflux2026';
const folosesteEmulator = Boolean(
  process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST,
);

function initializeazaApp() {
  if (getApps().length > 0) return;
  let cale = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!folosesteEmulator && !cale) {
    if (existsSync('./serviceAccount.json')) {
      cale = './serviceAccount.json';
    } else if (existsSync('serviceAccount.json')) {
      cale = 'serviceAccount.json';
    }
  }
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

  console.log(`\nGenerare curse carpool pentru saptamana curenta si viitoare...`);
  const curse = genereazaCurseDemo(PROFILURI);
  for (const cursa of curse) {
    await db.collection(COLECTIE_CURSE).doc(cursa.id).set(cursa);
  }
  console.log(`  Incarcat ${curse.length} curse in colectia "${COLECTIE_CURSE}".`);

  console.log(`\nGata. Autentificare: telefon + cod "${COD_DEMO}".`);
}

const ZILE: ZiSaptamana[] = ['luni', 'marți', 'miercuri', 'joi', 'vineri'];

function toISODate(d: Date): string {
  const an = d.getFullYear();
  const luna = String(d.getMonth() + 1).padStart(2, '0');
  const zi = String(d.getDate()).padStart(2, '0');
  return `${an}-${luna}-${zi}`;
}

function adaugaZile(d: Date, zile: number): Date {
  const rez = new Date(d);
  rez.setDate(rez.getDate() + zile);
  return rez;
}

function genereazaCurseDemo(profiluri: ProfilParinte[]): CursaGrup[] {
  const parintiGrup = profiluri.slice(0, 5);
  const gasesteParinte = (id: string) => parintiGrup.find((p) => p.id === id) ?? parintiGrup[0];

  const copiiGrup: CopilCursa[] = parintiGrup.map((p) => ({
    id: `copil-${p.id}`,
    parinteId: p.id,
    prenume: p.copil.prenume,
    initiala: p.copil.prenume.charAt(0).toUpperCase(),
    clasa: p.copil.clasa,
    necesitaScaunAuto: p.copil.necesitaScaunAuto,
  }));

  const astazi = new Date();
  const ziSapt = (astazi.getDay() + 6) % 7;
  const luneaCurenta = new Date(astazi);
  luneaCurenta.setDate(astazi.getDate() - ziSapt);
  luneaCurenta.setHours(0, 0, 0, 0);

  // Soferii pentru saptamana curenta [dimineata, dupa-amiaza]
  const soferiSaptamana1: [string, string][] = [
    ['parinte-01', 'parinte-02'], // Luni: Ana Popescu, Ioana Pavel
    ['parinte-03', 'parinte-04'], // Marti: Mihai Dumitru, Elena Radu
    ['parinte-01', 'parinte-05'], // Miercuri: Ana Popescu, Dan Constantin
    ['parinte-02', 'parinte-01'], // Joi: Ioana Pavel, Ana Popescu
    ['parinte-04', 'parinte-03'], // Vineri: Elena Radu, Mihai Dumitru
  ];

  // Soferii pentru saptamana viitoare
  const soferiSaptamana2: [string, string][] = [
    ['parinte-05', 'parinte-01'],
    ['parinte-02', 'parinte-03'],
    ['parinte-04', 'parinte-01'],
    ['parinte-01', 'parinte-05'],
    ['parinte-03', 'parinte-02'],
  ];

  const curse: CursaGrup[] = [];

  const creeazaCursePentruSaptamana = (lunea: Date, orarSoferi: [string, string][]) => {
    orarSoferi.forEach(([soferDimineataId, soferDupaAmiazaId], indexZi) => {
      const dataCursa = adaugaZile(lunea, indexZi);
      const dataIso = toISODate(dataCursa);
      const zi = ZILE[indexZi];

      const soferAM = gasesteParinte(soferDimineataId);
      const soferPM = gasesteParinte(soferDupaAmiazaId);

      // Cursa de dimineata (spre scoala)
      curse.push({
        id: `${dataIso}-morning`,
        data: dataIso,
        zi,
        directie: 'spreScoala',
        oraPlecare: '07:35',
        oraSosire: '08:00',
        soferId: soferAM.id,
        soferNume: soferAM.numeComplet,
        soferPrenume: soferAM.prenume,
        soferTelefon: soferAM.telefon,
        soferMasina: `${soferAM.vehicul.marca} ${soferAM.vehicul.model} (${soferAM.vehicul.culoare})`,
        locuriTotale: soferAM.vehicul.numarLocuri - 1,
        locuriOcupate: copiiGrup.length,
        copii: copiiGrup,
        necesitaInlocuitor: false,
      });

      // Cursa de dupa-amiaza (spre casa)
      curse.push({
        id: `${dataIso}-afternoon`,
        data: dataIso,
        zi,
        directie: 'spreCasa',
        oraPlecare: '14:30',
        oraSosire: '15:00',
        soferId: soferPM.id,
        soferNume: soferPM.numeComplet,
        soferPrenume: soferPM.prenume,
        soferTelefon: soferPM.telefon,
        soferMasina: `${soferPM.vehicul.marca} ${soferPM.vehicul.model} (${soferPM.vehicul.culoare})`,
        locuriTotale: soferPM.vehicul.numarLocuri - 1,
        locuriOcupate: copiiGrup.length,
        copii: copiiGrup,
        necesitaInlocuitor: false,
      });
    });
  };

  creeazaCursePentruSaptamana(luneaCurenta, soferiSaptamana1);
  creeazaCursePentruSaptamana(adaugaZile(luneaCurenta, 7), soferiSaptamana2);

  return curse;
}


main().catch((eroare) => {
  console.error(eroare);
  process.exit(1);
});
