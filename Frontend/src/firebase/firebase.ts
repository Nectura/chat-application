// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { Auth, browserLocalPersistence, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "[REDACTED]",
  authDomain: "[REDACTED]",
  projectId: "[REDACTED]",
  storageBucket: "[REDACTED]",
  messagingSenderId: "[REDACTED]",
  appId: "[REDACTED]",
  measurementId: "[REDACTED]"
};

export let app: FirebaseApp;
export let analytics: Analytics;
export let fireBaseAuth: Auth;

export async function initializeFirebaseAsync() {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  fireBaseAuth = getAuth(app);
  await fireBaseAuth.setPersistence(browserLocalPersistence);
}