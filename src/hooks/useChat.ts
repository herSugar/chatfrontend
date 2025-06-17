import { useState, useCallback } from "react";
import { api } from "../services/api";

export type ChatMessage = {
  sender: "You" | "Agent";
  text: string;
  timestamp?: Date;
  fileName?: string;
  fileType?: string;
};

export function useChat(initialSessionId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  // Updated sendMessage to support file upload
  const sendMessage = async (query: string, file?: File) => {
    if (!query.trim() && !file) return;

    const token = localStorage.getItem("auth_token");
    const userEmail = localStorage.getItem("user_email");

    if (!token || !userEmail) {
      setError("Kredensial tidak ditemukan. Silakan login terlebih dahulu.");
      return;
    }

    const sessionIdToUse = sessionId ?? localStorage.getItem("chat_session_id") ?? "";

    // Create user message
    const newMessage: ChatMessage = {
      sender: "You",
      text: query || (file ? `Uploaded: ${file.name}` : ""),
      timestamp: new Date(),
      fileName: file?.name,
      fileType: file?.type,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setLoading(true);
    setError(null);

    try {
      let response;

      if (file) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append('query', query);
        formData.append('email', userEmail);
        formData.append('session_id', sessionIdToUse);
        formData.append('file', file);

        // Make request with FormData using fetch (not axios)
        response = await fetch('http://localhost:8000/api/ask', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        
        // Handle response
        if (!sessionId && res.session_id) {
          setSessionId(res.session_id);
          localStorage.setItem("chat_session_id", res.session_id);
        }

        let rawResponse = res.response as string;
        rawResponse = rawResponse.replace(/^agent:\s*agent:\s*/i, "");

        const reply: ChatMessage = {
          sender: "Agent",
          text: rawResponse,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, reply]);

      } else {
        // Use regular axios for text-only messages
        if (!api.defaults.headers.common["Authorization"]) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

      const formData = new FormData();
      formData.append("query", query);
      formData.append("email", userEmail);
      formData.append("session_id", sessionIdToUse);

      const res = await api.post("http://localhost:8000/api/ask", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

        // Save session ID if new
        if (!sessionId && res.data.session_id) {
          setSessionId(res.data.session_id);
          localStorage.setItem("chat_session_id", res.data.session_id);
        }

        let rawResponse = res.data.response as string;
        rawResponse = rawResponse.replace(/^agent:\s*agent:\s*/i, "");

        const reply: ChatMessage = {
          sender: "Agent",
          text: rawResponse,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, reply]);
      }

    } catch (err) {
      console.error("Error in sendMessage:", err);
      let errorMsg = "Terjadi kesalahan saat mengirim pesan.";
      
      // More specific error handling
      if (err instanceof Error) {
        if (err.message.includes('413')) {
          errorMsg = "File terlalu besar. Silakan pilih file yang lebih kecil.";
        } else if (err.message.includes('422')) {
          errorMsg = "Format file tidak didukung atau ada masalah dengan data.";
        } else if (err.message.includes('401')) {
          errorMsg = "Sesi login telah berakhir. Silakan login kembali.";
        }
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = useCallback(() => {
    localStorage.removeItem("chat_session_id");
    setMessages([]);
    setError(null);
    setSessionId(undefined);
    setIsSessionLoaded(false);
  }, []);

  const uploadDocument = useCallback((file: File) => {
    // This function can be used for direct file upload without text
    console.log("Uploading document", file);
    // You can call sendMessage with empty string and the file
    sendMessage("", file);
  }, []);

  // Function to load messages from session id
  const loadMessagesFromSession = useCallback(
    async (loadedSessionId: string, loadedMessages: ChatMessage[]) => {
      try {
        console.log("Loading session:", loadedSessionId);
        console.log("Loading messages:", loadedMessages);
        
        // Ensure proper timestamp format
        const formattedMessages = loadedMessages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
        }));
        
        // Clear error state when loading new session
        setError(null);
        
        // Set session data
        setSessionId(loadedSessionId);
        setMessages(formattedMessages);
        setIsSessionLoaded(true);
        
        // Update localStorage
        localStorage.setItem("chat_session_id", loadedSessionId);
        
        console.log("Session loaded successfully:", {
          sessionId: loadedSessionId,
          messageCount: formattedMessages.length
        });
        
      } catch (err) {
        console.error("Error in loadMessagesFromSession:", err);
        setError("Gagal memuat session. Silakan coba lagi.");
        setIsSessionLoaded(false);
      }
    },
    []
  );

  // Function to reset session state (useful when switching sessions)
  const resetSession = useCallback(() => {
    console.log("Resetting session state");
    setMessages([]);
    setError(null);
    setSessionId(undefined);
    setIsSessionLoaded(false);
    localStorage.removeItem("chat_session_id");
  }, []);

  // Function to set session ID without messages (for new session)
  const setNewSession = useCallback((newSessionId: string) => {
    setSessionId(newSessionId);
    setIsSessionLoaded(true);
    localStorage.setItem("chat_session_id", newSessionId);
  }, []);

  return {
    messages,
    loading,
    error,
    sessionId,
    isSessionLoaded,
    sendMessage,
    clearConversation,
    uploadDocument,
    loadMessagesFromSession,
    resetSession,
    setNewSession,
  };
}