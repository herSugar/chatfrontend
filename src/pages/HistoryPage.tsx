import React, { useEffect, useRef, useState } from "react";
import { api, getUserHistory, deleteSession } from "../services/api";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom"; // Tambahkan import

type Message = {
  role: string;
  content: string;
  timestamp: string;
};

type HistorySession = {
  _id: string;
  firebase_uid: string;
  session_id: string;
  messages: Message[];
  timestamp: string;
};

const HistoryPage = () => {
  const [history, setHistory] = useState<HistorySession[]>([]);
  const [loading, setLoading] = useState(false);
  const historyEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate(); 
  
  // const [isCollapsed, setIsCollapsed] = useState(false);
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

  const handleDeleteSession = async (sessionId: string) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus sesi ini?");
    if (!confirmDelete) return;

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

      // Perbarui daftar riwayat
      setHistory(prev => prev.filter(session => session.session_id !== sessionId));
    } catch (err) {
      console.error("Gagal menghapus sesi:", err);
      alert("Terjadi kesalahan saat menghapus sesi.");
    }
  };

  const getSessionSummary = (messages: Message[]) => {
    const lastAgent = [...messages].reverse().find(msg => msg.role === "agent");
    return lastAgent ? lastAgent.content.slice(0, 150) + "..." : "Tidak ada ringkasan.";
  };

  const [isCollapsed, setIsCollapsed] = useState(false);
  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen bg-[#7c3aed] overflow-hidden">
      {/* Sidebar */}
      <Sidebar
      isCollapsed={isCollapsed}
      onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main content area */}
      <div
      className={`
        flex-1 flex flex-col overflow-hidden
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'ml-0' : 'ml-48'}
        bg-gradient-to-b from-[#7c3aed] to-[#312e81]
      `}
      >
      {/* Navbar with toggle button */}
      <div className="[&>nav]:!relative [&>nav]:!top-auto">
        {/* You can replace this with your Navbar component if available */}
        <div className="flex items-center p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-indigo-600 transition-colors text-white"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <h1 className="ml-4 text-2xl font-bold text-white">Riwayat Chat</h1>
        </div>
      </div>

      {/* History content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#7c3aed] to-[#312e81]">
        <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-white text-lg">
            Memuat riwayat...
            </div>
          ) : history.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-white text-lg">
            Tidak ada riwayat.
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full">
            {history.map((session) => (
              <div
              key={session._id}
              className="relative border border-white p-4 rounded shadow cursor-pointer hover:bg-white/10 transition"
              style={{ background: "rgba(255,255,255,0.08)", color: "white" }}
              onClick={() => navigate(`/chat/${session.session_id}`)}
              >
              <button
                onClick={e => {
                e.stopPropagation();
                handleDeleteSession(session.session_id);
                }}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded"
              >
                Hapus
              </button>
              <p className="text-sm mb-1">
                <strong>Waktu:</strong>{" "}
                {new Date(session.timestamp).toLocaleString()}
              </p>
              <p>
                <strong>Ringkasan:</strong>{" "}
                {getSessionSummary(session.messages)}
              </p>
              </div>
            ))}
            </div>
          )}
          <div ref={historyEndRef} />
          </div>
        </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default HistoryPage;
