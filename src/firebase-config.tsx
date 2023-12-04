import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from '@firebase/firestore'
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyASyowCVD7RJZA7mFePmagxyOU7R_wBSYM",
  authDomain: "meets-38b6d.firebaseapp.com",
  projectId: "meets-38b6d",
  storageBucket: "meets-38b6d.appspot.com",
  messagingSenderId: "655144067546",
  appId: "1:655144067546:web:f9789cefc55ab0938f20e3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db: any = getFirestore(app)
