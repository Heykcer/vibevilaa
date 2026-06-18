import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyD-u2rl4AP9yFZw86uEt0X0SmpiQcl16wQ",
  authDomain: "vibevilaa.firebaseapp.com",
  projectId: "vibevilaa",
  storageBucket: "vibevilaa.firebasestorage.app",
  messagingSenderId: "338044474798",
  appId: "1:338044474798:web:b4afa22f514ecd629fe43f",
  measurementId: "G-ZVF8Y8K8C1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics
export const analytics = getAnalytics(app);

export default app;
