import { useState, useEffect} from "react"
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { storeData } from "./asyncStorage";
import { getFirestore, doc, setDoc, deleteDoc, getDoc, updateDoc, query, collection, where, arrayUnion, getDocs, deleteField } from "firebase/firestore";
import 'react-native-get-random-values'
import { customAlphabet } from 'nanoid'

const firebaseConfig = {
  apiKey: "AIzaSyAih5h2CCYZgs84OVpQzff_SQMLMwGt2DE",
  authDomain: "long-distance-realtionship.firebaseapp.com",
  projectId: "long-distance-realtionship",
  storageBucket: "long-distance-realtionship.appspot.com",
  messagingSenderId: "579752201284",
  appId: "1:579752201284:web:e5ba00af1ae63bdc068011",
  measurementId: "G-BEHHKXV8ZQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();

////////////////////////////////
///////////// AUTH /////////////
////////////////////////////////

export function signUp(email, password, name) {
  createUserWithEmailAndPassword(auth, email, password).then(async (cred) => {
    await saveUserData(auth.currentUser.uid, name)
    updateProfile(auth.currentUser, {
      displayName: name
    }).catch(error => console.log(error))
  }).catch(error => {
    console.log(error)
  })
}

const saveUserData = async (uid, name) => {
  const nanoid = customAlphabet('123456789ABCDEFGHIJKLMNPQRSTUVWXYZ', 8)
  const newUser = {
    relationship: false,
    relationshipID: nanoid(),
    request: [],
    displayName: name,
  }
  await storeData('user', {...newUser, id: uid})
  await addDatabase('users', uid, newUser)
}

export function signIn(email, password) {
  signInWithEmailAndPassword(auth, email, password).then((cred) => {
      retrieveDatabase('users', auth.currentUser.uid).then((snap) => {
      signInStoreData(snap, auth.currentUser.uid)
    })
  })
}

const signInStoreData = async (data, uid) => {
  await storeData('user', {...data, id: uid})
}


export function manageUser() {
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
    return unsub;
  }, []);

  return currentUser;
}

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
      return null
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

export const updateDatabaseArray = async (collection, document, field, data) => {
  const ref = doc(db, collection, document)
  try {
    await updateDoc(ref, {
      [field]: arrayUnion(data)
    })
    console.log("Data successfully updated!")
  } catch (e) {
    console.log(e)
  }
}

export const deleteDatabaseField = async (collection, document, field) => {
  try {
    const ref = doc(db, collection, document)
    await updateDoc(ref, {
      [field]: deleteField()
    })
    console.log("Data successfully deleted!")
  } catch (e) {
    console.log(e)
  }
}

export const queryDatabase = async (document, subCollection, find) => {
  const q = query(collection(db, document), where(subCollection, "==", find));
  const snap = await getDocs(q);
  let newData = []
  snap.forEach((doc) => {
    let temp = [doc.data(), doc.id]
    newData.push(temp)
  });
  return newData
}