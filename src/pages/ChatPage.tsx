import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSession } from "../services/api"; // pastikan sudah impor
import { api } from "../services/api";

type Message = {
  role: string;
  content: string;
  timestamp: string;
};

const ChatPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const firebaseUid = localStorage.getItem("firebase_uid");

        if (!token || !firebaseUid) return;

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const session = await getSession(firebaseUid, sessionId || "");
        setMessages(session.messages || []);
      } catch (err) {
        console.error("Gagal memuat session:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Detail Chat</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx} className="p-3 rounded bg-white/10">
              <p><strong>{msg.role}</strong> ({new Date(msg.timestamp).toLocaleString()}):</p>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatPage;
