import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const getEnv = (key: string, fallback: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return fallback;
};

const firebaseConfig = {
  apiKey: getEnv('EXPO_PUBLIC_FIREBASE_API_KEY', 'AIzaSyDkOjf6VLiWJlzgHEwZOwg_vkK-qsAsh4I'),
  authDomain: getEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', 'kay-jevnar.firebaseapp.com'),
  projectId: getEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID', 'kay-jevnar'),
  storageBucket: getEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET', 'kay-jevnar.firebasestorage.app'),
  messagingSenderId: getEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', '79049422936'),
  appId: getEnv('EXPO_PUBLIC_FIREBASE_APP_ID', '1:79049422936:web:aaee7271704e4afa83722d'),
  measurementId: getEnv('EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID', 'G-Q0089SWZHZ')
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
