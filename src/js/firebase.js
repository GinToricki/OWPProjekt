// Import the functions you need from the SDKs you need
import { initializeApp  } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getDatabase, ref, child, update} from "firebase/database"
import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAG8RyOr-Kain_IDM4bFWXk4fCPcyQLICA",
  authDomain: "bankavuv.firebaseapp.com",
  databaseURL: "https://bankavuv-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bankavuv",
  storageBucket: "bankavuv.firebasestorage.app",
  messagingSenderId: "769570719495",
  appId: "1:769570719495:web:7a4e4d65f7b2077ab367a2",
  measurementId: "G-C5M105403M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase (app);

const korisniciRef = ref(db, 'korisnici');
const racuniRef = ref(db, 'racuni');
const transakcijeRef = ref(db, 'transakcije')

const auth = getAuth(app)

export {db, korisniciRef, auth, racuniRef,transakcijeRef}