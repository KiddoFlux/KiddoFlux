import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { normalizeazaTelefon, telefonLaEmail } from '../src/auth';
import { INALTIME_SCAUN_AUTO_CM, SCOALA } from '../src/constants';
import { PROFILURI } from '../src/data/profiluri';

const unice = (valori: string[]) => new Set(valori).size === valori.length;

describe('profiluri demo', () => {
  it('sunt exact 15', () => {
    assert.equal(PROFILURI.length, 15);
  });

  it('au id-uri parinte-01 .. parinte-15, in ordine', () => {
    PROFILURI.forEach((p, i) => assert.equal(p.id, `parinte-${String(i + 1).padStart(2, '0')}`));
  });

  it('telefoanele, emailurile, numerele de inmatriculare si matricolele sunt unice', () => {
    assert.ok(unice(PROFILURI.map((p) => p.telefon)), 'telefon');
    assert.ok(unice(PROFILURI.map((p) => p.email)), 'email');
    assert.ok(unice(PROFILURI.map((p) => p.vehicul.numarInmatriculare)), 'numar de inmatriculare');
    assert.ok(unice(PROFILURI.map((p) => p.copil.numarMatricol)), 'numar matricol');
  });

  it('toate au aceeasi scoala si aceeasi adresa a scolii', () => {
    for (const p of PROFILURI) {
      assert.equal(p.scoala.denumire, 'Scoala Gimnaziala Ion Luca Caragiale Sibiu');
      assert.equal(p.scoala.adresa, 'Strada Vasile Alecsandri 10, 550372 Sibiu');
      assert.deepEqual(p.scoala, SCOALA);
    }
  });

  it('au campurile obligatorii completate', () => {
    for (const p of PROFILURI) {
      assert.ok(p.prenume && p.nume && p.telefon && p.email && p.adresaAcasa, p.id);
      assert.equal(p.numeComplet, `${p.prenume} ${p.nume}`);
      assert.ok(p.vehicul.marca && p.vehicul.model && p.vehicul.culoare, p.id);
      assert.ok(p.copil.prenume && p.copil.numarMatricol && p.copil.clasa, p.id);
      assert.ok(p.zileDisponibile.length > 0, p.id);
    }
  });

  it('telefoanele sunt valide si se transforma intr-un email unic', () => {
    for (const p of PROFILURI) assert.ok(normalizeazaTelefon(p.telefon), p.telefon);
    assert.ok(unice(PROFILURI.map((p) => telefonLaEmail(p.telefon) ?? '')));
  });

  it('vehiculele sunt coerente', () => {
    for (const { id, vehicul: v } of PROFILURI) {
      assert.ok(v.numarLocuri >= 4 && v.numarLocuri <= 7, `${id}: locuri`);
      assert.ok(v.locuriScaunCopii >= 0 && v.locuriScaunCopii <= v.numarLocuri - 1, `${id}: scaune copii`);
      assert.ok(v.anFabricatie >= 2010 && v.anFabricatie <= 2026, `${id}: an`);
      assert.match(v.numarInmatriculare, /^SB \d{2} [A-Z]{3}$/, `${id}: numar inmatriculare`);
    }
  });

  it('necesitaScaunAuto corespunde regulii inaltime < 135 cm', () => {
    for (const { id, copil: c } of PROFILURI) {
      assert.equal(c.necesitaScaunAuto, c.inaltimeCm < INALTIME_SCAUN_AUTO_CM, id);
      assert.match(c.numarMatricol, /^\d{4}\/\d{4}$/, `${id}: matricol`);
    }
  });

  it('are un amestec de copii cu si fara nevoie de scaun auto (aprox. o treime)', () => {
    const cuScaun = PROFILURI.filter((p) => p.copil.necesitaScaunAuto).length;
    assert.ok(cuScaun >= 4 && cuScaun <= 6, `copii cu scaun: ${cuScaun}`);
  });

  it('consimtamantul e coerent cu data acordului', () => {
    for (const { id, consimtamant: c } of PROFILURI) {
      assert.equal(c.acordat, c.data !== null, id);
    }
  });

  it('primul profil pastreaza datele din mock-urile aplicatiei (Ana Popescu / Luca)', () => {
    const [ana] = PROFILURI;
    assert.equal(ana.numeComplet, 'Ana Popescu');
    assert.equal(ana.email, 'ana.popescu@email.com');
    assert.deepEqual(
      [ana.copil.prenume, ana.copil.inaltimeCm, ana.copil.numarMatricol],
      ['Luca', 128, '2024/0187'],
    );
  });
});

describe('telefon -> email de autentificare', () => {
  const asteptat = '0700100001@demo.kiddoflux.ro';

  it('accepta aceeasi persoana scrisa in mai multe feluri', () => {
    for (const intrare of ['0700100001', '0700 100 001', '0700.100.001', '+40700100001', '+40 700 100 001', '0040700100001', '700100001']) {
      assert.equal(telefonLaEmail(intrare), asteptat, intrare);
    }
  });

  it('respinge numere invalide', () => {
    for (const intrare of ['', 'abc', '12345', '0212345678', '07001000011']) {
      assert.equal(telefonLaEmail(intrare), null, intrare);
    }
  });
});
