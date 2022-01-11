// Import the functions you need from the SDKs you need
import { useState, useEffect} from "react"
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { storeData } from "./asyncStorage";
import { getFirestore, doc, setDoc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";

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
  createUserWithEmailAndPassword(auth, email, password).then(async (cred) => {
    const newUser = {
      uid: auth.currentUser.uid,
      relationship: null,
      displayName: name,
    }
    await storeData('user', newUser)
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


////////////////////////////////
////////// CLOUDSTORE //////////
////////////////////////////////

const db = getFirestore();

export const addDatabase = async (collection, document, data) => {
  const ref = doc(db, collection, document)
  try {
    await setDoc(ref, data)
    console.log('Added to database!')
  } catch(e){
    console.log(e)
  }
}

export const retrieveDatabase = async (collection, document) => {
  const ref = doc(db, collection, document)
  try {
    const snap = await getDoc(ref)
    if (snap.exists()) {
      return snap.data()
    } else {
      console.log('No data found!')
    }
  } catch (e) {
    console.log(e)
  }
}

export const updateDatabase = async (collection, document, field, data) => {
  const ref = doc(db, collection, document)
  try {
    await updateDoc(ref, {
      [field]: data
    })
    console.log("Data successfully updated!")
  } catch (e) {
    console.log(e)
  }
}

export const deleteDatabase = async (collection, document) => {
  try {
    await deleteDoc(doc(db, collection, document))
    console.log("Data successfully deleted!")
  } catch (e) {
    console.log(e)
  }
}