// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4WI2y5RFBachNIxgttImK17eJsQhBosM",
  authDomain: "ksp69-35ef6.firebaseapp.com",
  projectId: "ksp69-35ef6",
  storageBucket: "ksp69-35ef6.appspot.com",
  messagingSenderId: "268384763491",
  appId: "1:268384763491:web:071dde02649fd6d3954256",
  measurementId: "G-EW236D0B2M"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);
const db = getFirestore(app);

export default db;