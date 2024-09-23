// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Corrigé l'importation de GoogleAuthProvider
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLX-xKSj9zgdmzXlzkFmg5qCptLgjqYa0",
  authDomain: "user-d8056.firebaseapp.com",
  projectId: "user-d8056",
  storageBucket: "user-d8056.appspot.com",
  messagingSenderId: "618549936182",
  appId: "1:618549936182:web:3744d82c3215589d4f9897",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app); // Un seul getAuth
const database = getFirestore(app);
const storage = getStorage(app);

// Initialize GoogleAuthProvider for Google sign-in
const googleProvider = new GoogleAuthProvider();

// Export the services
export { auth, database, storage, googleProvider };
