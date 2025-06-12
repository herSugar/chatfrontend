import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Tambahkan ini

const firebaseConfig = {
  apiKey: "AIzaSyCXG01f30J_yAwxqWWsSGL1FW2Jkp07CPM",
  authDomain: "bali-pitu.firebaseapp.com",
  projectId: "bali-pitu",
  storageBucket: "bali-pitu.firebasestorage.app",
  messagingSenderId: "454263138799",
  appId: "1:454263138799:web:04c61583ebc197d2d86e1a",
  measurementId: "G-REVVW9XJ80"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Tambahkan ini

export { app, analytics, auth }; //Export agar bisa digunakan di file lain
