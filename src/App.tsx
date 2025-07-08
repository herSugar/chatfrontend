// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import ChatPage from "./pages/ChatPage";
// import { Toaster } from "react-hot-toast";
// import LoginPage from "./pages/LoginPage";
// import HistoryPage from "./pages/HistoryPage";
// import RegisterPage from "./pages/RegisterPage";
// import SettingPages from "./pages/SettingPages";
// import ChatWithImage from "./pages/ChatWithImage";

// const App: React.FC = () => {
//   return (
//     <Router>
//       <div className="app-container">
//         <Toaster position="top-center" />
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/chat" element={<ChatPage />} />
//           <Route path="/chat/:sessionId" element={<ChatPage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/history" element={<HistoryPage />} />
//           <Route path="/settings" element={<SettingPages />} />
//           <Route path="/image" element={<ChatWithImage />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/LoginPage";
import HistoryPage from "./pages/HistoryPage";
import RegisterPage from "./pages/RegisterPage";
import SettingPages from "./pages/SettingPages";
import ChatWithImage from "./pages/ChatWithImage";
import { ThemeWrapper } from "./components/ThemeWrapper"; // Adjust path as needed
import BookmarkPage from "./pages/BookmarkPage";
import ProfilePage from "./pages/Profilepage";

const App: React.FC = () => {
  return (
    <ThemeWrapper showBubbles={true} bubbleCount={15} showToggle={true}>
      <Router>
        <div className="app-container">
          <ToastContainer />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:sessionId" element={<ChatPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingPages />} />
            <Route path="/image" element={<ChatWithImage />} />
            <Route path="/bookmark" element={<BookmarkPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router>
    </ThemeWrapper>
  );
};

export default App;
