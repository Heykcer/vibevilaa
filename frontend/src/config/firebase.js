import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { initializeFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = initializeFirestore(app, {
  experimentalForceLongPolling: true
});

// Initialize Analytics safely
export let analytics = null;
isSupported().
then((supported) => {
  if (supported) {
    try {
      analytics = getAnalytics(app);
    } catch (error) {
      console.warn('Failed to initialize Firebase Analytics:', error);
    }
  }
}).
catch((error) => {
  console.warn('Firebase Analytics isSupported check failed:', error);
});

const useEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';

if (import.meta.env.DEV && useEmulator) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  } catch {

    // Emulator already connected
  }try {
    connectFirestoreEmulator(firestore, 'localhost', 8080);
  } catch {

    // Emulator already connected
  }}

export default app;