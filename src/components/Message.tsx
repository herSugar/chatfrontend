import React, { useEffect, useRef, useState } from 'react';
import { api } from '../services/api';

const ChatContainer: React.FC = () => {
  // State & Refs (from second file)
  const [query, setQuery] = useState("");
  const [chatLog, setChatLog] = useState<{ sender: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [chatLog]);

  // Send message function
  const sendMessage = async () => {
    if (!query.trim()) return;

    const token = localStorage.getItem("auth_token");
    const userEmail = localStorage.getItem("user_email");
    if (!token || !userEmail) {
      alert("Please log in first.");
      return;
    }

    // Set auth token
    if (!api.defaults.headers.common["Authorization"]) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    // Update chat log
    setChatLog((prev) => [...prev, { sender: "You", text: query }]);
    setLoading(true);

    try {
      const res = await api.post("/api/ask", { query, email: userEmail });
      setChatLog((prev) => [...prev, { sender: "Agent", text: res.data.response }]);
    } catch (err) {
      setChatLog((prev) => [...prev, { sender: "Agent", text: "Error sending message." }]);
    } finally {
      setQuery("");
      setLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) sendMessage();
  };

  // UI (from second file)
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 last:mb-0`}>
      <div
        className={`relative max-w-3xl rounded-2xl px-6 py-4 shadow-lg ${
          isUser
            ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white'
            : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
        }`}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {/* Timestamp */}
        {timestamp && (
          <div
            className={`text-xs mt-1 ${
              isUser ? 'text-blue-200' : 'text-white/60'
            }`}
          >
            {timestamp}
          </div>
        ))}
        {loading && <p><em>Agent is typing...</em></p>}
        <div ref={chatEndRef} />
      </div>
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Type your question..."
          style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{ padding: "0.5rem 1rem", backgroundColor: loading ? "#ccc" : "#8B5CF6", color: "#fff", border: "none", borderRadius: "4px", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;