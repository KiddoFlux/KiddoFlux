import {
  INALTIME_INALTATOR_MIN_CM,
  INALTIME_SCAUN_AUTO_CM,
  INTERVAL_DECLARARE_LUNARA_ZILE,
} from './constants';
import type { Copil, ProfilParinte, TipScaunAuto } from './types';

export type InfoScaunAuto = {
  tip: TipScaunAuto;
  label: string;
  badgeLabel: string;
  descriere: string;
  necesitaScaunAuto: boolean;
};

/**
 * Determina categoria de scaun auto conform Codului Rutier si standardului UN R129:
 * - < 105 cm: Scaun auto integrat (cu spatar si ham propriu de siguranta in 5 puncte)
 * - 105 - 134 cm: Inaltator auto omologat (booster seat)
 * - >= 135 cm: Centura de siguranta a masinii (fara scaun special)
 */
export function determinaTipScaun(inaltimeCm: number): InfoScaunAuto {
  if (inaltimeCm < INALTIME_INALTATOR_MIN_CM) {
    return {
      tip: 'scaun_integrat',
      label: 'Scaun cu ham propriu',
      badgeLabel: 'Scaun auto (< 105 cm)',
      descriere:
        'Copilul are sub 105 cm și necesită scaun auto omologat cu spătar și ham de prindere propriu.',
      necesitaScaunAuto: true,
    };
  }
  if (inaltimeCm < INALTIME_SCAUN_AUTO_CM) {
    return {
      tip: 'inaltator',
      label: 'Înălțător auto',
      badgeLabel: 'Înălțător (105 – 134 cm)',
      descriere:
        'Copilul are între 105 și 134 cm și necesită înălțător auto omologat (recomandat cu spătar).',
      necesitaScaunAuto: true,
    };
  }
  return {
    tip: 'centura_normala',
    label: 'Centură standard adulți',
    badgeLabel: 'Fără scaun special (≥ 135 cm)',
    descriere:
      'Copilul are 135 cm sau mai mult și poate folosi centura de siguranță normală a mașinii.',
    necesitaScaunAuto: false,
  };
}

export type StatusDeclarareInaltime = {
  necesita: boolean;
  motiv: 'prima_autentificare' | 'lunar' | null;
  zileTrecute?: number;
};

/**
 * Verifica daca parintele are obligatia de a declara/confirma inaltimea copiilor:
 * 1. Prima autentificare: cont creat automat, fara nicio declarare anterioara.
 * 2. Verificare lunara: au trecut cel putin 30 de zile de la ultima declarare.
 */
export function verificaNecesitateDeclarareInaltime(
  profil: ProfilParinte | null,
  acum: Date = new Date(),
): StatusDeclarareInaltime {
  if (!profil) {
    return { necesita: false, motiv: null };
  }

  if (!profil.ultimaDeclarareInaltime) {
    return { necesita: true, motiv: 'prima_autentificare' };
  }

  const dataUltima = new Date(profil.ultimaDeclarareInaltime).getTime();
  if (Number.isNaN(dataUltima)) {
    return { necesita: true, motiv: 'prima_autentificare' };
  }

  const zileTrecute = Math.floor(
    (acum.getTime() - dataUltima) / (1000 * 60 * 60 * 24),
  );

  if (zileTrecute >= INTERVAL_DECLARARE_LUNARA_ZILE) {
    return { necesita: true, motiv: 'lunar', zileTrecute };
  }

  return { necesita: false, motiv: null, zileTrecute };
}

/**
 * Returneaza lista copiilor din profil, suportand atat schema curenta (copil unic)
 * cat si familiile cu mai multi copii (copii[]).
 */
export function extrageCopiiProfil(profil: ProfilParinte | null): Copil[] {
  if (!profil) return [];
  if (profil.copii && profil.copii.length > 0) {
    return profil.copii;
  }
  return profil.copil ? [profil.copil] : [];
}
