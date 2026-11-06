import type { ProfilParinte } from '@/types/profil';

import type { ProfileData } from './types';

/** Maps the Firestore profile (Romanian field names) to what the Profile screen draws. */
export function toProfileData(profil: ProfilParinte): ProfileData {
  const { copil, scoala, vehicul } = profil;

  return {
    firstName: copil.prenume,
    initial: profil.prenume.charAt(0).toUpperCase(),
    heightCm: copil.inaltimeCm,
    grade: copil.clasa,
    matriculationNumber: copil.numarMatricol,
    avatarUrl: null,

    schoolName: scoala.denumire,
    schoolAddress: scoala.adresa,

    parentName: profil.numeComplet,
    parentPhone: profil.telefon,
    parentEmail: profil.email,
    homeAddress: profil.adresaAcasa,

    vehicleName: `${vehicul.marca} ${vehicul.model}`,
    vehicleYear: vehicul.anFabricatie,
    vehicleColor: vehicul.culoare,
    vehiclePlate: vehicul.numarInmatriculare,
    vehicleSeats: vehicul.numarLocuri,
    vehicleChildSeats: vehicul.locuriScaunCopii,
  };
}
