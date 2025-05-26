import React, { useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import InputArea from "./InputArea";

type ChatMessage = {
  sender: "You" | "Agent";
  text: string;
  timestamp?: Date;
};

function Message({ message }: { message: ChatMessage }) {
  const isUser = message.sender === "You";
  return (
    <div
      className={`max-w-md p-3 rounded-lg mb-2 ${
        isUser ? "bg-indigo-600 text-white self-end" : "bg-gray-200 text-black self-start"
      }`}
    >
      {message.text}
    </div>
  );
}

export default function ChatContainer() {
  const {
    messages,
    loading,
    error,
    sendMessage,
    clearConversation,
    uploadDocument,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen w-full bg-white relative overflow-hidden">
      {/* Sidebar */}
      <div
        className="fixed left-0 top-0 bottom-0 w-64 text-white p-1 shadow-lg"
        style={{
          background: "linear-gradient(to bottom, #7c3aed, #301A61)",
        }}
      >
        {/* Sidebar content sama seperti kamu punya */}
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: "256px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "24px",
            background: "linear-gradient(to bottom, #7c3aed, #301A61)",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "100%",
              margin: "0 auto",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ flex: 1 }}>
              {messages.length === 0 && !loading && (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "24px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "3rem",
                      textAlign: "center",
                      color: "white",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                    }}
                  >
                    Hi, User!
                  </h2>
                  <p
                    style={{
                      color: "white",
                      textAlign: "center",
                      marginBottom: "2rem",
                    }}
                  >
                    Start a conversation by typing your message below or upload a
                    document to get started.
                  </p>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  paddingBottom: "32px",
                  maxWidth: "968px",
                  margin: "0 auto",
                  alignItems: "flex-end",
                }}
              >
                {messages.map((msg, idx) => (
                  <Message key={idx} message={msg} />
                ))}
              </div>

              {loading && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <p className="text-white">Loading...</p>
                </div>
              )}

              {error && (
                <div
                  style={{
                    maxWidth: "672px",
                    margin: "0 auto",
                    backgroundColor: "#fee2e2",
                    border: "1px solid #fca5a5",
                    color: "#b91c1c",
                    padding: "16px",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>⚠️</span>
                    <p>Error: {error}</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div
              style={{
                position: "sticky",
                bottom: 0,
                width: "100%",
                padding: "16px 16px 12px",
                backgroundColor: "white",
              }}
            >
              <InputArea
                onSend={sendMessage}
                onClear={clearConversation}
                onUpload={uploadDocument}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
