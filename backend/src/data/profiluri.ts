import { INALTIME_SCAUN_AUTO_CM, SCOALA } from '../constants';
import type { Copil, ProfilParinte, Vehicul, ZiSaptamana } from '../types';

/**
 * 15 profiluri FICTIVE de parinti de la Scoala Gimnaziala Ion Luca Caragiale Sibiu.
 * Nume, telefoane, numere de inmatriculare si numere matricole sunt inventate.
 */

const TOATE_ZILELE: ZiSaptamana[] = ['luni', 'marți', 'miercuri', 'joi', 'vineri'];
const fara = (...zile: ZiSaptamana[]) => TOATE_ZILELE.filter((z) => !zile.includes(z));

type Intrare = {
  nr: number;
  prenume: string;
  nume: string;
  email: string;
  adresaAcasa: string;
  vehicul: Vehicul;
  copil: Omit<Copil, 'necesitaScaunAuto'>;
  zileDisponibile?: ZiSaptamana[];
  /** Data acordului (YYYY-MM-DD); null = consimtamant neacordat inca. */
  consimtamant: string | null;
};

function telefonFictiv(nr: number): string {
  return `0700 100 ${String(nr).padStart(3, '0')}`;
}

function profil(i: Intrare): ProfilParinte {
  return {
    id: `parinte-${String(i.nr).padStart(2, '0')}`,
    prenume: i.prenume,
    nume: i.nume,
    numeComplet: `${i.prenume} ${i.nume}`,
    telefon: telefonFictiv(i.nr),
    email: i.email,
    adresaAcasa: i.adresaAcasa,
    scoala: { ...SCOALA },
    vehicul: i.vehicul,
    copil: { ...i.copil, necesitaScaunAuto: i.copil.inaltimeCm < INALTIME_SCAUN_AUTO_CM },
    zileDisponibile: i.zileDisponibile ?? TOATE_ZILELE,
    consimtamant: { acordat: i.consimtamant !== null, data: i.consimtamant },
  };
}

export const PROFILURI: ProfilParinte[] = [
  profil({
    nr: 1,
    prenume: 'Ana',
    nume: 'Popescu',
    email: 'ana.popescu@email.com',
    adresaAcasa: 'Str. Lalelelor 12',
    vehicul: { marca: 'Dacia', model: 'Duster', anFabricatie: 2021, culoare: 'Gri', numarLocuri: 5, numarInmatriculare: 'SB 21 KFA', locuriScaunCopii: 2 },
    copil: { prenume: 'Luca', inaltimeCm: 128, numarMatricol: '2024/0187', clasa: 'a III-a' },
    consimtamant: '2026-09-14',
  }),
  profil({
    nr: 2,
    prenume: 'Ioana',
    nume: 'Pavel',
    email: 'ioana.pavel@email.com',
    adresaAcasa: 'Str. Trandafirilor 5',
    vehicul: { marca: 'Skoda', model: 'Octavia', anFabricatie: 2019, culoare: 'Alb', numarLocuri: 5, numarInmatriculare: 'SB 47 MTR', locuriScaunCopii: 1 },
    copil: { prenume: 'Maria', inaltimeCm: 137, numarMatricol: '2024/0112', clasa: 'a III-a' },
    zileDisponibile: fara('vineri'),
    consimtamant: '2026-09-15',
  }),
  profil({
    nr: 3,
    prenume: 'Mihai',
    nume: 'Dumitru',
    email: 'mihai.dumitru@email.com',
    adresaAcasa: 'Str. Crizantemelor 8',
    vehicul: { marca: 'Volkswagen', model: 'Touran', anFabricatie: 2020, culoare: 'Negru', numarLocuri: 7, numarInmatriculare: 'SB 05 DMH', locuriScaunCopii: 3 },
    copil: { prenume: 'Andrei', inaltimeCm: 142, numarMatricol: '2023/0231', clasa: 'a IV-a' },
    consimtamant: '2026-09-14',
  }),
  profil({
    nr: 4,
    prenume: 'Elena',
    nume: 'Radu',
    email: 'elena.radu@email.com',
    adresaAcasa: 'Str. Teilor 21',
    vehicul: { marca: 'Renault', model: 'Clio', anFabricatie: 2018, culoare: 'Roșu', numarLocuri: 5, numarInmatriculare: 'SB 63 ERD', locuriScaunCopii: 1 },
    copil: { prenume: 'Sofia', inaltimeCm: 124, numarMatricol: '2024/0098', clasa: 'a II-a' },
    zileDisponibile: fara('miercuri'),
    consimtamant: '2026-09-16',
  }),
  profil({
    nr: 5,
    prenume: 'Dan',
    nume: 'Constantin',
    email: 'dan.constantin@email.com',
    adresaAcasa: 'Str. Plopilor 3',
    vehicul: { marca: 'Ford', model: 'Focus', anFabricatie: 2017, culoare: 'Albastru', numarLocuri: 5, numarInmatriculare: 'SB 18 DNC', locuriScaunCopii: 0 },
    copil: { prenume: 'David', inaltimeCm: 138, numarMatricol: '2023/0305', clasa: 'a IV-a' },
    consimtamant: '2026-09-17',
  }),
  profil({
    nr: 6,
    prenume: 'Cristina',
    nume: 'Munteanu',
    email: 'cristina.munteanu@email.com',
    adresaAcasa: 'Str. Salcâmilor 17',
    vehicul: { marca: 'Toyota', model: 'RAV4', anFabricatie: 2022, culoare: 'Argintiu', numarLocuri: 5, numarInmatriculare: 'SB 72 CRM', locuriScaunCopii: 2 },
    copil: { prenume: 'Teodora', inaltimeCm: 139, numarMatricol: '2023/0144', clasa: 'a IV-a' },
    consimtamant: '2026-09-14',
  }),
  profil({
    nr: 7,
    prenume: 'Bogdan',
    nume: 'Stan',
    email: 'bogdan.stan@email.com',
    adresaAcasa: 'Str. Bujorilor 9',
    vehicul: { marca: 'Hyundai', model: 'Tucson', anFabricatie: 2021, culoare: 'Verde', numarLocuri: 5, numarInmatriculare: 'SB 34 BGS', locuriScaunCopii: 2 },
    copil: { prenume: 'Matei', inaltimeCm: 144, numarMatricol: '2023/0176', clasa: 'a IV-a' },
    zileDisponibile: fara('luni'),
    consimtamant: '2026-09-18',
  }),
  profil({
    nr: 8,
    prenume: 'Alina',
    nume: 'Ionescu',
    email: 'alina.ionescu@email.com',
    adresaAcasa: 'Str. Macilor 14',
    vehicul: { marca: 'Opel', model: 'Zafira', anFabricatie: 2016, culoare: 'Gri', numarLocuri: 7, numarInmatriculare: 'SB 09 ALI', locuriScaunCopii: 3 },
    copil: { prenume: 'Daria', inaltimeCm: 121, numarMatricol: '2025/0063', clasa: 'a I-a' },
    consimtamant: '2026-09-15',
  }),
  profil({
    nr: 9,
    prenume: 'Vlad',
    nume: 'Georgescu',
    email: 'vlad.georgescu@email.com',
    adresaAcasa: 'Str. Narciselor 2',
    vehicul: { marca: 'Skoda', model: 'Kodiaq', anFabricatie: 2023, culoare: 'Negru', numarLocuri: 7, numarInmatriculare: 'SB 81 VLG', locuriScaunCopii: 3 },
    copil: { prenume: 'Rareș', inaltimeCm: 145, numarMatricol: '2022/0289', clasa: 'a IV-a' },
    consimtamant: '2026-09-16',
  }),
  profil({
    nr: 10,
    prenume: 'Raluca',
    nume: 'Dinu',
    email: 'raluca.dinu@email.com',
    adresaAcasa: 'Str. Florilor 30',
    vehicul: { marca: 'Kia', model: 'Ceed', anFabricatie: 2020, culoare: 'Alb', numarLocuri: 5, numarInmatriculare: 'SB 26 RLD', locuriScaunCopii: 1 },
    copil: { prenume: 'Ilinca', inaltimeCm: 136, numarMatricol: '2024/0157', clasa: 'a III-a' },
    zileDisponibile: fara('joi'),
    consimtamant: null,
  }),
  profil({
    nr: 11,
    prenume: 'Sorin',
    nume: 'Marinescu',
    email: 'sorin.marinescu@email.com',
    adresaAcasa: 'Str. Castanilor 6',
    vehicul: { marca: 'Dacia', model: 'Logan', anFabricatie: 2019, culoare: 'Albastru', numarLocuri: 5, numarInmatriculare: 'SB 55 SRM', locuriScaunCopii: 0 },
    // 135 cm exact: limita; nu mai are nevoie de scaun auto (regula este "sub 135 cm").
    copil: { prenume: 'Tudor', inaltimeCm: 135, numarMatricol: '2024/0202', clasa: 'a III-a' },
    consimtamant: '2026-09-17',
  }),
  profil({
    nr: 12,
    prenume: 'Monica',
    nume: 'Barbu',
    email: 'monica.barbu@email.com',
    adresaAcasa: 'Aleea Parcului 4',
    vehicul: { marca: 'Peugeot', model: '3008', anFabricatie: 2021, culoare: 'Bordo', numarLocuri: 5, numarInmatriculare: 'SB 40 MNB', locuriScaunCopii: 2 },
    copil: { prenume: 'Irina', inaltimeCm: 133, numarMatricol: '2024/0219', clasa: 'a III-a' },
    zileDisponibile: fara('marți', 'vineri'),
    consimtamant: '2026-09-18',
  }),
  profil({
    nr: 13,
    prenume: 'Florin',
    nume: 'Toma',
    email: 'florin.toma@email.com',
    adresaAcasa: 'Str. Brazilor 11',
    vehicul: { marca: 'Ford', model: 'Galaxy', anFabricatie: 2015, culoare: 'Argintiu', numarLocuri: 7, numarInmatriculare: 'SB 12 FLT', locuriScaunCopii: 3 },
    copil: { prenume: 'Ștefan', inaltimeCm: 143, numarMatricol: '2022/0318', clasa: 'a IV-a' },
    consimtamant: '2026-09-14',
  }),
  profil({
    nr: 14,
    prenume: 'Adriana',
    nume: 'Lupu',
    email: 'adriana.lupu@email.com',
    adresaAcasa: 'Str. Cireșilor 19',
    vehicul: { marca: 'Volkswagen', model: 'Golf', anFabricatie: 2019, culoare: 'Roșu', numarLocuri: 5, numarInmatriculare: 'SB 68 ADL', locuriScaunCopii: 1 },
    copil: { prenume: 'Sara', inaltimeCm: 117, numarMatricol: '2025/0031', clasa: 'pregătitoare' },
    consimtamant: null,
  }),
  profil({
    nr: 15,
    prenume: 'Gabriel',
    nume: 'Neagu',
    email: 'gabriel.neagu@email.com',
    adresaAcasa: 'Str. Merilor 7',
    vehicul: { marca: 'Honda', model: 'CR-V', anFabricatie: 2020, culoare: 'Gri', numarLocuri: 5, numarInmatriculare: 'SB 93 GBN', locuriScaunCopii: 2 },
    copil: { prenume: 'Victor', inaltimeCm: 141, numarMatricol: '2023/0267', clasa: 'a III-a' },
    zileDisponibile: fara('luni', 'joi'),
    consimtamant: '2026-09-15',
  }),
];
