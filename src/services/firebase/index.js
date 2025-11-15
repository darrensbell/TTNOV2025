// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsWoGA1TzzCgh4OCknLAySf0WSpgTw0sA",
  authDomain: "big-app-9e1d6.firebaseapp.com",
  projectId: "big-app-9e1d6",
  storageBucket: "big-app-9e1d6.firebasestorage.app",
  messagingSenderId: "262004316894",
  appId: "1:262004316894:web:b89cd47cfebe54c026804f",
  measurementId: "G-165G7HX7CB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
