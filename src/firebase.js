import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDi2R117GuFcFtG1G8WU5C0qD1MCE4MiPA",
  authDomain: "waterweatherdata.firebaseapp.com",
  projectId: "waterweatherdata",
  storageBucket: "waterweatherdata.appspot.com",
  messagingSenderId: "315565675510",
  appId: "1:315565675510:web:3ca831de6e6b77f7ecedd7",
  measurementId: "G-ZD736GMZXY"
};

console.log("Initializing Firebase with config:", firebaseConfig);

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

console.log("Firebase initialized:", app);

export { auth, googleProvider, sendPasswordResetEmail };
