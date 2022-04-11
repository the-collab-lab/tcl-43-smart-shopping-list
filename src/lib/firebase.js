// NOTE: import only the Firebase modules that you need in your app.
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase.
const firebaseConfig = {
  apiKey: 'AIzaSyDcrGMBbTzb2YouhAvovMKahVYktyLO6LY',
  authDomain: 'tcl-43-smart-shopping-list.firebaseapp.com',
  projectId: 'tcl-43-smart-shopping-list',
  storageBucket: 'tcl-43-smart-shopping-list.appspot.com',
  messagingSenderId: '353075517348',
  appId: '1:353075517348:web:f0c2953277ad5543261331',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
