import { useState, useRef, useEffect } from 'react';
import Message from './Message';
import InputArea from './InputArea';
import LoadingIndicator from './LoadingIndicator';
import useChat from '../hooks/useChat';
import { ChatMessage } from '../types';
import { useNavigate } from 'react-router-dom';

export default function ChatContainer() {
  const navigate = useNavigate();
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen w-full bg-white relative overflow-hidden">
      {/* Sidebar */}
      <div 
        className="fixed left-0 top-0 bottom-0 w-64 text-white p-1 shadow-lg"
        style={{
          background: 'linear-gradient(to bottom, #7c3aed, #301A61)'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="mb-8 flex items-center space-x-4">
            {/* Logo Image Container */}
            <div className="flex items-center justify-center mt-5 w-64 h-28 min-w-[4.5rem] min-h-[4.5rem] overflow-hidden">
              <div className="w-64 h-64 overflow-hidden">
                <img 
                  src="src/assets/logobalipitu.png"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Divider Lines */}
          <div className="mb-6 mx-auto w-[calc(100%-32px)] h-1 bg-white"></div>

          {/* Navigation */}
          <nav className="flex-1 shadow-xl overflow-y-auto">
            <ul className="space-y-4">
              <button className="flex items-center space-x-3 p-3 w-full hover:bg-indigo-800 rounded-lg transition-colors">
                <span>💬</span>
                <span>Chat Generator</span>
              </button>
              <button className="flex items-center space-x-3 p-3 w-full hover:bg-indigo-800 rounded-lg transition-colors">
                <span>🕒</span>
                <span>History</span>
              </button>
              <button className="flex items-center space-x-3 p-3 w-full hover:bg-indigo-800 rounded-lg transition-colors">
                <span>💾</span>
                <span>My Saves</span>
              </button>
              <button className="flex items-center space-x-3 p-3 w-full hover:bg-indigo-800 rounded-lg transition-colors">
                <span>📊</span>
                <span>Statistics</span>
              </button>
              <div className="my-6 mx-auto w-[calc(100%-32px)] h-1 bg-white"></div>
              <button className="flex items-center space-x-3 p-3 w-full hover:bg-indigo-800 rounded-lg transition-colors">
                <span>⚙️</span>
                <span>Settings</span>
              </button>
              <button className="flex items-center space-x-3 p-3 w-full hover:bg-indigo-800 rounded-lg transition-colors">
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '256px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Messages Area with Input Container */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px', background: 'linear-gradient(to bottom, #7c3aed, #301A61)', position: 'relative' }}>
          <div style={{ width: '100%', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Welcome/Messages Content */}
            <div style={{ flex: 1 }}>
              {/* Welcome Message */}
              {messages.length === 0 && !loading && (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                  <h2 style={{ fontSize: '3rem', textAlign: 'center', color: 'white', fontWeight: 'bold', marginBottom: '1rem' }}>Hi, User!</h2>
                  <p style={{ color: 'white', textAlign: 'center', marginBottom: '2rem' }}>
                    Start a conversation by typing your message below or upload a document to get started.
                  </p>
                </div>
              )}

              {/* Messages List */}
              {messages.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '32px', maxWidth: '968px', margin: '0 auto', alignItems: 'flex-end' }}>
                  {messages.map((message: ChatMessage, index: number) => (
                    <Message 
                      key={`${index}-${message.timestamp?.getTime() || index}`} 
                      message={message} 
                      isLast={index === messages.length - 1}
                    />
                  ))}
                </div>
              )}

              {loading && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <LoadingIndicator />
                </div>
              )}
              
              {error && (
                <div style={{ maxWidth: '672px', margin: '0 auto', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>⚠️</span>
                    <p>Error: {error}</p>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Full Width */}
            <div style={{ position: 'sticky', bottom: 0, width: '100%', padding: '16px 16px 12px' }}>
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