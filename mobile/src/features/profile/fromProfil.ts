import type { ProfilParinte } from '@/types/profil';
import { determinaTipScaun, extrageCopiiProfil } from '@/utils/scaunAuto';

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

function formateazaZileDisponibile(zile: readonly string[]): string {
  if (!zile || zile.length === 0) return 'Nicio zi selectată';
  return zile.map((z) => z.charAt(0).toUpperCase() + z.slice(1)).join(', ');
}

function formateazaConsimtamant(
  consimtamant?: { acordat: boolean; data: string | null } | null,
): string {
  if (!consimtamant || !consimtamant.acordat) return 'Neacordat';
  const data = formateazaDataDeclarare(consimtamant.data);
  return data ? `Acordat la ${data}` : 'Acordat';
}

/** Maps the Firestore profile (Romanian field names) to what the Profile screen draws. */
export function toProfileData(profil: ProfilParinte): ProfileData {
  const { scoala, vehicul } = profil;
  const copii = extrageCopiiProfil(profil);
  const copilPrincipal = copii[0] ?? profil.copil;
  const infoScaun = determinaTipScaun(copilPrincipal.inaltimeCm);

  const additionalChildren =
    copii.length > 1
      ? copii.slice(1).map((c) => ({
          firstName: c.prenume,
          heightCm: c.inaltimeCm,
          grade: c.clasa,
          matriculationNumber: c.numarMatricol,
          seatTypeBadge: determinaTipScaun(c.inaltimeCm).badgeLabel,
        }))
      : undefined;

  return {
    firstName: copilPrincipal.prenume,
    initial: profil.prenume.charAt(0).toUpperCase(),
    heightCm: copilPrincipal.inaltimeCm,
    grade: copilPrincipal.clasa,
    matriculationNumber: copilPrincipal.numarMatricol,
    seatTypeLabel: infoScaun.label,
    seatTypeBadge: infoScaun.badgeLabel,
    needsChildSeat: infoScaun.necesitaScaunAuto,
    lastHeightDeclaration: formateazaDataDeclarare(
      profil.ultimaDeclarareInaltime ?? copilPrincipal.inaltimeActualizataLa,
    ),
    avatarUrl: profil.avatarUrl ?? null,

    schoolName: scoala.denumire,
    schoolAddress: scoala.adresa,

    parentName: profil.numeComplet,
    parentPhone: profil.telefon,
    parentEmail: profil.email,
    homeAddress: profil.adresaAcasa,
    availableDaysLabel: formateazaZileDisponibile(profil.zileDisponibile),
    consentLabel: formateazaConsimtamant(profil.consimtamant),

    additionalChildren,

    vehicleName: `${vehicul.marca} ${vehicul.model}`,
    vehicleYear: vehicul.anFabricatie,
    vehicleColor: vehicul.culoare,
    vehiclePlate: vehicul.numarInmatriculare,
    vehicleSeats: vehicul.numarLocuri,
    vehicleChildSeats: vehicul.locuriScaunCopii,
  };
}
