import React, { useEffect, useRef, useState } from "react";
import { api } from "../services/api";

const ChatPage = () => {
  const [query, setQuery] = useState("");
  const [chatLog, setChatLog] = useState<{ sender: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);

  const sendMessage = async () => {
    if (!query.trim()) return;

    const token = localStorage.getItem("auth_token");
    const userEmail = localStorage.getItem("user_email");

    if (!token || !userEmail) {
      alert("Kredensial tidak ditemukan. Silakan login terlebih dahulu.");
      return;
    }

    // Set token ke header API instance (hanya jika belum di-set)
    if (!api.defaults.headers.common["Authorization"]) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    setChatLog((prev) => [...prev, { sender: "You", text: query }]);
    setLoading(true);

    try {
      const res = await api.post("/api/ask", {
        query,
        email: userEmail,
        session_id: "", // kosongkan agar session baru dibuat
      });

      const reply = res.data.response;
      setChatLog((prev) => [...prev, { sender: "Agent", text: reply }]);
    } catch (err) {
      console.error(err);
      setChatLog((prev) => [...prev, { sender: "Agent", text: "Terjadi kesalahan saat mengirim pesan." }]);
    } finally {
      setQuery("");
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Chat dengan Travel Agent</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
          minHeight: "300px",
          maxHeight: "400px",
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
        }}
      >
        {chatLog.map((msg, i) => (
          <div key={i} style={{ marginBottom: "1rem" }}>
            <strong>{msg.sender}:</strong> <span>{msg.text}</span>
          </div>
        ))}
        {loading && <p><em>Agent is typing...</em></p>}
        <div ref={chatEndRef} />
      </div>

      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          placeholder="Tulis pertanyaan..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: loading ? "#ccc" : "#8B5CF6",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Mengirim..." : "Kirim"}
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
