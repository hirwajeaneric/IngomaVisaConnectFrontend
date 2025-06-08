// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: "trash-mark.firebaseapp.com",
  projectId: "trash-mark",
  storageBucket: "trash-mark.appspot.com",
  messagingSenderId: "883773779524",
  appId: "1:883773779524:web:45af058d5971e3ed5b1611"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Initialize Firebase Auth state
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    console.log('Firebase user is signed in:', user.uid);
  } else {
    // User is signed out
    console.log('Firebase user is signed out');
  }
});