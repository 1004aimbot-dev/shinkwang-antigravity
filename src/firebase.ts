// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAnXgL0ottjv3cvnt6YHlaRbzaEd6OyHTs",
    authDomain: "shonkwang-983c3.firebaseapp.com",
    projectId: "shonkwang-983c3",
    storageBucket: "shonkwang-983c3.firebasestorage.app",
    messagingSenderId: "1047693836238",
    appId: "1:1047693836238:web:ae4659695a617a009a759f",
    measurementId: "G-J60LQG6PF7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
