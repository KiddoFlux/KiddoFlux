# Cerințe: School Journey App / KiddoFlux (prototip în 24 de ore)

Stare: ciornă v2, 8 noiembrie 2026 (actualizată după prezentarea KiddoFlux din noiembrie 2026).
Etichete folosite mai jos: **[DECIS]** = stabilit de echipă. **[PROPUS]** = sugestia mea, de confirmat sau schimbat. **[DESCHIS]** = are nevoie de un răspuns din partea echipei.

Notă: versiunea în engleză (`requirements.md`) rămâne sursa de adevăr pentru agenți și trebuie actualizată cu aceleași modificări. Această versiune în română este pentru echipă. Identificatorii tehnici (nume de câmpuri, enum-uri, JSON) rămân în engleză, ca în cod.

Pentru agenți: citiți tot fișierul înainte de a scrie cod. Nu adăugați funcții care nu sunt la „Obligatoriu” sau „De dorit”. Dacă o cerință nu e clară, alegeți varianta cea mai simplă, notați presupunerea în `ASSUMPTIONS.md` și continuați.

## Ce s-a schimbat în v2

1. **Clientul este școala privată (B2B).** Școala plătește licența (1.500 € pe an per școală, 3.500 € pe campus); părinții nu plătesc niciodată. Școlile publice, prin primării (B2G), urmează după ce există tracțiune la școlile private.
2. **Un singur flux:** șoferul din rotație duce grupul direct la poarta școlii. M5 nu mai există; numerotarea celorlalte cerințe rămâne neschimbată.
3. **Regula de rotație:** fiecare părinte conduce 3–5 dintre cele 10 sloturi ale săptămânii; între șoferii unui grup diferența este de cel mult un drum pe săptămână.
4. **Conflict nou, de rezolvat:** prezentarea arată „locația live a cursei”, iar regulile de confidențialitate (secțiunea 9) o interzic. Vezi secțiunea 13.
5. Întrebările deschise (secțiunea 13) și ordinea demo-ului (secțiunea 12) sunt actualizate.

---

## 1. Scop și context

Construim un prototip pentru un hackathon și pentru pilotul cu școli private (3–5 școli din Sibiu și Cluj, ianuarie–martie 2027). Produsul este vândut întâi școlilor private (B2B) și apoi primăriilor pentru școlile publice (B2G).

Produsul este un **strat de coordonare și comunicare pentru drumul spre școală**. Nu este o aplicație de ride-hailing. În centrul lui este **un singur algoritm** care grupează copiii din apropiere (familii din aceeași clasă sau școală), rotește echitabil părinții care conduc, verifică scaunele auto și confirmă fiecare predare între adulți. **[DECIS]**

Prototipul trebuie să arate, într-un demo de 5 minute, că:
1. algoritmul produce o rotație săptămânală sensibilă și echitabilă dintr-un set de familii;
2. fiecare predare (preluare, lăsare, sosire) este confirmată de un adult, în câteva secunde;
3. părinții, școala și administratorul văd aceeași stare și sunt alertați când lipsește un copil.

## 2. Produsul într-un paragraf

Părinții se rotesc la condus pentru mai mulți copii din vecinătate. Aplicația construiește rotația și confirmă fiecare predare. Șoferul din rotație duce grupul direct la poarta școlii. **[DECIS]**

```
Acasă -> Șofer din rotație (mașină) -> Poarta școlii

Predări confirmate:
  1 șoferul confirmă preluarea copiilor
  2 șoferul confirmă lăsarea la poarta școlii (care confirmă și sosirea)
```

În fiecare moment, un adult numit este responsabil pentru fiecare copil. O confirmare lipsă declanșează o alertă. După-amiaza, lanțul rulează în sens invers.

## 3. Domeniul de lucru pentru cele 24 de ore

### Obligatoriu
- **M1** Scenariu cu date de test: aproximativ 20 de familii și 30 de copii fictivi în jurul unei școli.
- **M2** Algoritmul de grupare și rotație (secțiunea 6), scris ca bibliotecă pură, cu teste unitare.
- **M3** Vizualizări ale rotației: rotația săptămânii pentru fiecare grup și, pentru orice zi, planul fiecărei curse (ordinea preluărilor, cu ore).
- **M4** Fluxul șoferului: confirmă fiecare preluare, apoi lăsarea (apăsare la poarta școlii).
- **M6** Ecranul părintelui: card „azi” cu cine conduce, ora preluării, starea, și o notificare de sosire în aplicație (de exemplu „Ajuns la poartă, 7:52”).
- **M7** Alerta de copil lipsă, declanșată când o confirmare așteptată nu vine până la termen (2 minute după termen), condusă de un **ceas de demo** pentru a putea fi arătată în secunde.
- **M8** Tablou de bord pentru administrator (coordonator): starea în direct a fiecărui grup de azi, alerte și un raport de o pagină, imprimabil (numărul de curse, confirmări, alerte, timpul mediu de confirmare).
- **M9** Lista de sosiri a școlii, doar pentru citire (profesorii nu introduc nimic).
- **M10** Planificarea săptămânii de către părinte: fiecare părinte oferă între 3 și 5 curse pe săptămână (formularul se oprește la 5). Planificarea se închide duminică la 18:00; algoritmul rulează duminică, cel mai devreme.

### De dorit (doar dacă mai rămâne timp)
- **S1** Contor la poartă: o numărătoare simplă a mașinilor și copiilor care sosesc la poartă, pentru numărătoarea înainte/după din studiul de caz.
- **S2** Sensul de după-amiază (aceleași fluxuri, în sens invers).
- **S3** Toleranță la lipsa internetului: confirmările se pun în coadă pe dispozitiv și se trimit când revine semnalul.
- **S4** Texte de interfață în română. **[DESCHIS]** (vezi secțiunea 13)
- **S5** O soluție de rezervă prin SMS sau apel telefonic, doar ca ecran simulat.
- **S7** Tablou de bord pentru oraș (faza 2): mașini eliminate și CO2 evitat.

### Nu facem (nu se construiește)
- Urmărirea în direct a locației unui copil sau urmărire continuă a cuiva. (Vezi conflictul din secțiunea 13.)
- Potrivirea persoanelor necunoscute pentru curse. Doar familii invitate în același grup.
- Plăți sau împărțirea costurilor între părinți.
- Conturi reale și autentificare. Folosim un comutator „Demo ca: părinte / șofer / administrator / școală”.
- Profesori care introduc prezența sau orice alte date.
- Notificări push. Un flux de notificări în aplicație este suficient.
- Orice API real de rutare sau de geocodare. Vezi secțiunea 6.6.
- Integrare cu programele de catalog electronic ale școlilor.
- Orice date reale despre copii sau familii.

## 4. Utilizatori și roluri

| Rol | Cine | Ce face în aplicație |
| --- | --- | --- |
| **Părinte** | Părinte al unui copil de aproximativ 6–14 ani | Vede planul de azi, își oferă cursele, vede notificarea de sosire și alertele |
| **Șofer din rotație** | Un părinte cu mașină, de serviciu în ziua respectivă | Confirmă preluările și lăsarea |
| **Administrator / coordonator** | Persoana desemnată de școală (B2B) sau de primărie (B2G) | Vede toate grupurile și alertele; rulează algoritmul; exportă raportul |
| **Școala** | Secretar sau director | Listă de sosiri, doar pentru citire |

Prezentarea vorbește despre 4 roluri fără să le numească. **[DESCHIS]** Lista de mai sus este propunerea mea pentru cele patru din lansarea B2B: părinte, șofer din rotație, administrator și școală.

## 5. Fluxuri principale

### 5.1 Dimineața
1. Rotația este deja calculată. Părinții primesc o notificare (de exemplu la 7:15) cu „Azi: [șofer] ia copiii [nume] la [ora]”.
2. Șoferul deschide cursa de azi și apasă **Preluat** pentru fiecare familie, în ordine. Fiecare apăsare înregistrează un eveniment de predare.
3. La poarta școlii, șoferul apasă **Lăsat la poarta școlii**, ceea ce confirmă deodată lăsarea și sosirea. Părinții primesc notificarea de sosire, iar lista școlii se actualizează.
4. Dacă o confirmare așteptată nu vine până la termen (secțiunea 6.5), părinții și administratorul primesc o **alertă de copil lipsă** care numește copilul, ultima predare confirmată și adultul responsabil.

### 5.2 După-amiaza
Același lanț, în sens invers (S2). Șoferul confirmă preluarea de la școală, iar un adult autorizat confirmă preluarea copilului. Dacă nimeni nu confirmă în intervalul de grație, administratorul și părinții sunt alertați.

### 5.3 Administratorul
Rulează algoritmul (buton), verifică grupurile și rotația săptămânală, poate înlocui un șofer cu altul pentru o zi (rotația se reechilibrează), urmărește tabloul în direct în timpul demo-ului și exportă raportul.

## 6. Algoritmul de grupare și rotație

Aceasta este cea mai importantă parte. Trebuie să fie corect, explicabil și testat.

### 6.1 Date de intrare
- **Familii:** `id`, locația acasă `(lat, lng)`, copii, `can_drive` (bool), `car_seats` (locuri totale, inclusiv al șoferului, dacă poate conduce), `child_seat_slots` (câte scaune auto pentru copii are), `available_days` (submulțime din luni–vineri) în care poate conduce, `class` (clasa copilului), `consent` (bool).
- **Copii:** `id`, prenume sau cod, `family_id`, `needs_child_seat` (adevărat dacă are sub 135 cm), `height_cm`.
- **Destinația:** poarta școlii `(lat, lng, deadline)`.
- **Parametri** (toți configurabili, valorile implicite mai jos).

### 6.2 Parametri și valori implicite **[PROPUS]**
| Parametru | Implicit | Note |
| --- | --- | --- |
| `max_children_per_car` | 4 | Limitat și de `car_seats - 1` |
| `child_seat_height_cm` | 135 | Copiii sub această înălțime au nevoie de scaun auto omologat, pe bancheta din spate (Codul rutier, art. 97) |
| `rides_per_parent_min` | 3 | Din 10 sloturi pe săptămână (5 zile × dimineața și după-amiaza) **[DECIS]** |
| `rides_per_parent_max` | 5 | Un părinte nu poate oferi mai mult **[DECIS]** |
| `max_detour_min` | 6 | Minute în plus față de situația în care șoferul merge direct la destinație |
| `avg_speed_kmh` | 25 | Ipoteză urbană pentru timpii de călătorie offline |
| `pickup_dwell_min` | 1 | Timpul petrecut la fiecare preluare |
| `gate_deadline` | 07:55 | Ora limită de sosire la poarta școlii |
| `alert_grace_min` | 2 | Așteptare după un termen înainte de alertă |
| `days` | luni–vineri | |

### 6.3 Constrângeri obligatorii (niciodată încălcate)
1. O cursă nu duce niciodată mai mulți copii decât `max_children_per_car` sau `car_seats - 1` (copiii șoferului se numără).
2. O cursă nu duce niciodată mai mulți copii care au nevoie de scaun auto decât `child_seat_slots` ale șoferului.
3. Un șofer este alocat doar în zilele din `available_days`.
4. Un copil aparține exact unui grup; un grup se formează doar din familii invitate în el, din aceeași clasă sau școală (în prototip, pe baza apropierii). Cum se grupează clasele este **[DESCHIS]**.
5. Timpul total estimat al unei curse respectă `max_detour_min` pentru fiecare preluare, altfel familia este semnalată, nu forțată în grup.
6. Un părinte este alocat la cel puțin `rides_per_parent_min` și cel mult `rides_per_parent_max` curse pe săptămână, când disponibilitatea lui permite.

### 6.4 Obiective, în ordinea priorității
1. **Fezabilitate:** fiecare copil este alocat unui grup cu cel puțin un șofer eligibil în fiecare zi a săptămânii; altfel este marcat `unassigned` cu un motiv.
2. **Minimizarea timpului total pierdut cu ocolurile**, pe toate cursele.
3. **Echitate:** între șoferii aceluiași grup, numărul de zile de condus într-o săptămână diferă cu cel mult 1, când toți sunt disponibili; altfel se raportează metrica de echitate. Se definește sarcina de condus a unei familii ca `days_driven / days_available_to_drive`; se minimizează diferența (maxim minus minim) în fiecare grup.
4. **Stabilitate:** componența grupurilor este aceeași în fiecare săptămână; se rotește doar șoferul. Schimbarea unei familii trebuie să modifice cât mai puține grupuri.

### 6.5 Procedura (recomandare implicită; orice metodă care respectă 6.3 și 6.4 este acceptabilă)
1. **Grupați** copiii după locația de acasă folosind clustering cu constrângere de capacitate (de exemplu clustering aglomerativ greedy pe distanța haversine, unind cele mai apropiate clustere cât timp capacitatea și ocolul rămân în limite).
2. **Verificați capacitatea:** pentru fiecare grup, listați șoferii eligibili (`can_drive`, destule locuri și scaune pentru copii). Dacă nu există niciunul, încercați să împărțiți sau să uniți grupul; dacă tot nu merge, semnalați.
3. **Ordonați preluările** pentru fiecare cursă cu cel mai apropiat vecin, de la casa șoferului prin celelalte familii până la destinație, apoi îmbunătățiți cu 2-opt. Grupurile sunt mici, deci e rapid.
4. **Alocați șoferii pe zile:** pentru fiecare zi, alegeți șoferul eligibil și disponibil cu cel mai mic `days_driven / days_available_to_drive`; la egalitate, cel cu ocolul total mai mic, apoi după id-ul familiei, ca rezultatul să fie determinist.
5. **Calculați orele înapoi** pornind de la termenul porții: ora estimată a fiecărei preluări, cu `avg_speed_kmh` și `pickup_dwell_min`.
6. **Calculați termenele pentru alerte:** o preluare este așteptată până la ora estimată plus `alert_grace_min`; lăsarea la poartă până la termenul porții plus intervalul de grație.

### 6.6 Locații fixate în cod sau reale
Locațiile sunt fixate în cod în prototip, și e în regulă. Algoritmul nu trebuie să țină cont de proveniența lor. Toată logica de locații și de timpi de călătorie stă în spatele a două interfețe:
```
LocationProvider.getLocation(familyId) -> {lat, lng}
RouteProvider.travelMinutes(from, to) -> number   // implicit: haversine / avg_speed
```
`RouteProvider` implicit funcționează offline (haversine plus `avg_speed_kmh`). Un furnizor real de rutare poate fi adăugat mai târziu fără a schimba algoritmul. **[DECIS]**

### 6.7 Contractul de ieșire (JSON)
Toți consumatorii (API, interfață, raport) folosesc această structură. **[PROPUS]**
```json
{
  "params": { "max_children_per_car": 4, "max_detour_min": 6 },
  "groups": [
    { "id": "G1", "childIds": ["C01","C02","C05"], "familyIds": ["F01","F02"] }
  ],
  "week": [
    {
      "day": "Mon",
      "trips": [
        {
          "groupId": "G1",
          "driverFamilyId": "F02",
          "pickups": [
            { "familyId": "F01", "childIds": ["C01"], "eta": "07:22" },
            { "familyId": "F02", "childIds": ["C02","C05"], "eta": "07:27" }
          ],
          "destination": { "id": "S1", "eta": "07:48" }
        }
      ]
    }
  ],
  "metrics": { "totalDetourMin": 41, "fairnessSpreadMax": 1, "unassignedCount": 0 },
  "unassigned": [ { "childId": "C17", "reason": "no eligible driver within detour limit" } ],
  "warnings": []
}
```

### 6.8 Teste obligatorii
- Nicio cursă nu depășește capacitatea de locuri sau scaunele pentru copii (test de proprietate pe multe seed-uri aleatorii).
- Niciun șofer nu este alocat într-o zi în care nu e disponibil.
- Fiecare copil este alocat sau apare în `unassigned` cu un motiv.
- Diferența de echitate într-un grup este cel mult 1 când toți șoferii sunt mereu disponibili.
- Niciun părinte nu este alocat la mai mult de `rides_per_parent_max` curse pe săptămână.
- Aceeași intrare și același seed dau mereu aceeași ieșire.
- Scoaterea unui șofer și rularea din nou schimbă cât mai puține grupuri.

## 7. Modelul de date (minimum)

```
Family     id, label (fictiv), lat, lng, can_drive, car_seats, child_seat_slots, available_days[]
Child      id, first_name_or_code, family_id, height_cm, needs_child_seat
School     id, label, gate_lat, gate_lng, gate_deadline
Group      id, childIds[], familyIds[]
Trip       id, date, direction (MORNING|AFTERNOON), groupId, driverFamilyId, pickups[], destination
Event      id, tripId, type (PICKED_UP|DROPPED_AT_GATE),
           childIds[], actorRole, actorLabel, timestamp (ceas de demo), method (TAP|QR)
Alert      id, tripId, childId, type (MISSING_PICKUP|MISSING_AT_GATE), raisedAt, resolvedAt
```
Se stochează doar aceste câmpuri. Fără nume de familie, numere de telefon, fotografii, adrese (doar coordonate fictive) sau locație în direct.

Notă: datele reale ale aplicației mobile sunt descrise în `USER_DATA.md` (colecția Firebase `parinti`, câmpuri în română). Prototipul de algoritm folosește modelul de mai sus; maparea între ele se face în `data/types.ts` (vezi `USER_DATA.md`, secțiunea 6).

## 8. Ecrane (aplicație web, prioritate mobilă, instalabilă ca PWA)

1. **Bara de scenariu / demo** (mereu vizibilă): comutator de rol, comenzi pentru ceasul de demo (pornește, +1 min, +5 min, sari la termen), „resetează datele”.
2. **Administrator:** hartă (un grafic SVG simplu cu locuințele și școala; fără hărți externe), lista grupurilor, tabelul rotației săptămânale, butonul „Rulează algoritmul”, tabloul în direct, exportul raportului.
3. **Rotație / detaliu cursă:** ordinea preluărilor, orele, șoferul, copiii.
4. **Șofer:** cursa de azi ca listă de verificare a preluărilor, apoi acțiunea de lăsare.
5. **Părinte:** cardul de azi, planificarea săptămânii (3–5 curse), cronologia stării copilului, notificări și alerte în aplicație.
6. **Școala:** lista de sosiri, doar pentru citire.
7. **Raport:** o pagină imprimabilă.

Cerință de viteză: o confirmare durează cel mult două apăsări.

## 9. Reguli de confidențialitate și siguranță (nenegociabile)

1. Fără urmărire în direct a vreunui copil și fără urmărire continuă a vreunui adult. Prezența unui părinte sau șofer se confirmă printr-un cod QR sau PIN la predare, sau printr-o verificare unică a locației, în momentul apăsării, care păstrează doar da sau nu. **[DESCHIS]** Prezentarea arată și „locația live a cursei”; decizia este în secțiunea 13.
2. Demo-ul și prototipul folosesc doar date fictive.
3. Se stochează minimul: prenume sau cod, grup, adulți autorizați, evenimente de predare.
4. Aplicația sprijină supravegherea și nu o înlocuiește niciodată. Textele din interfață nu trebuie să spună că un copil este „în siguranță”, ci doar că o predare a fost confirmată sau că lipsește o confirmare.
5. Fără plăți, fără persoane necunoscute, fără introducere de date de către profesori.
6. Scaune auto: copiii sub 135 cm sunt puși doar într-o cursă cu suficiente scaune pentru copii.
7. Arătați în ecranul părintelui un ecran de consimțământ cu text de exemplu („Părinții își dau acordul prin școală; text de exemplu”), ca fluxul să fie vizibil în demo.

## 10. Îndrumări tehnice **[PROPUS]**

- **Un singur depozit de cod, un singur limbaj.** TypeScript de la un capăt la altul (tipuri comune), o aplicație web React (Vite, instalabilă ca PWA), un API mic în Node și fie SQLite, fie un depozit în memorie populat din JSON. O comandă pentru instalare și una pentru rulare.
- **Structură:** `packages/algorithm` (funcții pure, fără I/O, fără framework), `apps/api`, `apps/web`, `data/seed.json`, `docs/`.
- **Ordinea lucrului:** întâi algoritmul și testele lui (țintă: 3–4 ore), apoi API-ul și datele de test, apoi ecranele, în jurul contractului din 6.7.
- **Ceas de demo:** toate termenele și alertele citesc un singur ceas injectabil, nu ora reală.
- **Fără secrete, fără apeluri în rețea** la rulare. Demo-ul trebuie să meargă offline.
- **Nivel de calitate:** testele trec, fără erori în consolă, funcționează pe un ecran de telefon, un README cu pașii de rulare.

### Împărțire sugerată pentru agenți în paralel
| Agent | Răspunde de | Depinde de |
| --- | --- | --- |
| 1. Algoritm | `packages/algorithm`, teste, contractul 6.7 | nimic |
| 2. Date și API | datele de test (aprox. 20 de familii fictive), evenimente, alerte, ceasul de demo, endpoint-uri REST | contractul 6.7 |
| 3. Ecrane pentru șofer și părinte | fluxurile 5.1–5.2 | API |
| 4. Administrator, școală și raport | harta, tabelul rotației, tabloul în direct, raportul | API |
| 5. Calitate și demo | scriptul de demo cap-coadă, cazuri limită, finisaje, README | toți |

Agenții cad de acord mai întâi asupra contractului din 6.7 și a modelului de date din secțiunea 7; orice modificare a lor trece printr-o singură persoană.

## 11. Date de test

- Aproximativ 20 de familii și aproximativ 30 de copii fictivi, plasați la cel mult aproximativ 2 km de o poartă fictivă de școală din Sibiu (punct de reper aproximativ 45,79 N, 24,15 E; folosiți decalaje mici aleatorii; nu folosiți adrese reale).
- Familii variate: aproximativ 12 pot conduce (cu 4–6 locuri), câteva au doi copii, cam o treime dintre copii au sub 135 cm, câțiva șoferi nu sunt disponibili într-o zi a săptămânii.
- Includeți două cazuri incomode: o familie departe de toți ceilalți (trebuie semnalată sau să formeze propriul grup) și un grup în care doar un șofer poate transporta scaune pentru copii.
- Pentru scenariul din prezentare: un grup de 3 familii vecine cu o singură mașină, luni dimineața.

## 12. Scenariul demo (aproximativ 5 minute)

1. Ca **administrator**, arătați harta și familiile de test. Apăsați **Rulează algoritmul**. Arătați grupurile și rotația săptămânală; subliniați echitatea (diferență de cel mult un drum pe săptămână) și zero copii nealocați.
2. Ca **șofer** (luni dimineața, 3 familii vecine, o singură mașină), confirmați preluările și apoi sosirea la poarta școlii.
3. Ca **părinte**, arătați cine conduce azi și notificarea de sosire. Ca **școală**, arătați lista de sosiri.
4. Rulați o a doua cursă în care șoferul sare peste o preluare. Avansați ceasul de demo; arătați **alerta de copil lipsă** care ajunge la părinte și la administrator.
5. Ca **administrator**, exportați raportul de o pagină.
6. Încheiați cu cele trei afirmații din secțiunea 1.

## 13. Întrebări deschise pentru echipă **[DESCHIS]**

1. Limba interfeței: română, engleză sau ambele? (Sugestie: română implicit, cu comutator pentru engleză dacă mai rămâne timp.)
2. Tehnologie: TypeScript de la un capăt la altul convine tuturor sau preferă cineva (sau vreun agent) Python pentru algoritm?
3. **Locația live a cursei:** prezentarea o arată, regulile din secțiunea 9 o interzic. O păstrăm (cu consimțământ și doar pe durata cursei), sau o scoatem din prezentare?
4. Clasele: un grup este limitat la o singură clasă sau poate amesteca clase din aceeași școală?
5. Părinții fără consimțământ (parinte-10 și parinte-14 în datele demo) participă la potrivire?
6. Cele patru roluri din prezentare: sunt cele propuse în secțiunea 4?
7. Dimineața și după-amiaza: același șofer pentru ambele sensuri? (Implicit: da.)
8. Arătăm contorul de la poartă (S1) în demo-ul de la hackathon sau îl folosim doar în studiul de caz?

## 14. Definiția „gata”

- Testele algoritmului din 6.8 trec.
- Scenariul demo din secțiunea 12 rulează de la zero cu o singură comandă și fără rețea.
- Tot ce e la „Obligatoriu” funcționează; nimic din „Nu facem” nu există.
- Nu există date personale reale nicăieri în depozitul de cod.
- Un README explică cum se rulează, contractul din 6.7 și lacunele cunoscute.

## 15. Context (doar pentru informare)

Documentele echipei, dacă aveți nevoie de ele: prezentarea KiddoFlux (noiembrie 2026), planul de afaceri B2B (școli private) și planul de afaceri B2G (primării), `USER_DATA.md` pentru datele din Firebase. Ideile-cheie care modelează construcția: școala privată plătește, părinții nu plătesc niciodată; rotația echitabilă și predarea confirmată sunt miezul produsului; GPS-ul de pe telefon are o precizie de aproximativ 5 m în aer liber și mai slabă lângă clădiri, deci confirmăm prezența cu un cod QR sau PIN; profesorilor nu trebuie să li se ceară muncă în plus.
