import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export function initializeFirebase() {
  if (app) {
    return { app, auth, db };
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  return { app, auth, db };
}

export function getFirebaseAuth(): Auth | null {
  return auth;
}

export function getFirebaseFirestore(): Firestore | null {
  return db;
}

export function isFirebaseInitialized(): boolean {
  return app !== null;
}
