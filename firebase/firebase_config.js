import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
import { getFirestore } from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRmA_O2XRqrBozT1Mg0Q2VFqMzTXAOUM8",
  authDomain: "chartracker-93893.firebaseapp.com",
  projectId: "chartracker-93893",
  storageBucket: "chartracker-93893.appspot.com",
  messagingSenderId: "1009576772279",
  appId: "1:1009576772279:web:d0c4ddb1e36a0d2eba0332",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// initialize auth

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };

export const db = getFirestore(app);
