import React, { useEffect, useRef, useState } from "react";
import { api, getUserHistory } from "../services/api";

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

  const getSessionSummary = (messages: Message[]) => {
    const lastAgent = [...messages].reverse().find(msg => msg.role === "agent");
    return lastAgent ? lastAgent.content.slice(0, 150) + "..." : "Tidak ada ringkasan.";
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Riwayat Chat</h1>
      {loading ? (
        <p>Memuat riwayat...</p>
      ) : history.length === 0 ? (
        <p>Tidak ada riwayat.</p>
      ) : (
        <div className="space-y-6">
          {history.map((session) => (
            <div key={session._id} className="border p-4 rounded shadow">
              <p className="text-sm text-gray-500 mb-1">
                <strong>Waktu:</strong> {new Date(session.timestamp).toLocaleString()}
              </p>
              <p><strong>Ringkasan:</strong> {getSessionSummary(session.messages)}</p>
            </div>
          ))}
        </div>
      )}
      <div ref={historyEndRef} />
    </div>
  );
};

export default HistoryPage;
