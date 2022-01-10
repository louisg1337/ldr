// Import the functions you need from the SDKs you need
import { useState, useEffect} from "react"
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAih5h2CCYZgs84OVpQzff_SQMLMwGt2DE",
  authDomain: "long-distance-realtionship.firebaseapp.com",
  projectId: "long-distance-realtionship",
  storageBucket: "long-distance-realtionship.appspot.com",
  messagingSenderId: "579752201284",
  appId: "1:579752201284:web:e5ba00af1ae63bdc068011",
  measurementId: "G-BEHHKXV8ZQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Auth Signup
export function signUp(email, password, name) {
  createUserWithEmailAndPassword(auth, email, password).then((cred) => {
    updateProfile(auth.currentUser, {
      displayName: name
    }).catch(error => console.log(error))
  }).catch(error => {
    console.log(error)
  })
}

// Auth Signin
export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Manage User
export function manageUser() {
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
    return unsub;
  }, []);

  return currentUser;
}

// Auth SignOut

export function signUserOut() {
  return signOut(auth);
}