import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDSilqMKh-o4hDj3jJ07H-bI4hs_AQSoLo",
  authDomain: "mypet9-d6f6e.firebaseapp.com",
  projectId: "mypet9-d6f6e",
  storageBucket: "mypet9-d6f6e.firebasestorage.app",
  messagingSenderId: "1055677962449",
  appId: "1:1055677962449:web:86b22755b7f0c7630e0df0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
