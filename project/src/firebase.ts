// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAodd1yedq7OmFxbWefWXBzMQsD5ku7kIY",
  authDomain: "baitongticketmajor.firebaseapp.com",
  projectId: "baitongticketmajor",
  storageBucket: "baitongticketmajor.firebasestorage.app",
  messagingSenderId: "470891624418",
  appId: "1:470891624418:web:87e0c73931e4ffa46aebbb",
  measurementId: "G-W639F9ZV17",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
