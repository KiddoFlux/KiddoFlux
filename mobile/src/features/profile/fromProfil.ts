import type { ProfilParinte } from '@/types/profil';
import { determinaTipScaun } from '@/utils/scaunAuto';

import type { ProfileData } from './types';

function formateazaDataDeclarare(dataIso?: string | null): string | null {
  if (!dataIso) return null;
  try {
    const d = new Date(dataIso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return null;
  }
}

/** Maps the Firestore profile (Romanian field names) to what the Profile screen draws. */
export function toProfileData(profil: ProfilParinte): ProfileData {
  const { copil, scoala, vehicul } = profil;
  const infoScaun = determinaTipScaun(copil.inaltimeCm);

  return {
    firstName: copil.prenume,
    initial: profil.prenume.charAt(0).toUpperCase(),
    heightCm: copil.inaltimeCm,
    grade: copil.clasa,
    matriculationNumber: copil.numarMatricol,
    seatTypeLabel: infoScaun.label,
    seatTypeBadge: infoScaun.badgeLabel,
    needsChildSeat: infoScaun.necesitaScaunAuto,
    lastHeightDeclaration: formateazaDataDeclarare(
      profil.ultimaDeclarareInaltime ?? copil.inaltimeActualizataLa,
    ),
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
