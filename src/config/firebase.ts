import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDkOjf6VLiWJlzgHEwZOwg_vkK-qsAsh4I",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "kay-jevnar.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "kay-jevnar",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "kay-jevnar.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "79049422936",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:79049422936:web:aaee7271704e4afa83722d",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-Q0089SWZHZ"
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with cross-platform persistence (Web + iOS + Android)
let authInstance;
try {
  if (Platform.OS === 'web') {
    authInstance = initializeAuth(app, {
      persistence: browserLocalPersistence
    });
  } else {
    // For React Native (iOS & Android)
    // @ts-ignore
    const { getReactNativePersistence } = require('@firebase/auth');
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
} catch (e) {
  authInstance = getAuth(app);
}

export const auth = authInstance;
export const db = getFirestore(app);
export const storage = getStorage(app);
