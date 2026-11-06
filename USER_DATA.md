# KiddoFlux: user data in 5 minutes

For the developers building the availability calendar and the weekly matching algorithm.
Source of truth: `backend/src/types.ts` (types) and `backend/src/data/profiluri.ts` (the 15 demo parents).
The app has a copy of the types in `mobile/src/types/profil.ts`. Field names are in Romanian, as in Firebase.

## 1. Decisions already made

| Topic | Decision |
| --- | --- |
| Rides per parent per week | **minimum 3, maximum 5** (a week has 10 slots: 5 days × morning/afternoon) |
| Offering more than the maximum | **Not allowed.** The form must stop at 5. |
| When the algorithm runs | **Sunday, at the earliest** (planning closes Sunday 18:00, `PLANNING_DEADLINE_HOUR`) |
| Classes | **Not decided.** The algorithm owner decides how classes are grouped. |
| Shared data structure | A shared `data/` folder with types/templates that mirror Firebase (see section 6). |

Status in code: only the minimum exists (`MIN_RIDES = 3` in `mobile/src/features/plan-rides/PlanRidesScreen.tsx`). The maximum of 5 is **not enforced yet**.

## 2. Where the data lives

- **Firebase project:** `kiddoflux2026`. **Collection:** `parinti`. **One document per parent**, with document id = Firebase Auth uid = `id` (`parinte-01` … `parinte-15`).
- **A parent has exactly one child and one car** in the current data. The child and the car are nested inside the parent's document, not separate collections.
- **Who can read it:** a logged-in parent can read **only their own** document. Nobody can list the collection or write from the app (`backend/firestore.rules`). The algorithm therefore needs a trusted place (Admin SDK) to read everyone.
- **Login:** phone number + the shared code `123456`. In the app, `useAuth().profil` gives the logged-in parent's document.

## 3. The document: `parinti/{uid}`

```ts
ProfilParinte {
  id: string                // "parinte-01", same as the auth uid
  prenume: string           // parent's first name
  nume: string              // parent's surname
  numeComplet: string       // "Ana Popescu"
  telefon: string           // "0700 100 001"
  email: string
  adresaAcasa: string       // "Str. Lalelelor 12" (text only, no coordinates yet)

  scoala: {                 // the same for all 15 parents
    denumire: string        // "Scoala Gimnaziala Ion Luca Caragiale Sibiu"
    adresa: string          // "Strada Vasile Alecsandri 10, 550372 Sibiu"
  }

  vehicul: {
    marca: string           // "Dacia"
    model: string           // "Duster"
    anFabricatie: number    // 2021
    culoare: string         // "Gri"
    numarLocuri: number     // total seats, INCLUDING the driver (5 or 7)
    numarInmatriculare: string  // "SB 21 KFA"
    locuriScaunCopii: number    // child seats the car has (0–3)
  }

  copil: {
    prenume: string         // first name only; surnames of children are never stored
    inaltimeCm: number
    numarMatricol: string   // "2024/0187", text
    clasa: string           // "a III-a", "a IV-a", "pregătitoare" …
    necesitaScaunAuto: boolean  // true when inaltimeCm < 135
  }

  zileDisponibile: ('luni' | 'marți' | 'miercuri' | 'joi' | 'vineri')[]
                            // weekdays this parent CAN drive (a standing default, not a weekly plan)

  consimtamant: {
    acordat: boolean
    data: string | null     // "2026-09-14" or null
  }
}
```

Example (shortened) for `parinte-01`:

```json
{
  "id": "parinte-01", "numeComplet": "Ana Popescu", "telefon": "0700 100 001",
  "adresaAcasa": "Str. Lalelelor 12",
  "vehicul": { "marca": "Dacia", "model": "Duster", "numarLocuri": 5, "locuriScaunCopii": 2 },
  "copil": { "prenume": "Luca", "inaltimeCm": 128, "clasa": "a III-a", "necesitaScaunAuto": true },
  "zileDisponibile": ["luni", "marți", "miercuri", "joi", "vineri"],
  "consimtamant": { "acordat": true, "data": "2026-09-14" }
}
```

## 4. The 15 demo parents at a glance

Login for any of them: the phone below + code `123456`.
"Locuri" = total seats / child seats. "Scaun" = the child is under 135 cm and needs a child seat.
"Nu poate" = weekdays the parent cannot drive.

| id | Telefon | Părinte | Copil (clasa) | Înălțime | Mașină | Locuri | Nu poate | Consimțământ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| parinte-01 | 0700 100 001 | Ana Popescu | Luca (a III-a) | 128 cm · scaun | Dacia Duster | 5 / 2 | — | da |
| parinte-02 | 0700 100 002 | Ioana Pavel | Maria (a III-a) | 137 cm | Skoda Octavia | 5 / 1 | vineri | da |
| parinte-03 | 0700 100 003 | Mihai Dumitru | Andrei (a IV-a) | 142 cm | Volkswagen Touran | 7 / 3 | — | da |
| parinte-04 | 0700 100 004 | Elena Radu | Sofia (a II-a) | 124 cm · scaun | Renault Clio | 5 / 1 | miercuri | da |
| parinte-05 | 0700 100 005 | Dan Constantin | David (a IV-a) | 138 cm | Ford Focus | 5 / 0 | — | da |
| parinte-06 | 0700 100 006 | Cristina Munteanu | Teodora (a IV-a) | 139 cm | Toyota RAV4 | 5 / 2 | — | da |
| parinte-07 | 0700 100 007 | Bogdan Stan | Matei (a IV-a) | 144 cm | Hyundai Tucson | 5 / 2 | luni | da |
| parinte-08 | 0700 100 008 | Alina Ionescu | Daria (a I-a) | 121 cm · scaun | Opel Zafira | 7 / 3 | — | da |
| parinte-09 | 0700 100 009 | Vlad Georgescu | Rareș (a IV-a) | 145 cm | Skoda Kodiaq | 7 / 3 | — | da |
| parinte-10 | 0700 100 010 | Raluca Dinu | Ilinca (a III-a) | 136 cm | Kia Ceed | 5 / 1 | joi | **nu** |
| parinte-11 | 0700 100 011 | Sorin Marinescu | Tudor (a III-a) | 135 cm | Dacia Logan | 5 / 0 | — | da |
| parinte-12 | 0700 100 012 | Monica Barbu | Irina (a III-a) | 133 cm · scaun | Peugeot 3008 | 5 / 2 | marți, vineri | da |
| parinte-13 | 0700 100 013 | Florin Toma | Ștefan (a IV-a) | 143 cm | Ford Galaxy | 7 / 3 | — | da |
| parinte-14 | 0700 100 014 | Adriana Lupu | Sara (pregătitoare) | 117 cm · scaun | Volkswagen Golf | 5 / 1 | — | **nu** |
| parinte-15 | 0700 100 015 | Gabriel Neagu | Victor (a III-a) | 141 cm | Honda CR-V | 5 / 2 | luni, joi | da |

Things the data shows that the algorithm will meet:
- **Classes in the data:** pregătitoare (1), a I-a (1), a II-a (1), a III-a (6), a IV-a (6). Class-based pools are small, so decide early whether classes can be mixed.
- **Child seats:** 5 children need one (parinte-01, 04, 08, 12, 14). Cars with `locuriScaunCopii = 0` are parinte-05 and 11, so they can't carry such a child.
- **Edge case:** parinte-11's child is exactly 135 cm. The rule is "under 135 cm", so no seat is needed.
- **Consent:** parinte-10 and 14 have not given consent. Whether they take part in matching is **not decided**.

## 5. What is NOT in Firebase yet

| Missing | Notes |
| --- | --- |
| A parent's **weekly availability** (time spans per day) | The planning form `mobile/src/features/plan-rides/` collects it as `WeekPlan` but its `onPublish` saves nothing. This is the first feature to build. |
| **Rides / schedule produced by the algorithm** | The Calendar (`mobile/src/features/calendar/`) still uses mock data (`CalendarRide` in `types.ts`). |
| **Coordinates** of homes and school | Only text addresses exist. Pickup order and detours need `lat`/`lng`. |
| **Groups** of families | Not stored anywhere yet. |
| Notifications, alerts, handover events | Not built. |

Existing type for what a parent plans (not stored yet), in `mobile/src/features/plan-rides/types.ts`:

```ts
PlannedRide { date: "YYYY-MM-DD", direction: 'toSchool' | 'toHome', departureTime, arrivalTime, seats }
WeekPlan    { homeAddress: string, rides: PlannedRide[] }   // rides.length must be 3 to 5
```

## 6. Proposal: the shared `data/` folder

The algorithm owner asked for one place with types and templates that match Firebase. Suggested layout, at the repo root so both `mobile/` and `backend/` can use it:

```
data/
  types.ts        ProfilParinte, Disponibilitate (WeekPlan), Cursa (the algorithm output) …
  constants.ts    RIDES_MIN = 3, RIDES_MAX = 5, school constant, 135 cm rule, day names
  templates/      small example JSON per collection (one parent, one availability, one ride)
```

Rules for it:
- It is the **only** copy of the types. Today the profile type exists twice (`backend/src/types.ts`, `mobile/src/types/profil.ts`); the new folder replaces both.
- Field names stay Romanian, exactly as in Firebase.
- Whoever changes a collection changes `data/types.ts` and its template in the same commit.
- The app is Expo Go, so the folder must be plain TypeScript (no native code). Metro needs a config change (or a symlink/workspace) to import files outside `mobile/`; decide this before moving files.

## 7. Still open

1. How classes are grouped (algorithm owner).
2. Do parents without consent (parinte-10, 14) take part in matching?
3. Is `zileDisponibile` (standing days) combined with the weekly availability, or is the weekly plan the only source?
4. Where the algorithm runs on Sunday (script, endpoint or Cloud Function), since the app can't read other parents' data.
