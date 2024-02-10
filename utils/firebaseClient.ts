// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBViZFYxyb9JDVqYz0AME77g35Bl_rMAdg",
    authDomain: "cyfox-auth.firebaseapp.com",
    databaseURL: "https://cyfox-auth-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cyfox-auth",
    storageBucket: "cyfox-auth.appspot.com",
    messagingSenderId: "819797941057",
    appId: "1:819797941057:web:a77087aeba42e59d2edfc0",
    measurementId: "G-SCZZRRE0LE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Firebase Auth


export { app, db, auth };