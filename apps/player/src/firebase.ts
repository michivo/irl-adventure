import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';

export const firebaseApp = initializeApp({
  apiKey: "AIzaSyC9HqHEby7ExaCpkwwTtOIXSktYhLWS4sQ",
  authDomain: "irl-adventure.firebaseapp.com",
  projectId: "irl-adventure",
  storageBucket: "irl-adventure.firebasestorage.app",
  messagingSenderId: "562019547163",
  appId: "1:562019547163:web:9e46757aa762d38a4760be"
});

export const db = getFirestore(firebaseApp);
export const gamesCollection = collection(db, 'games');
