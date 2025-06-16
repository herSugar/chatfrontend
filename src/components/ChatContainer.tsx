import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import Message from "./Message";
import Sidebar from "./Sidebar";
import { getSession } from "../services/api";

interface Props {
  sessionId?: string;
}

export default function ChatContainer({ sessionId }: Props) {
  const {
    messages,
    loading,
    error,
    sendMessage,
    clearConversation,
    uploadDocument,
    loadMessagesFromSession,
    resetSession,
    isSessionLoaded,
  } = useChat();

  const [query, setQuery] = useState("");
  const [sessionLoading, setSessionLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Track previous sessionId to detect changes
  const [prevSessionId, setPrevSessionId] = useState<string | undefined>(sessionId);

  useEffect(() => {
    // Reset session hanya ketika sessionId berubah, bukan saat pertama kali
    if (sessionId !== prevSessionId && prevSessionId !== undefined) {
      console.log("Session changed, resetting...", { prevSessionId, sessionId });
      // Reset file states when session changes
      setSelectedFile(null);
      setFilePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
    setPrevSessionId(sessionId);
  }, [sessionId, prevSessionId]);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;

      if (isSessionLoaded) {
        console.log("Session already loaded");
        return;
      }

      setSessionLoading(true);

      try {
        const firebaseUid = localStorage.getItem("firebase_uid");
        const token = localStorage.getItem("auth_token");
        if (!firebaseUid || !token) {
          alert("Unauthorized. Please login again.");
          return;
        }

        const sessionData = await getSession(firebaseUid, sessionId);
        console.log("Fetched session data:", sessionData);
        loadMessagesFromSession(sessionData.session_id, sessionData.messages);

      } catch (err) {
        console.error("Failed to load session", err);
      } finally {
        setSessionLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, loadMessagesFromSession, isSessionLoaded]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File terlalu besar. Maksimal 10MB.');
        return;
      }
      
      // Check file type (images only)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Tipe file tidak didukung. Hanya gambar yang diizinkan.');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Remove selected file
  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Updated onSend function to handle file upload
  const onSend = async () => {
    if (!query.trim() && !selectedFile) return;

    try {
      // Call sendMessage with file parameter
      await sendMessage(query, selectedFile || undefined);
      
      // Clear input and file after sending
      setQuery("");
      setSelectedFile(null);
      setFilePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading && !sessionLoading) {
      e.preventDefault();
      onSend();
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Debug: log current state
  console.log("ChatContainer render - sessionId:", sessionId, "messages count:", messages.length, "sessionLoading:", sessionLoading, "isSessionLoaded:", isSessionLoaded);
  console.log("Current messages:", messages);

  return (
    <div className="flex h-screen bg-[#7c3aed] overflow-hidden">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <div
        className={`
          flex-1 flex flex-col overflow-hidden
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "ml-0" : "ml-48"}
          bg-gradient-to-b from-[#7c3aed] to-[#312e81]
          relative
        `}
      >
        <div className="[&>nav]:!relative [&>nav]:!top-auto">
          <div className="flex items-center p-4">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-indigo-600 transition-colors text-white"
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <h1 className="ml-4 text-2xl font-bold text-white">
              {sessionId ? `Chat Session: ${sessionId}` : "New Chat"}
            </h1>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 h-full bg-gradient-to-b from-[#7c3aed] to-[#312e81] relative">
          <div className="flex flex-col h-full min-h-0 container mx-auto pr-2">
            <div
              className="flex-1 overflow-y-auto p-6 min-h-0 max-w-4xl mx-auto w-full custom-scrollbar"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#a5b4fc #312e81",
              }}
            >
              <div className="flex flex-col">
                {sessionLoading && (
                  <div className="text-white text-center italic mt-4">
                    <p>Loading session...</p>
                    <div className="mt-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                    </div>
                  </div>
                )}

                {/* Tampilkan pesan welcome hanya jika tidak ada sessionId dan tidak ada messages */}
                {!sessionId && messages.length === 0 && !loading && !sessionLoading && (
                  <div className="text-white text-center mt-20">
                    <h2 className="text-4xl font-bold mb-4">Hi, User!</h2>
                    <p className="mb-2">Start a conversation by typing your message below.</p>
                    <p className="text-sm opacity-80">You can also upload images to get travel information about Bali destinations!</p>
                  </div>
                )}

                {/* Tampilkan info jika session dimuat tapi tidak ada messages */}
                {sessionId && !sessionLoading && messages.length === 0 && isSessionLoaded && (
                  <div className="text-white text-center mt-20">
                    <h2 className="text-2xl font-bold mb-4">Session Loaded</h2>
                    <p>This session doesn't have any messages yet.</p>
                  </div>
                )}

                {/* Render messages */}
                {messages.length > 0 ? (
                  messages.map((msg, idx) => {
                    console.log(`Rendering message ${idx}:`, msg);
                    return <Message key={`${sessionId || 'new'}-${idx}`} message={msg} />;
                  })
                ) : (
                  console.log("No messages to render") || null
                )}

                {loading && (
                  <div className="text-white text-center italic mt-4">
                    <p>Agent is typing...</p>
                    <div className="mt-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mt-4">
                    <p className="text-red-400 text-center font-semibold">
                      Error: {error}
                    </p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* File Preview Area */}
            {selectedFile && (
              <div className="max-w-4xl mx-auto w-full mb-2">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-3 border border-white/20">
                  <div className="flex items-center space-x-3">
                    {filePreview && (
                      <div className="relative w-12 h-12">
                        <img 
                          src={filePreview} 
                          alt="Preview" 
                          className="w-12 h-12 object-cover rounded border border-white/20"
                        />
                        <button
                          onClick={removeSelectedFile}
                          className="absolute -top-1 -right-1 bg-black/50 hover:bg-black text-white/80 hover:text-white p-0.5 rounded-full transition-colors"
                          title="Hapus file"
                          aria-label="Remove file"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{selectedFile.name}</p>
                      <p className="text-white/60 text-xs">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="max-w-4xl mx-auto w-full flex gap-2 p-2 text-white border border-white/20 bg-white/13 backdrop-blur-lg rounded-3xl shadow-lg items-center mb-6 mt-2">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*"
                disabled={loading || sessionLoading}
              />
              
              {/* File upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-transparent rounded-full hover:bg-indigo-600/30 transition-colors flex items-center justify-center"
                disabled={loading || sessionLoading}
                title="Upload gambar
Tipe gambar: JPEG, JPG, PNG, GIF, WEBP (maks 10MB)"
                aria-label="Upload gambar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>

              {/* Text input */}
              <input
                type="text"
                placeholder={
                  sessionLoading 
                    ? "Loading session..." 
                    : selectedFile 
                      ? `File terpilih: ${selectedFile.name} - Tambahkan pesan...`
                      : "Ketik pesan Anda di sini..."
                }
                className="flex-1 p-3 rounded-lg bg-transparent outline-none text-white placeholder-indigo-200/70"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading || sessionLoading}
              />

              {/* Send button */}
              <button
                className="bg-transparent hover:bg-indigo-600/30 text-white rounded-full p-3 flex items-center justify-center transition-colors"
                onClick={onSend}
                disabled={loading || sessionLoading || (!query.trim() && !selectedFile)}
                aria-label="Send message"
                style={{ minWidth: "48px" }}
                title="Kirim pesan"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}