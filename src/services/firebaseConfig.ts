import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCtig8IgvC2jyhOp3qIUhqb6v29UONmD0w",
  authDomain: "chatbot-df6c2.firebaseapp.com",
  projectId: "chatbot-df6c2",
  storageBucket: "chatbot-df6c2.firebasestorage.app",
  messagingSenderId: "557711050952",
  appId: "1:557711050952:web:a42601ce5fb4d1738e7dfd",
  measurementId: "G-ELJRX2WSLL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup };
