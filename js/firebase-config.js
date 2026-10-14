// ============================================================
//  firebase-config.js  —  Replace with YOUR Firebase project values
// ============================================================
//  How to get these values:
//  1. Go to console.firebase.google.com
//  2. Create a project (or open an existing one)
//  3. Project Settings → General → Your apps → Add Web App
//  4. Copy the firebaseConfig object and paste it below
// ============================================================

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD1Gch4oBHEtHL3A11QNMl5oC4MK7TC1tU",
  authDomain: "hms-base1.firebaseapp.com",
  projectId: "hms-base1",
  storageBucket: "hms-base1.firebasestorage.app",
  messagingSenderId: "165894324093",
  appId: "1:165894324093:web:a1e4ef50a7e8e726ad5614"
};

// ============================================================
//  Initialise Firebase (called once, shared by all pages)
// ============================================================
import { initializeApp }        from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth }              from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore }         from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage }           from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const app     = initializeApp(FIREBASE_CONFIG);
const auth    = getAuth(app);
const db      = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
