import React, { useState } from "react";
import {
  sendPasswordResetEmail,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginWithGoogleToken } from "../services/api";
import { useTheme } from "../components/ThemeWrapper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
      toast.warning("Masukan Email Terlebih Dahulu.", {
        position: "top-center",
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.info("Link Reset Password Sudah dikirim Ke Email (Cek Di spam).", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Gagal mengirim email reset password:", error);
      toast.error(
        "Gagal mengirim email reset password. Pastikan email sudah benar",
        {
          position: "top-center",
        }
      );
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      await sendTokenToBackend(token);
      toast.success("Login berhasil!", { position: "top-center" });
      setTimeout(() => navigate("/chat"), 1000);
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Login gagal!", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      await sendTokenToBackend(token);
      toast.success("Login berhasil!", { position: "top-center" });
      setTimeout(() => navigate("/chat"), 1000);
    } catch (err) {
      console.error("Email/password login error:", err);
      toast.error("Login gagal! Email atau password salah.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-8 relative">
      {/* Optional: Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-t-orange-500 border-white rounded-full animate-spin" />
        </div>
      )}

      <div
        className={`backdrop-blur-sm ${themeStyles.card} border rounded-2xl p-8 w-full max-w-md animate-slide-in shadow-2xl`}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div
            className={`${themeStyles.logoContainer} rounded-2xl p-4 border shadow-lg`}
          >
            <img
              src={isDarkMode ? "image/logop-dark.png" : "image/logos.png"}
              alt="logo"
              className="w-60 h-auto max-w-full transition-opacity duration-300"
              onError={(e) => {
                e.currentTarget.src = "image/logop.png";
              }}
            />
          </div>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className={`w-full px-4 py-3 ${themeStyles.card} border rounded-lg ${themeStyles.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              className={`w-full px-4 py-3 ${themeStyles.card} border rounded-lg ${themeStyles.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-orange-500 hover:underline transition-colors duration-300"
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`group relative w-full flex items-center justify-center gap-2 ${
              themeStyles.button
            } py-3 px-6 rounded-lg font-medium transition-all duration-300 transform ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:scale-105"
            } shadow-lg hover:shadow-xl`}
          >
            {loading ? (
              <div className="w-5 h-5 border-4 border-t-white border-b-white border-l-transparent border-r-transparent rounded-full animate-spin z-10" />
            ) : (
              <>
                <FaEnvelope className="text-lg relative z-10" />
                <span className="relative z-10">Login with Email</span>
              </>
            )}
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
          />
          <p className={`${themeStyles.mutedText} text-sm font-medium`}>Or</p>
          <div
            className={`h-px flex-1 ${
              isDarkMode ? "bg-gray-600" : "bg-gray-300"
            }`}
          />
        </div>

        {/* Google Login */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`group relative w-full flex items-center justify-center gap-3 ${
              themeStyles.buttonSecondary
            } py-3 px-6 rounded-lg font-medium border transition-all duration-300 transform ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:scale-105"
            } shadow-md hover:shadow-lg`}
          >
            {loading ? (
              <div className="w-5 h-5 border-4 border-t-black border-b-black border-l-transparent border-r-transparent rounded-full animate-spin z-10" />
            ) : (
              <>
                <FcGoogle className="text-xl relative z-10" />
                <span className="relative z-10">Login with Google</span>
              </>
            )}
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default LoginPage;
