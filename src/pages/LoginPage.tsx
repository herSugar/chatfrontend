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
    console.log("Toker terkirim ke backend", token);
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800">
      
      {/* Animated 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
          {/* Floating Geometric Shapes */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-blue-400/20 rounded-lg rotate-45 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-purple-300/15 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-indigo-300/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }}></div>
          </div>
          
          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/50 to-purple-400/50 rounded-lg opacity-20 animate-pulse"></div>
        </div>
        
      <div className="bg-gradient-to-br from-indigo-900 to-purple-800 shadow-xl rounded-2xl p-8 w-full max-w-md z-50 ">
        <div className="flex justify-center "><img src="image/logop.png" alt="logo" className="w-80 h-auto"/></div>
        

        
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg  text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-auto ml-auto flex items-center gap-2 bg-purple-600 text-white py-2 px-10 rounded-lg hover:bg-purple-700 transition"
          >
              <FaEnvelope className="text-white"/>
              Login
          </button>
        </form>
        <div className="flex items-center gap-3 my-3">
          <div className="h-px w-full bg-gray-400 mx-4"></div>
          <p className="text-gray-300">Or</p>
          <div className="h-px w-full bg-gray-400 mx-4"></div>
        </div>
        

        <div className="space-y-3 my-6">
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
      </div>
    </div>
  );
};

export default LoginPage;
