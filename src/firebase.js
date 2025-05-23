// src/firebase.js
import { initializeApp } from "firebase/app";
import { 
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc, // Import getDoc here
  setDoc,
  deleteDoc,
  query,
  where,
  addDoc, // Import addDoc from firebase/firestore
  writeBatch, // Import writeBatch from firebase/firestore
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// IMPORTANT: Replace with your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvgQF66omtiPE7dyw0xrFbWivWjubHsqg",
  authDomain: "projekt-paddelboot.firebaseapp.com",
  projectId: "projekt-paddelboot",
  storageBucket: "projekt-paddelboot.firebasestorage.app",
  messagingSenderId: "327036232467",
  appId: "1:327036232467:web:285335291f3379b4d0b0e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore Offline-Persistence aktivieren (bewährte Methode)
if (typeof window !== "undefined") {
  import("firebase/firestore").then(({ enableIndexedDbPersistence }) => {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        // Mehrere Tabs offen, Persistence kann nur in einem aktiviert werden
        console.warn("Firestore Offline-Persistence konnte nicht aktiviert werden: Mehrere Tabs offen.");
      } else if (err.code === 'unimplemented') {
        // Browser unterstützt keine Offline-Persistence
        console.warn("Firestore Offline-Persistence wird von diesem Browser nicht unterstützt.");
      } else {
        console.warn("Firestore Offline-Persistence Fehler:", err);
      }
    });
  });
}

const auth = getAuth(app);

export { 
  db, 
  auth,
  collection,
  doc,
  getDocs,
  getDoc, // Export getDoc here
  setDoc,
  deleteDoc,
  addDoc, // Export addDoc
  query,
  where,
  writeBatch // Export writeBatch
};