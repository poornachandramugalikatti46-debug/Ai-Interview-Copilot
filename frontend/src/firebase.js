import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

const firebaseConfig = {

  apiKey: "AIzaSyCTOFHDQluakA6P5uWVJ15I3LNhIc-R1f4",

  authDomain: "ai-interview-copilot-a5235.firebaseapp.com",

  projectId: "ai-interview-copilot-a5235",

  storageBucket: "ai-interview-copilot-a5235.firebasestorage.app",

  messagingSenderId: "128675103714",

  appId: "1:128675103714:web:d4565422cb4a36fec0efbb",

  measurementId: "G-MCFHH9FP59"

};

const app = initializeApp(firebaseConfig);

/* FIREBASE AUTH */

export const auth = getAuth(app);