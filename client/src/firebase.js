// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-da9c0.firebaseapp.com",
  projectId: "estate-da9c0",
  //storageBucket: "estate-da9c0.firebasestorage.app",
  storageBucket: "estate-da9c0.appspot.com",
  messagingSenderId: "972039658878",
  appId: "1:972039658878:web:f940099e22f3e29547a72f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);