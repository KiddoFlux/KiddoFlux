# Ghid Configurare Credențiale și Fișiere Google / Firebase

Acest document descrie exact **ce fișiere** sunt necesare după clonarea depozitului, **de unde se descarcă** din Firebase Console și **unde trebuie plasate** în proiect.

---

## 1. Structura Fișierelor (Unde merge fiecare fișier)

```
KiddoFlux/
├── backend/
│   └── serviceAccount.json           <-- Cheia privată Service Account (Firebase Admin SDK)
│
├── mobile/
│   ├── .env                          <-- Copiat din .env.example și completat
│   ├── google-services.json          <-- Fișierul de configurare Firebase Android
│   └── GoogleService-Info.plist      <-- Fișierul de configurare Firebase iOS
```

> [!NOTE]
> Toate aceste fișiere (`.env`, `serviceAccount.json`, `google-services.json`, `GoogleService-Info.plist`) conțin secrete și sunt deja ignorate prin `.gitignore` pentru a nu fi comise pe Git.

---

## 2. Detalii pentru fiecare fișier

### A. `mobile/.env` (Variabile de mediu aplicație mobilă)
* **Locație în proiect:** `mobile/.env`
* **Cum se creează:**
  ```powershell
  # În folderul mobile:
  Copy-Item .env.example .env
  ```
* **Conținut necesar:**
  ```ini
  EXPO_PUBLIC_API_URL=

  # Căi către fișierele Firebase native
  GOOGLE_SERVICES_JSON=./google-services.json
  GOOGLE_SERVICES_PLIST=./GoogleService-Info.plist
  IOS_BUNDLE_ID=com.kiddoflux.ios

  # Credențiale Firebase Web/JS SDK (necesare pentru Expo Go)
  EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
  EXPO_PUBLIC_FIREBASE_PROJECT_ID=kiddoflux2026
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=kiddoflux2026.firebasestorage.app
  EXPO_PUBLIC_FIREBASE_APP_ID=1:107...:web:...
  ```
* **De unde se iau valorile:**
  * Din **Firebase Console** → *Project settings* → *General* → *Your apps* → aplicația Web.
  * SAU direct din fișierul `google-services.json`:
    - `EXPO_PUBLIC_FIREBASE_API_KEY` = `client[0].api_key[0].current_key`
    - `EXPO_PUBLIC_FIREBASE_PROJECT_ID` = `project_info.project_id`
    - `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` = `project_info.storage_bucket`
    - `EXPO_PUBLIC_FIREBASE_APP_ID` = `client[0].client_info.mobilesdk_app_id`

---

### B. `mobile/google-services.json` (Android)
* **Locație în proiect:** `mobile/google-services.json`
* **De unde se descarcă:**
  1. Mergi în **Firebase Console** → *Project settings* (proiectul `kiddoflux2026`).
  2. La secțiunea *Your apps*, selectează aplicația Android cu pachetul `com.kiddoflux.android`.
  3. Descarcă fișierul `google-services.json`.
  4. Plasează-l în folderul `mobile/`.

---

### C. `mobile/GoogleService-Info.plist` (iOS)
* **Locație în proiect:** `mobile/GoogleService-Info.plist`
* **De unde se descarcă:**
  1. Mergi în **Firebase Console** → *Project settings* (proiectul `kiddoflux2026`).
  2. La secțiunea *Your apps*, selectează aplicația iOS cu Bundle ID `com.kiddoflux.ios`.
  3. Descarcă fișierul `GoogleService-Info.plist`.
  4. Plasează-l în folderul `mobile/`.

---

### D. `backend/serviceAccount.json` (Backend / Seed)
* **Locație în proiect:** `backend/serviceAccount.json`
* **De unde se descarcă:**
  1. Mergi în **Firebase Console** → *Project settings* → tab-ul **Service accounts**.
  2. Apasă pe **Generate new private key** (Generează o cheie privată nouă).
  3. Redenumește fișierul JSON descărcat în `serviceAccount.json`.
  4. Plasează-l în folderul `backend/`.
* **Utilizare:**
  Este folosit de scriptul de seed pentru încărcarea profilurilor fictive de părinți în Firebase Auth și Firestore:
  ```powershell
  cd backend
  $env:GOOGLE_APPLICATION_CREDENTIALS = ".\serviceAccount.json"
  npm run seed
  ```
  *(Dacă folosești emulatoarele locale Firebase prin `npm run emulators`, acest fișier nu este necesar).*

---

## 3. Verificare rapidă

Din rădăcina proiectului, poți verifica dacă toate cele 4 fișiere sunt prezente rulând:

```powershell
Test-Path backend\serviceAccount.json, mobile\.env, mobile\google-services.json, mobile\GoogleService-Info.plist
```
