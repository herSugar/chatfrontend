import React, { useEffect, useState, useCallback } from "react";
import { api, deleteUserBookmarks, getUserBookmarks } from "../services/api";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../components/ThemeWrapper";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import DeleteSessionDialog from "../components/DeleteSessionDialog";

type Message = {
  role: string;
  content: string;
  timestamp: string;
  file_name?: string;
  image?: string;
};

type BookmarkSession = {
  _id: string;
  firebase_uid: string;
  session_id: string;
  messages: Message[];
  timestamp: string;
};

const BookmarkPage: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { themeStyles, isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("auth_token");
        const firebaseUid = localStorage.getItem("firebase_uid");

        if (!token || !firebaseUid) return;

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await getUserBookmarks(firebaseUid);

        setBookmarks(res.bookmarks || []);
      } catch (err) {
        console.error("Gagal mengambil bookmark:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      const firebaseUid = localStorage.getItem("firebase_uid");

      if (!token || !firebaseUid) {
        alert("Kredensial tidak ditemukan. Silakan login ulang.");
        return;
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await deleteUserBookmarks(firebaseUid, sessionId);

      setBookmarks((prev) =>
        prev.filter((session) => session.session_id !== sessionId)
      );
    } catch (err) {
      console.error("Gagal menghapus sesi:", err);
      alert("Terjadi kesalahan saat menghapus sesi.");
    }
  };

  const getSessionSummary = useCallback((messages: Message[]) => {
    const lastAgent = [...messages]
      .reverse()
      .find((msg) => msg.role === "agent");
    return lastAgent
      ? lastAgent.content.slice(0, 150) + "..."
      : "Tidak ada ringkasan.";
  }, []);

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-500">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${
          isCollapsed ? "ml-0" : "ml-64"
        } relative`}
      >
        <div
          className={`sticky top-0 z-40 backdrop-blur-md ${
            isDarkMode
              ? "bg-black/20 border-white/20"
              : "bg-white/20 border-black/20"
          } border-b`}
        >
          <div className="flex items-center p-4">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-2 rounded-lg hover:${
                themeStyles.buttonSecondary
                  .replace("bg-", "hover:bg-")
                  .split(" ")[0]
              } transition-colors ${themeStyles.heading}`}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <h1 className={`ml-4 text-2xl font-bold ${themeStyles.heading}`}>
              My Bookmark Sessions
            </h1>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <div className="flex flex-col h-full min-h-0 container mx-auto pr-2">
            <div
              className="flex-1 overflow-y-auto p-6 min-h-0 custom-scrollbar"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: isDarkMode
                  ? "#fb923c #1f2937"
                  : "#ea580c #f3f4f6",
              }}
            >
              {loading ? (
                <div
                  className={`flex-1 flex items-center justify-center ${themeStyles.text} text-lg`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 ${
                        isDarkMode ? "bg-orange-400" : "bg-orange-600"
                      } rounded-full animate-pulse`}
                    ></div>
                    <div
                      className={`w-4 h-4 ${
                        isDarkMode ? "bg-orange-400" : "bg-orange-600"
                      } rounded-full animate-pulse`}
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className={`w-4 h-4 ${
                        isDarkMode ? "bg-orange-400" : "bg-orange-600"
                      } rounded-full animate-pulse`}
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                    <span className="ml-3">Memuat riwayat...</span>
                  </div>
                </div>
              ) : bookmarks.length === 0 ? (
                <div
                  className={`flex-1 flex flex-col items-center justify-center ${themeStyles.text} text-lg space-y-4 mt-20`}
                >
                  <div
                    className={`w-20 h-20 ${
                      isDarkMode ? "bg-orange-500/20" : "bg-orange-100/60"
                    } rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <span className={`text-2xl ${themeStyles.subheading}`}>
                      📚
                    </span>
                  </div>
                  <p className={`${themeStyles.heading} text-2xl font-bold`}>
                    Tidak ada riwayat
                  </p>
                  <p className={`${themeStyles.mutedText} text-center`}>
                    Mulai percakapan baru untuk melihat riwayat di sini
                  </p>
                  <button
                    onClick={() => navigate("/chat")}
                    className={`mt-4 px-6 py-3 ${
                      isDarkMode
                        ? "bg-orange-500/20 hover:bg-orange-500/30 border-orange-400/40"
                        : "bg-orange-100/60 hover:bg-orange-200/60 border-orange-500/40"
                    } border rounded-xl transition-all duration-300 hover:scale-105 ${
                      themeStyles.text
                    } font-medium`}
                  >
                    Mulai Chat Baru
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                    {bookmarks.slice(0, visibleCount).map((session, index) => (
                      <div
                        key={session._id}
                        className={`
                          group relative p-6 rounded-xl shadow-lg transition-all duration-300 
                          hover:scale-105 hover:shadow-2xl cursor-pointer
                          ${
                            isDarkMode
                              ? "bg-black/20 border-white/20 hover:bg-black/30"
                              : "bg-white/20 border-black/20 hover:bg-white/30"
                          } 
                          border backdrop-blur-sm animate-slide-in
                        `}
                        style={{
                          animationDelay: `${index * 0.05}s`,
                          animationFillMode: "both",
                        }}
                        onClick={() => navigate(`/chat/${session.session_id}`)}
                      >
                        <div
                          className="absolute top-2 right-2 z-10"
                          onClick={(e) => e.stopPropagation()} // penting!
                        >
                          <DeleteSessionDialog
                            onDelete={() =>
                              handleDeleteSession(session.session_id)
                            }
                          />
                        </div>
                        <div
                          className={`absolute inset-0 ${
                            isDarkMode ? "bg-orange-400/10" : "bg-orange-600/10"
                          } rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10`}
                        />

                        <div className="space-y-3">
                          <div className={`text-sm ${themeStyles.mutedText}`}>
                            <strong className={themeStyles.subheading}>
                              Waktu:
                            </strong>
                            <br />
                            <span className="font-mono">
                              {new Date(session.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className={`text-sm ${themeStyles.text}`}>
                            <strong className={themeStyles.subheading}>
                              Ringkasan:
                            </strong>
                            <p className="mt-2 leading-relaxed line-clamp-4">
                              {getSessionSummary(session.messages)}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`absolute bottom-3 right-3 ${themeStyles.subheading} text-lg font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0`}
                        >
                          →
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Load more button */}
                  {visibleCount < bookmarks.length && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setVisibleCount((prev) => prev + 8)}
                        className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 
                          ${
                            isDarkMode
                              ? "bg-orange-500/10 hover:bg-orange-500/20"
                              : "bg-orange-100 hover:bg-orange-200"
                          } 
                          ${themeStyles.text} border ${
                          isDarkMode
                            ? "border-orange-400/40"
                            : "border-orange-500/40"
                        }
                        `}
                      >
                        Tampilkan lebih banyak
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: ${
              isDarkMode ? "rgba(31, 41, 55, 0.3)" : "rgba(243, 244, 246, 0.3)"
            };
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${isDarkMode ? "#fb923c" : "#ea580c"};
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${isDarkMode ? "#f97316" : "#dc2626"};
          }

          @keyframes slide-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-slide-in {
            animation: slide-in 0.5s ease-out forwards;
          }

          .line-clamp-4 {
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </div>
  );
};

export default BookmarkPage;
