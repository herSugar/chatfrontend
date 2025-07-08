import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginWithGoogleToken } from "../services/api";
import { useTheme } from "../components/ThemeWrapper"; // Adjust the import path as needed
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { themeStyles, isDarkMode } = useTheme();

  const sendTokenToBackend = async (token: string) => {
    try {
      console.log("Token terkirim ke backend", token);
      const data = await loginWithGoogleToken(token);
      console.log("Login success:", data);
      navigate("/chat");
    } catch (err) {
      console.error("Login gagal:", err);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Masukkan email terlebih dahulu.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Link reset password telah dikirim ke email kamu.");
    } catch (error) {
      console.error("Gagal mengirim email reset password:", error);
      alert("Gagal mengirim email reset password. Pastikan email sudah benar.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      await sendTokenToBackend(token);
      toast.success("Login berhasil!", { position: "top-center" });
      setTimeout(() => {
        navigate("/chat");
      }, 1000); // delay 1 detik agar toast sempat muncul
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Login gagal!", { position: "top-center" });
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      await sendTokenToBackend(token);
      toast.success("Login berhasil!", { position: "top-center" });
      setTimeout(() => {
        navigate("/chat");
      }, 1000); // delay 1 detik agar toast sempat muncul
    } catch (err) {
      console.error("Email/password login error:", err);
      toast.error("Login gagal! Email atau password salah.", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-8">
      {/* Login Card */}
      <div
        className={`backdrop-blur-sm ${themeStyles.card} border rounded-2xl p-8 w-full max-w-md animate-slide-in shadow-2xl`}
      >
        {/* Logo Container */}
        <div className="flex justify-center mb-8">
          <div
            className={`${themeStyles.logoContainer} rounded-2xl p-4 border shadow-lg`}
          >
            <img
              src={isDarkMode ? "image/logop-dark.png" : "image/logos.png"}
              alt="logo"
              className="w-60 h-auto max-w-full transition-opacity duration-300"
              onError={(e) => {
                // Fallback to original logo if dark mode logo doesn't exist
                e.currentTarget.src = "image/logop.png";
              }}
            />
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className={`w-full px-4 py-3 ${themeStyles.card} border rounded-lg ${themeStyles.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className={`w-full px-4 py-3 ${themeStyles.card} border rounded-lg ${themeStyles.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-orange-500 hover:underline transition-colors duration-300"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`group relative w-full flex items-center justify-center gap-2 ${themeStyles.button} py-3 px-6 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
          >
            <div className={themeStyles.buttonGlow}></div>
            <div
              className={`absolute inset-0 ${themeStyles.buttonOverlay} rounded-lg transition-all duration-300`}
            ></div>
            <FaEnvelope className="text-lg relative z-10" />
            <span className="relative z-10">Login with Email</span>
          </button>
        </form>

        {/* Register Link */}
        <p className={`flex justify-center mt-6 ${themeStyles.text} text-sm`}>
          Don't have an account?&nbsp;
          <a
            href="/register"
            className={`${themeStyles.subheading} hover:underline font-medium transition-colors duration-300`}
          >
            Register
          </a>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div
            className={`h-px flex-1 ${
              isDarkMode ? "bg-gray-600" : "bg-gray-300"
            }`}
          ></div>
          <p className={`${themeStyles.mutedText} text-sm font-medium`}>Or</p>
          <div
            className={`h-px flex-1 ${
              isDarkMode ? "bg-gray-600" : "bg-gray-300"
            }`}
          ></div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className={`group relative w-full flex items-center justify-center gap-3 ${themeStyles.buttonSecondary} py-3 px-6 rounded-lg font-medium border transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg`}
          >
            <div
              className={`absolute inset-0 ${themeStyles.buttonOverlay} rounded-lg transition-all duration-300`}
            ></div>
            <FcGoogle className="text-xl relative z-10" />
            <span className="relative z-10">Login with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
