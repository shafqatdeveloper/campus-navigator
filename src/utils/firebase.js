// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3R8T_bWNMAhJG1vVEmMUxg1gU13bAYSw",
  authDomain: "campus-navigator-d3fef.firebaseapp.com",
  projectId: "campus-navigator-d3fef",
  storageBucket: "campus-navigator-d3fef.firebasestorage.app",
  messagingSenderId: "108846540952",
  appId: "1:108846540952:web:7d4e737cc6fabcd07f88ed",
  measurementId: "G-D4P1R6W0KX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export default app;
