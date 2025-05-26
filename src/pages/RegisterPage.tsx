import React, { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { loginWithGoogleToken } from "../services/api"; // sesuaikan path

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ email, password });
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 p-5">
      <div className="w-full max-w-md bg-gradient-to-br from-indigo-900 to-purple-800 rounded-lg shadow-lg drop-shadow-white p-8">
        <h1 className="text-2xl text-white font-bold text-center mb-2 ">
          Create Your Account
        </h1>
        <p className="text-gray-300 text-center mb-6">
          Set your password for BaliPitu to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Username
            </label>
            <input
              type="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border text-white border-gray-300 rounded-md focus:outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border text-white border-gray-300 rounded-md focus:outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border text-white border-gray-300 rounded-md focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-white hover:bg-purple-700 hover:text-white  text-purple-700 font-medium rounded-md transition duration-150"
          >
            Continue
          </button>
        </form>

        <div className="mt-5 text-center text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="hover:underline">
            Log in
          </a>
        </div>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-white">Or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white text-purple-700 py-2 hover:bg-purple-700 hover:text-white font-medium rounded-md transition duration-150"
        >
          <FcGoogle className="text-xl bg-white rounded-full" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
