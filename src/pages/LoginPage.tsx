import React, { useState } from "react";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginWithGoogleToken } from "../services/api"; // sesuaikan path

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
 const sendTokenToBackend = async (token: string) => {
  try {
    const data = await loginWithGoogleToken(token); // ✅ panggil dari services
    console.log("Login success:", data);
    navigate("/chat"); // ✅ redirect setelah login
  } catch (err) {
    console.error("Login gagal:", err);
  }
};

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      await sendTokenToBackend(token);
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      await sendTokenToBackend(token);
    } catch (err) {
      console.error("GitHub login error:", err);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      await sendTokenToBackend(token);
    } catch (err) {
      console.error("Email/password login error:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">Login</h2>

        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            <FcGoogle className="text-xl bg-white rounded-full" />
            Login with Google
          </button>
          <button
            onClick={handleGithubLogin}
            className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition"
          >
            <FaGithub className="text-xl" />
            Login with GitHub
          </button>
        </div>

        <hr className="my-4" />
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <h4 className="text-lg font-semibold text-purple-700 text-center">Or login with Email</h4>

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            <FaEnvelope className="text-white" />
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
