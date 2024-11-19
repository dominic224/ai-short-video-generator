// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "dominic-app-78630.firebaseapp.com",
  projectId: "dominic-app-78630",
  storageBucket: "dominic-app-78630.firebasestorage.app",
  messagingSenderId: "753003914750",
  appId: "1:753003914750:web:d26e50557115a183c94caf",
  measurementId: "G-9KQ8TWMBYG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
