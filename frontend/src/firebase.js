import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase config (yours)
const firebaseConfig = {
  apiKey: "AIzaSyDuvVIxAtbuNC8SBsAAUtwbda-aYUbVCcM",
  authDomain: "ai-interview-copilot-6b81e.firebaseapp.com",
  projectId: "ai-interview-copilot-6b81e",
  storageBucket: "ai-interview-copilot-6b81e.appspot.com",
  messagingSenderId: "1087431125092",
  appId: "1:1087431125092:web:a9713a61161d1d55f6d771",
  measurementId: "G-CT47NR3G0V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

// Auth setup
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ THIS IS THE FIX (EXPORT FUNCTION)
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};