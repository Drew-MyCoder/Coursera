// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJUrj5ghIo6ofNoMXhFHPK1WJhnzxnXA4",
  authDomain: "drew-react-notes.firebaseapp.com",
  projectId: "drew-react-notes",
  storageBucket: "drew-react-notes.appspot.com",
  messagingSenderId: "777158258153",
  appId: "1:777158258153:web:b33721dd65e8dbaf1a6f78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")