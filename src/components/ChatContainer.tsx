import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import InputArea from "./InputArea";
import LoadingIndicator from "./LoadingIndicator";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type ChatMessage = {
  sender: "You" | "Agent";
  text: string;
  timestamp?: Date;
};

function Message({ message }: { message: ChatMessage }) {
  const isUser = message.sender === "You";
  return (
    <div
      className={`max-w-[80%] p-3 rounded-lg mb-2 ${
        isUser 
          ? "bg-indigo-600 text-white ml-auto" 
          : "bg-gray-200 text-black mr-auto"
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

  const [isCollapsed, setIsCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-[#7c3aed] overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      
      {/* Main content area */}
      <div className={`
        flex-1 flex flex-col overflow-hidden
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'ml-0' : 'ml-48'}
        bg-gradient-to-b from-[#7c3aed] to-[#312e81]
      `}>
        {/* Navbar with toggle button - Static positioning override */}
        <div className="[&>nav]:!relative [&>nav]:!top-auto">
          <Navbar 
            transparentOnTop={true} 
            disableScrollEffect={true}
          >
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-indigo-600 transition-colors text-white"
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
          </Navbar>
        </div>
        
        {/* Chat content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#7c3aed] to-[#312e81]">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto h-full flex flex-col">
                {messages.length === 0 && !loading && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <h2 className="text-4xl font-bold text-white mb-4">Hi, User!</h2>
                    <p className="text-white/80 text-lg mb-8 max-w-md">
                      Start a conversation by typing your message below or upload a document to get started.
                    </p>
                  </div>
                )}

                {/* Animated 3D Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  {/* Floating Geometric Shapes */}
                  <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
                  <div className="absolute top-40 right-20 w-16 h-16 bg-blue-400/20 rounded-lg rotate-45 animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute bottom-40 left-20 w-12 h-12 bg-purple-300/15 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
                  <div className="absolute bottom-20 right-10 w-24 h-24 bg-indigo-300/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  
                  {/* Animated Grid Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                      backgroundSize: '50px 50px',
                      animation: 'gridMove 20s linear infinite'
                    }}></div>
                  </div>
                  
                  {/* Floating Particles */}
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 3}s`
                      }}
                    ></div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 w-full">
                  {messages.map((msg, idx) => (
                    <Message key={`${idx}-${msg.timestamp?.getTime()}`} message={msg} />
                  ))}
                </div>

                {loading && (
                  <div className="flex justify-center py-4">
                    <LoadingIndicator />
                  </div>
                )}

                {error && (
                  <div className="max-w-xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg my-4">
                    <div className="flex items-center gap-2">
                      <span>⚠️</span>
                      <p>{error}</p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Sticky input area */}
            <div className="sticky bottom-0 w-full p-4 bg-transparent backdrop-blur-sm">
              <div className="max-w-4xl mx-auto">
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
    </div>
  );
}