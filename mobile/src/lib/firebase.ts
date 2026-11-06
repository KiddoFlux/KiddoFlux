import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

// Firebase JS SDK (works in Expo Go). The values come from mobile/.env, see .env.example.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    'Lipsesc EXPO_PUBLIC_FIREBASE_API_KEY / EXPO_PUBLIC_FIREBASE_PROJECT_ID. Copiază .env.example în .env și completează-le.',
  );
}

// A fast refresh runs this file again; reuse the app that already exists.
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

function createAuth() {
  try {
    // Keeps the user logged in between app launches.
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // Already initialized (fast refresh).
    return getAuth(app);
  }
}

function createFirestore() {
  try {
    // React Native has no WebChannel streaming; fall back to long polling when needed.
    return initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
  } catch {
    return getFirestore(app);
  }
}

export const auth = createAuth();
export const db = createFirestore();
