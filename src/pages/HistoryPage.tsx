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

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <div
        className="fixed left-0 top-0 bottom-0 w-64 text-white p-1 shadow-lg z-10"
        style={{
          background: "linear-gradient(to bottom, #7c3aed, #301A61)",
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4 text-white">Riwayat Chat</h1>
        {loading ? (
          <p>Memuat riwayat...</p>
        ) : history.length === 0 ? (
          <p>Tidak ada riwayat.</p>
        ) : (
          <div className="space-y-6">
            {history.map((session) => (
              <div
          key={session._id}
          className="relative border border-white p-4 rounded shadow cursor-pointer hover:bg-white/10 transition"
          style={{ background: "rgba(255,255,255,0.08)", color: "white" }}
          onClick={() => navigate(`/chat/${session.session_id}`)} // Navigasi ke halaman chat
        >
                <button
                  onClick={() => handleDeleteSession(session.session_id)}
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
  );
};

export default HistoryPage;
