# KiddoFlux — mobile app

Expo app for KiddoFlux (Carpool + Pedibus).

**Stack:** Expo SDK 54 · React Native 0.81.5 · React 19.1 · TypeScript (strict) · NativeWind v4 · Tailwind CSS v3.4

## 1. Prerequisites

Install these once on your machine:

| Tool                                         | Version                                | Notes                                        |
| -------------------------------------------- | -------------------------------------- | -------------------------------------------- |
| [Node.js](https://nodejs.org/)               | **20.19.4 or newer** (LTS recommended) | Check with `node -v`. npm comes with it.     |
| [Git](https://git-scm.com/)                  | any recent                             |                                              |
| [Expo Go](https://expo.dev/go) on your phone | **SDK 54**                             | Easiest way to run the app on a real device. |
| Android Studio (optional)                    | latest                                 | Only if you want the Android emulator.       |
| Xcode (optional, macOS only)                 | latest                                 | Only if you want the iOS simulator.          |

You do **not** need to install Expo CLI globally. Always use `npx expo ...`.

## 2. Install

```bash
git clone <repo-url> KiddoFlux
cd KiddoFlux/mobile
npm install
```

Create your local env file from the template:

```bash
# macOS / Linux / Git Bash
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

| Variable              | Description                                          |
| --------------------- | ---------------------------------------------------- |
| `EXPO_PUBLIC_API_URL` | Base URL of the backend API. Can stay empty for now. |

`.env` is git-ignored, so never commit it. Variables prefixed with `EXPO_PUBLIC_` are embedded in the app bundle, so never put secrets in them.

## 3. Run

```bash
npx expo start
```

Then:

- **Phone:** scan the QR code with Expo Go (Android) or the Camera app (iOS). Your phone and computer must be on the same network.
- **Android emulator:** press `a` (the emulator must already be running).
- **iOS simulator (macOS):** press `i`.

Web is not set up in this project.

### Clear the cache

Run this if styles don't update, or after you change `tailwind.config.js`, `global.css`, `babel.config.js`, `metro.config.js` or `.env`:

```bash
npx expo start -c
```

## 4. Scripts

| Command                           | What it does                                                 |
| --------------------------------- | ------------------------------------------------------------ |
| `npm start`                       | Start the Expo dev server                                    |
| `npm run android` / `npm run ios` | Start and open on Android / iOS                              |
| `npm run typecheck`               | TypeScript check (`tsc --noEmit`)                            |
| `npm run format`                  | Format all files with Prettier (also sorts Tailwind classes) |
| `npx expo-doctor`                 | Check dependency versions and project config                 |

## 5. Folder structure

```
mobile/
├── App.tsx               # Root component: imports global.css, SafeAreaProvider, HomeScreen
├── index.ts              # Entry point (registers App)
├── app.json              # Expo config (name, slug, icons, splash)
├── global.css            # Tailwind directives, imported once in App.tsx
├── tailwind.config.js    # Tailwind config + NativeWind preset
├── babel.config.js       # babel-preset-expo with NativeWind JSX
├── metro.config.js       # Metro bundler wrapped with withNativeWind
├── nativewind-env.d.ts   # Enables the `className` prop types
├── .env.example          # Template for .env
├── assets/               # Icons and splash images
└── src/
    ├── components/       # Reusable UI components
    ├── screens/          # Full screens (HomeScreen.tsx)
    ├── hooks/            # Custom React hooks
    ├── services/         # API clients and other side-effect code
    ├── types/            # Shared TypeScript types
    └── utils/            # Pure helper functions
```

## 6. Styling

Style components with Tailwind classes through the `className` prop:

```tsx
<View className="flex-1 items-center justify-center bg-white">
  <Text className="text-2xl font-bold">Hello</Text>
</View>
```

Only files matched by `content` in `tailwind.config.js` (`App.tsx` and everything under `src/`) get styles. If you put components somewhere else, add that path there.

## 7. Rules for dependencies

- Add native or Expo packages with `npx expo install <package>`, not `npm install`. It picks the version that matches SDK 54.
- Do **not** upgrade to NativeWind v5 or Tailwind CSS v4. NativeWind v4 only works with Tailwind v3.
- Do not upgrade Expo, React Native or React on your own. The whole team moves SDK versions together.

## Troubleshooting

| Problem                               | Fix                                                                                                                                           |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `className` has no effect             | Run `npx expo start -c`. Check that the file is covered by `content` in `tailwind.config.js` and that `App.tsx` still imports `./global.css`. |
| Expo Go says "incompatible SDK"       | Update Expo Go from the app store. It must support SDK 54.                                                                                    |
| Phone can't connect to the dev server | Put both devices on the same Wi-Fi, or run `npx expo start --tunnel`.                                                                         |
| Version mismatch warnings             | Run `npx expo install --fix`, then `npx expo-doctor`.                                                                                         |
