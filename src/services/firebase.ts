import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as updateFirebaseProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: "AIzaSyDVgwh1_w_PJZRFGV7YXBK8xCbyxWUmDBU",
  authDomain: "crave-with-vee.firebaseapp.com",
  projectId: "crave-with-vee",
  storageBucket: "crave-with-vee.firebasestorage.app",
  messagingSenderId: "325490059251",
  appId: "1:325490059251:web:fea32029cd5ed505f31486",
  measurementId: "G-Y9XFST8WRT",
};

// Initialize or retrieve existing Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Safe Analytics initialization (only in browser environment if supported)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics optional in sandbox
  });
}

export {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateFirebaseProfile,
};
export type { FirebaseUser };
