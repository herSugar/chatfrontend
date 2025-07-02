import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeWrapper";
import ModalLogout from "./ModalLogout";
import { IconType } from "react-icons";
import {
  MdChat,
  MdHistory,
  MdBookmark,
  MdSettings,
  MdAdd,
} from "react-icons/md";
//
import { auth } from "../services/firebaseConfig"; // Adjust the import based on your firebase setup

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const [activeItem, setActiveItem] = useState<string>("chat");
  const navigate = useNavigate();
  const location = useLocation();
  const { themeStyles, isDarkMode } = useTheme();

  const user = auth.currentUser;
  const photoURL =
    user?.photoURL ||
    `https://ui-avatars.com/api/?name=${user?.displayName || "U"}`;

  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith("/chat")) {
      setActiveItem("chat");
    } else if (location.pathname.startsWith("/history")) {
      setActiveItem("history");
    } else if (location.pathname.startsWith("/bookmark")) {
      setActiveItem("bookmark");
    } else if (location.pathname.startsWith("/settings")) {
      setActiveItem("settings");
    } else if (location.pathname.startsWith("/profile")) {
      setActiveItem("profile");
    }
  }, [location.pathname]);

  const menuItems: MenuItem[] = [
    {
      id: "new-chat",
      label: "New Chat",
      icon: <MdAdd size={20} />,
      onClick: () => {
        localStorage.removeItem("chat_session_id");
        navigate("/chat");
        window.location.reload();
      },
    },
    {
      id: "chat",
      label: "Chat",
      icon: <MdChat size={20} />,
      onClick: () => navigate("/chat"),
    },
    {
      id: "history",
      label: "Chat History",
      icon: <MdHistory size={20} />,
      onClick: () => navigate("/history"),
    },
    {
      id: "bookmark",
      label: "My Bookmark",
      icon: <MdBookmark size={20} />,
      onClick: () => navigate("/bookmark"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <MdSettings size={20} />,
      onClick: () => navigate("/settings"),
    },
  ];

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <div
      className={`
        h-full fixed top-0 left-0 z-40
        transition-all duration-500 ease-in-out
        ${
          isCollapsed ? "w-0 opacity-0 pointer-events-none" : "w-64 opacity-100"
        }
        backdrop-blur-md
        ${isDarkMode ? "bg-black/20" : "bg-white/20"}
        border-r ${isDarkMode ? "border-white/20" : "border-black/20"}
        shadow-xl
      `}
    >
      {/* Unified background matching ChatContainer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient overlay matching chat header */}
        <div
          className={`absolute inset-0 ${
            isDarkMode ? "bg-black/10" : "bg-white/10"
          }`}
        />

        {/* Floating particles for consistency */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1.5 h-1.5 ${
              isDarkMode ? "bg-orange-400/20" : "bg-orange-600/20"
            } rounded-full animate-pulse`}
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content with consistent styling */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Logo Section - matches chat header height */}
        <div
          className={`flex items-center justify-center py-6 h-40 border-b ${
            isDarkMode ? "border-white/20" : "border-black/20"
          }`}
        >
          <div className="relative">
            <img
              src={isDarkMode ? "/image/logop.png" : "/image/logos.png"}
              alt="Logo"
              className="w-30 h-30 rounded-full shadow-lg hover:scale-110 transform transition-all duration-300 cursor-pointer"
              onClick={() => navigate("/")}
            />
            {/* Subtle glow matching theme */}
            {isDarkMode && (
              <div className="absolute inset-0 rounded-full bg-orange-400/20 blur-sm animate-pulse" />
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li
                  key={item.id}
                  className="animate-slide-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`
          relative group w-full text-left p-3 rounded-xl cursor-pointer 
          transition-all duration-300 transform hover:scale-[1.02]
          flex items-center gap-3
          backdrop-blur-sm
          ${
            activeItem === item.id
              ? `${
                  isDarkMode
                    ? "bg-orange-500/20 border-orange-400/40"
                    : "bg-orange-100/60 border-orange-500/40"
                } border shadow-lg`
              : `${
                  isDarkMode
                    ? "hover:bg-white/10 border-white/10"
                    : "hover:bg-black/10 border-black/10"
                } border hover:shadow-md`
          }
        `}
                  >
                    <span
                      className={`text-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${themeStyles.text}`}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={`font-medium truncate transition-all duration-300 ${
                        activeItem === item.id
                          ? isDarkMode
                            ? "text-orange-300"
                            : "text-orange-700"
                          : themeStyles.text
                      }`}
                    >
                      {item.label}
                    </span>
                    {activeItem === item.id && (
                      <div
                        className={`absolute right-2 w-2 h-2 rounded-full ${
                          isDarkMode ? "bg-orange-400" : "bg-orange-600"
                        } animate-pulse`}
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {/* Profile menu fixed di bawah */}
        {/* Profile menu fixed di bawah */}
        <div className="p-3 mt-auto">
          <div className="relative">
            <button
              onClick={() =>
                handleItemClick({ id: "profile", label: "Profile", icon: "👤" })
              }
              className={`
    relative w-full text-left p-3 rounded-xl cursor-pointer 
    transition-all duration-300 transform hover:scale-[1.02]
    flex items-center gap-3 backdrop-blur-sm border
    ${
      isDarkMode
        ? "hover:bg-white/10 border-white/10"
        : "hover:bg-black/10 border-black/10"
    } hover:shadow-md
  `}
            >
              {/* Profile image */}
              <img
                src={photoURL}
                alt="Profile"
                className="w-7 h-7 rounded-full object-cover border border-white/20"
              />

              {/* Label */}
              <span className={`font-medium truncate ${themeStyles.text}`}>
                Profile
              </span>

              {/* Icon titik tiga */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLogout((prev) => !prev);
                }}
                className="ml-auto text-lg px-2 hover:text-orange-500"
              >
                ⋮
              </button>
            </button>

            {/* Dropdown Logout ke samping kanan */}
            {showLogout && (
              <div
                className={`
          absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 
          bg-red-500/20 border border-red-400/40 rounded-xl 
          shadow-lg p-3 backdrop-blur-sm min-w-[120px]
        `}
              >
                <ModalLogout />
              </div>
            )}
          </div>
        </div>

        {/* Footer decoration */}
        <div
          className={`p-3 border-t ${
            isDarkMode ? "border-white/20" : "border-black/20"
          }`}
        >
          <div
            className={`w-full h-1 ${
              isDarkMode ? "bg-orange-400/30" : "bg-orange-600/30"
            } rounded-full`}
          />
        </div>
      </div>

      {/* Custom scrollbar styles matching ChatContainer */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${
            isDarkMode ? "rgba(31, 41, 55, 0.2)" : "rgba(243, 244, 246, 0.2)"
          };
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? "#fb923c" : "#ea580c"};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? "#f97316" : "#dc2626"};
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
