// src/app/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
    // 🔴 PENTING: Ganti bagian ini dengan config dari Firebase Console Anda
    // (Yang Anda dapatkan di langkah awal tadi)
    apiKey: "AIzaSyAV0L7qtuN3Aak6jPetJGbhNUFajJCelI0",
    authDomain: "whatsapp-schedule-bot.firebaseapp.com",
    databaseURL: "https://whatsapp-schedule-bot-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "whatsapp-schedule-bot",
    storageBucket: "whatsapp-schedule-bot.firebasestorage.app",
    messagingSenderId: "714496691858",
    appId: "1:714496691858:web:775b5a38c8b713540ae04b",
    measurementId: "G-061NRGY3ZR"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);