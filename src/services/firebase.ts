// Permanent Version - No Expiry
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfigData from '../../firebase-applet-config.json';
import { User, UserRole, WelderProfile } from '../types';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
  measurementId: firebaseConfigData.measurementId
};

// Initialize Firebase App
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(firebaseApp);
export const db =
  firebaseConfigData.firestoreDatabaseId && firebaseConfigData.firestoreDatabaseId !== '(default)'
    ? getFirestore(firebaseApp, firebaseConfigData.firestoreDatabaseId)
    : getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

// Test Firestore Connection on Boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client is offline. Checking network/configuration.');
    }
    return false;
  }
}

// Setup reCAPTCHA Verifier for Real SMS OTP Delivery
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export function setupRecaptcha(containerId: string): RecaptchaVerifier {
  // Clear any existing verifier
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch {
      // Ignored
    }
  }

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      console.log('reCAPTCHA solved for Phone Authentication.');
    },
    'expired-callback': () => {
      console.warn('reCAPTCHA expired. User should try again.');
    }
  });

  window.recaptchaVerifier = verifier;
  return verifier;
}

// Send Real Firebase Phone OTP (+91 India format)
export async function sendFirebasePhoneOtp(
  phoneNumber: string,
  containerId: string = 'recaptcha-container'
): Promise<ConfirmationResult> {
  // Ensure +91 country prefix
  let formattedNumber = phoneNumber.trim().replace(/\s+/g, '');
  if (!formattedNumber.startsWith('+')) {
    if (formattedNumber.length === 10) {
      formattedNumber = `+91${formattedNumber}`;
    } else {
      formattedNumber = `+${formattedNumber}`;
    }
  }

  const appVerifier = setupRecaptcha(containerId);
  const confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
  window.confirmationResult = confirmationResult;
  return confirmationResult;
}

// Verify Received OTP Code
export async function verifyFirebaseOtp(
  confirmationResult: ConfirmationResult,
  otpCode: string
): Promise<FirebaseUser> {
  const result = await confirmationResult.confirm(otpCode.trim());
  return result.user;
}

// Firestore User Profile Management
export async function saveUserProfileToFirestore(user: User): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, {
      ...user,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving user profile to Firestore:', error);
  }
}

export async function getUserProfileFromFirestore(uid: string): Promise<User | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile from Firestore:', error);
    return null;
  }
}

export async function firebaseSignOut(): Promise<void> {
  await signOut(auth);
}
