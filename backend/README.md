# KiddoFlux backend: profiluri demo de părinți

Firebase (Auth + Firestore), proiect `kiddoflux2026`. Conține 15 profiluri **fictive** de părinți de la
„Scoala Gimnaziala Ion Luca Caragiale Sibiu”. Nu există creare de conturi: te poți doar autentifica într-unul
dintre cele 15 conturi.

## Autentificare

- Utilizator: **numărul de telefon** al părintelui (ex. `0700 100 001`; se acceptă și `+40700100001`).
- Cod: **`123456`** (același pentru toate conturile; vezi `COD_DEMO` în `src/constants.ts`).
- În Firebase Auth fiecare cont are emailul sintetic `<telefon>@demo.kiddoflux.ro`. Aplicația transformă telefonul
  în email cu `telefonLaEmail()` din `src/auth.ts` și apelează `signInWithEmailAndPassword`.
- Profilul se citește din `parinti/<uid>`. Regulile (`firestore.rules`) permit citirea doar a propriului document.

Conturile sunt `parinte-01` … `parinte-15`, cu telefoanele `0700 100 001` … `0700 100 015`.

## Câmpuri (`parinti/{uid}`)

| Câmp | Conținut |
| --- | --- |
| `id`, `prenume`, `nume`, `numeComplet` | identitate părinte |
| `telefon`, `email`, `adresaAcasa` | contact și adresa de acasă (pentru traseu) |
| `scoala.denumire`, `scoala.adresa` | aceleași pentru toți (`src/constants.ts`) |
| `vehicul.marca`, `.model`, `.anFabricatie`, `.culoare`, `.numarLocuri`, `.numarInmatriculare`, `.locuriScaunCopii` | mașina |
| `copil.prenume`, `.inaltimeCm`, `.numarMatricol`, `.clasa`, `.necesitaScaunAuto` | copilul (doar prenumele) |
| `zileDisponibile` | zilele în care părintele poate conduce |
| `consimtamant.acordat`, `.data` | acordul părintelui (2 profiluri nu l-au dat încă) |
| `creatLa` | adăugat de scriptul de seed |

`copil.necesitaScaunAuto` este adevărat când `inaltimeCm < 135`. Tipurile sunt în `src/types.ts`, datele în
`src/data/profiluri.ts`.

## Rulare

```bash
cd backend
npm install
npm test            # teste pe date și pe transformarea telefon -> email
npm run typecheck
```

### Încărcarea datelor (seed)

Firebase CLI vine odată cu `npm install` (este în `devDependencies`), deci nu trebuie instalat global.

Cu emulatoarele Firebase (necesită Java pentru Firestore):

```bash
npm run emulators
# în alt terminal:
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 npm run seed
```

Pe proiectul real:

1. În Firebase Console activează **Authentication → Sign-in method → Email/Password** și creează baza **Firestore**.
2. Descarcă o cheie de service account (Project settings → Service accounts) și păstreaz-o în afara git
   (`serviceAccount*.json` este ignorat).
3. `GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json npm run seed`
4. Publică regulile: `npm run login` (o singură dată, cu contul Google al proiectului), apoi `npm run deploy:rules`.

Scriptul poate fi rulat de mai multe ori: uid-urile sunt fixe, deci nu apar dubluri (`creatLa` se rescrie).

## Date fictive

Numele, telefoanele (`0700 100 xxx`), numerele de înmatriculare și numerele matricole sunt inventate. Nu folosi date
reale în acest depozit.
