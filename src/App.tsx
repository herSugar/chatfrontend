import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
            <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;