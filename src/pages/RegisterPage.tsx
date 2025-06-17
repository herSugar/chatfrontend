import React, { useState } from "react";
import axios from "axios";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { loginWithGoogleToken } from "../services/api";
import { ThemeWrapper, useTheme } from "../components/ThemeWrapper"; // Adjust path as needed

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { themeStyles, isDarkMode } = useTheme();

  const sendTokenToBackend = async (token: string) => {
    try {
      const data = await loginWithGoogleToken(token);
      console.log("Login success:", data);
      navigate("/chat");
    } catch (err) {
      console.error("Login gagal:", err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();

      await axios.post("http://localhost:8000/auth/register", {
        token: token,
      });

      console.log("Register dan insert ke MongoDB sukses!");
      navigate("/login");
    } catch (err: any) {
      console.error("Register gagal:", err);

      // Jika user sempat dibuat tapi backend gagal, hapus user
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          await deleteUser(currentUser);
        } catch (deleteErr) {
          console.log("Akun Firebase dihapus karena backend gagal.", deleteErr);
        }
      }

      setError(err.message);
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

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-8">
      <div className={`relative group ${themeStyles.mainBox} rounded-2xl p-8 w-full max-w-md z-30 border-2 transition-all duration-300 hover:scale-105 animate-slide-in`}>
        {/* Card glow effect */}
        <div className={themeStyles.buttonGlow} />
        
        {/* Card content */}
        <div className="relative z-10">
          <h1 className={`text-3xl font-bold text-center mb-2 ${themeStyles.heading}`}>
            Create Your Account
          </h1>
          <p className={`text-center mb-8 ${themeStyles.mutedText}`}>
            Set your Account for BaliPitu to continue
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className={`block text-sm font-medium mb-2 ${themeStyles.text}`}
              >
                Username
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-2 ${themeStyles.text}`}
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-2 ${themeStyles.text}`}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className={`relative group px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 ${themeStyles.button} border-2`}
              >
                <div className={themeStyles.buttonOverlay} />
                <span className="relative z-10">Register</span>
              </button>
            </div>
          </form>

          <div className={`mt-6 text-center ${themeStyles.mutedText}`}>
            Already have an account?{" "}
            <a 
              href="/login" 
              className={`font-medium hover:underline transition-colors duration-200 ${themeStyles.subheading}`}
            >
              Log in
            </a>
          </div>

          <div className="relative flex py-6 items-center">
            <div className={`flex-grow border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
            <span className={`flex-shrink mx-4 ${themeStyles.mutedText}`}>Or</span>
            <div className={`flex-grow border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className={`relative group w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 border-2 ${themeStyles.buttonSecondary}`}
          >
            <div className={themeStyles.buttonOverlay} />
            <FcGoogle className="text-xl relative z-10" />
            <span className="relative z-10">Sign up with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};



export default RegisterPage;