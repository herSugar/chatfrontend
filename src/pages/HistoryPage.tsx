import React, { useEffect, useRef, useState } from "react";
import { api, getUserHistory, deleteSession } from "../services/api";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaSave } from "react-icons/fa";
import { useTheme } from "../components/ThemeWrapper"; // Only need useTheme hook
import DeleteSessionDialog from "../components/DeleteSessionDialog";
import { toast } from "react-toastify";
type Message = {
  role: string;
  content: string;
  timestamp: string;
  file_name?: string;
  image?: string;
};

type HistorySession = {
  _id: string;
  firebase_uid: string;
  session_id: string;
  messages: Message[];
  timestamp: string;
};

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistorySession[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const historyEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { themeStyles, isDarkMode } = useTheme();
  const formatTime = (timestamp: string) => {
    // Parse timestamp as UTC, then add 8 hours for WITA (GMT+8)
    const date = new Date(timestamp);
    // Get UTC time in ms, add 8 hours in ms
    const witaDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    return (
      witaDate.toLocaleString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour12: false,
        timeZone: "Asia/Makassar", // WITA time zone
      }) + " WITA"
    );
  };

  const scrollToBottom = () => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const firebaseUid = localStorage.getItem("firebase_uid");

      if (!token || !firebaseUid) {
        alert("Kredensial tidak ditemukan. Silakan login terlebih dahulu.");
        return;
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await getUserHistory(firebaseUid);

      if (res && Array.isArray(res.history)) {
        setHistory(res.history);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error("Gagal mengambil riwayat:", err);
      alert("Terjadi kesalahan saat mengambil riwayat.");
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleSaveSession = async (session: HistorySession) => {
    const token = localStorage.getItem("auth_token");
    const firebaseUid = localStorage.getItem("firebase_uid");
    const sessionId = session.session_id;

    if (!token || !firebaseUid) {
      toast.error(
        "Kredensial tidak ditemukan. Silakan login untuk menyimpan ke bookmark.",
        { position: "top-center" }
      );
      return;
    }

    try {
      const payload = {
        messages: session.messages,
        timestamp: new Date().toISOString(),
      };
      console.log("Payload yang dikirim ke /api/history/save:", payload);

      const response = await fetch(
        `http://localhost:8000/api/history/save/${firebaseUid}/${sessionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Gagal menyimpan bookmark.");
      }
      if (data.status === "already_saved") {
        toast.info("Sesi ini sudah pernah disimpan sebelumnya.", {
          position: "top-center",
        });
      } else {
        toast.success("Sesi berhasil disimpan ke bookmark!", {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error("Gagal menyimpan sesi:", err);
      toast.error("Terjadi kesalahan saat menyimpan.", {
        position: "top-center",
      });
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    // const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus sesi ini?");
    // if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("auth_token");
      const firebaseUid = localStorage.getItem("firebase_uid");

      if (!token || !firebaseUid) {
        alert("Kredensial tidak ditemukan. Silakan login ulang.");
        return;
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Panggil API deleteSession dengan 2 argumen
      await deleteSession(firebaseUid, sessionId);
      toast.success("Sesi berhasil dihapus", {
        position: "top-center",
      });
      // Perbarui daftar riwayat
      setHistory((prev) =>
        prev.filter((session) => session.session_id !== sessionId)
      );
    } catch (err) {
      console.error("Gagal menghapus sesi:", err);
      toast.error("Terjadi kesalahan saat menghapus.", {
        position: "top-center",
      });
    }
  };

  const getSessionSummary = (messages: Message[]) => {
    const lastAgent = [...messages]
      .reverse()
      .find((msg) => msg.role === "agent");
    return lastAgent
      ? lastAgent.content.slice(0, 150) + "..."
      : "Tidak ada ringkasan.";
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-500">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main content area */}
      <div
        className={`
          flex-1 flex flex-col overflow-hidden
          transition-all duration-500 ease-in-out
          ${isCollapsed ? "ml-0" : "ml-64"}
          relative
        `}
      >
        {/* Navbar with toggle button - Fixed position with proper z-index */}
        <div
          className={`
          sticky top-0 z-40 
          backdrop-blur-md 
          ${
            isDarkMode
              ? "bg-black/20 border-white/20"
              : "bg-white/20 border-black/20"
          } 
          border-b
        `}
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
              Chat History
            </h1>
          </div>
        </div>

        {/* History content - Scrollable area */}
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
              ) : history.length === 0 ? (
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                  {history.map((session, index) => (
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
                        border backdrop-blur-sm
                        animate-slide-in
                      `}
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animationFillMode: "both",
                      }}
                      onClick={() => navigate(`/chat/${session.session_id}`)}
                    >
                      {/* Glow effect on hover */}
                      <div
                        className={`absolute inset-0 ${
                          isDarkMode ? "bg-orange-400/10" : "bg-orange-600/10"
                        } rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10`}
                      />

                      {/* Delete button */}
                      <div className="absolute top-3 right-3 flex gap-2 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveSession(session);
                          }}
                          className={`
                          bg-blue-500 hover:bg-blue-600 
                          text-white p-2 rounded-full
                          transition-all duration-300 
                          hover:scale-110 shadow-lg
                          opacity-0 group-hover:opacity-100
                          focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-400
                          `}
                          aria-label="Save session"
                        >
                          <FaSave className="text-xs" />
                        </button>
                        <div
                          onClick={(e) => e.stopPropagation()} // penting!
                        >
                          <DeleteSessionDialog
                            onDelete={() =>
                              handleDeleteSession(session.session_id)
                            }
                          />
                        </div>
                      </div>

                      {/* Session info */}
                      <div className="space-y-3">
                        <div className={`text-sm ${themeStyles.mutedText}`}>
                          <strong className={themeStyles.subheading}>
                            Waktu:
                          </strong>
                          <br />
                          <span className="font-mono">
                            {formatTime(session.timestamp)}
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

                      {/* Hover indicator */}
                      <div
                        className={`
                        absolute bottom-3 right-3 
                        ${themeStyles.subheading} text-lg font-bold
                        opacity-0 group-hover:opacity-100 
                        transition-all duration-300 
                        transform translate-x-2 group-hover:translate-x-0
                      `}
                      >
                        →
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div ref={historyEndRef} />
            </div>
          </div>
        </div>

        {/* Custom scrollbar styles matching ChatContainer */}
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

export default HistoryPage;
