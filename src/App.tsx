import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import HistoryPage from "./pages/HistoryPage";
import RegisterPage from "./pages/RegisterPage";
import SettingPages from "./pages/SettingPages";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container bg-gradient-to-br from-indigo-900 to-purple-800">
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingPages/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
