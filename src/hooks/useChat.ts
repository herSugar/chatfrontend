import { useState } from "react";
import { api } from "../services/api";

export type ChatMessage = {
  sender: "You" | "Agent";
  text: string;
  timestamp?: Date;
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (query: string) => {
    if (!query.trim()) return;

    const token = localStorage.getItem("auth_token");
    const userEmail = localStorage.getItem("user_email");
    const sessionId = localStorage.getItem("chat_session_id");

    if (!token || !userEmail) {
      setError("Kredensial tidak ditemukan. Silakan login terlebih dahulu.");
      return;
    } 

    
    if (!api.defaults.headers.common["Authorization"]) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const newMessage: ChatMessage = { sender: "You", text: query, timestamp: new Date() };
    setMessages((prev) => [...prev, newMessage]);
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/api/ask", {
        query,
        email: userEmail,
        session_id: sessionId || "",
      });

      if (!sessionId && res.data.session_id) {
        localStorage.setItem("chat_session_id", res.data.session_id);
      }

      const reply: ChatMessage = { sender: "Agent", text: res.data.response, timestamp: new Date() };
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat mengirim pesan.");
      setMessages((prev) => [...prev, { sender: "Agent", text: "Terjadi kesalahan saat mengirim pesan.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    localStorage.removeItem("chat_session_id");
    setMessages([]);
    setError(null);
  };

  const uploadDocument = (file: File) => {
    // Implementasi upload dokumen (jika perlu)
    console.log("Uploading document", file);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearConversation,
    uploadDocument,
  };
}
