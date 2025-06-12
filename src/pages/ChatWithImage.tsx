import React, { useState } from "react";
import { getAuth } from "firebase/auth";

const ChatWithImage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("User belum login!");
        return;
      }

      const token = await user.getIdToken();
      const email = user.email;

      const formData = new FormData();
      formData.append("query", query);
      formData.append("email", email || "");
      formData.append("session_id", "optional-session-id");
      if (file) formData.append("image", file);

      const res = await fetch("http://localhost:8000/ask-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      setResponse(data.response || "Tidak ada respon.");
    } catch (err) {
      console.error("Gagal kirim:", err);
      setResponse("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-2">Chat dengan Upload Gambar 🖼️</h1>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tulis pertanyaan..."
        className="w-full border p-2 mb-2"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2"
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Mengirim..." : "Kirim"}
      </button>

      {response && (
        <div className="mt-4 p-2 border bg-gray-50 whitespace-pre-wrap">
          <strong>Agent:</strong> {response}
        </div>
      )}
    </div>
  );
};

export default ChatWithImage;
