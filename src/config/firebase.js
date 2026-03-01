// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAIyaVZZZfCvnLj2ruaI6L5cNXpqhZj-hI",
  authDomain: "point-of-sale-98d51.firebaseapp.com",
  projectId: "point-of-sale-98d51",
  storageBucket: "point-of-sale-98d51.firebasestorage.app",
  messagingSenderId: "1066768289441",
  appId: "1:1066768289441:web:e4a1663d101fafcf1aaae0",
  measurementId: "G-5GY3F46KJY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const Auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);