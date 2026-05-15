import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

function readEnv(name) {
  const v = import.meta.env[name];
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
}

const firebaseConfig = {
  apiKey: readEnv("VITE_FIREBASE_API_KEY"),
  authDomain: readEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: readEnv("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: readEnv("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: readEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: readEnv("VITE_FIREBASE_APP_ID"),
};

export function isFirebaseConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );
}

let dbInstance = null;

/** @returns {import('firebase/firestore').Firestore | null} */
export function getDb() {
  if (!isFirebaseConfigured()) return null;
  if (dbInstance) return dbInstance;
  const app =
    getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  dbInstance = getFirestore(app);
  return dbInstance;
}
