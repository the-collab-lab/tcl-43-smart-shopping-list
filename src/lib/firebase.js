// NOTE: import only the Firebase modules that you need in your app.
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase.
const firebaseConfig = {
  apiKey: 'AIzaSyBCfFl75TVpaL_sB4s5TXTUsYXbPl5jhss',
  authDomain: 'tcl-43-smart-shopping-list-app.firebaseapp.com',
  projectId: 'tcl-43-smart-shopping-list-app',
  storageBucket: 'tcl-43-smart-shopping-list-app.appspot.com',
  messagingSenderId: '982927601537',
  appId: '1:982927601537:web:419f41b047909b9799c280',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
