import { useState, useRef, useEffect } from 'react';
import Message from './Message';
import InputArea from './InputArea';
import LoadingIndicator from './LoadingIndicator';
import useChat from '../hooks/useChat';
import { ChatMessage } from '../types';


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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      {/* Header - Full width */}
      <header className="bg-blue-600 text-white p-4 shadow-md w-full flex justify-between items-center">
  <div>
    <h1 className="text-xl font-bold">RAG Chatbot</h1>
    <p className="text-sm opacity-80">Wisata Bali</p>
  </div>
  <button 
    onClick={() => navigate('/')}
    className="text-white hover:text-blue-200 transition"
    title="Kembali ke halaman utama"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  </button>
</header>
      {/* Messages Area - Full width */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 w-full">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 w-full">
            <div className="text-center p-6 w-full max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-2">Mulai Percakapan</h2>
              <p className="mb-4">Tanyakan apapun yang anda ingin ketahui tentang wisata di Bali dan sistem akan menjawab berdasarkan pengetahuan yang dimilikinya</p>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => sendMessage("Apa itu Bali?")}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-2 rounded-lg text-sm transition"
                >
                  Apa itu Bali?
                </button>
                <button 
                  onClick={() => sendMessage("Tempat wisata termurah di Bali")}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-2 rounded-lg text-sm transition"
                >
                  Tempat Wisata Termurah di Bali
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages list */}
        <div className="w-full max-w-4xl mx-auto">
          {messages.map((message: ChatMessage, index: number) => (
            <Message 
              key={`${index}-${message.timestamp?.getTime() || index}`} 
              message={message} 
              isLast={index === messages.length - 1}
            />
          ))}
        </div>

        {loading && <LoadingIndicator />}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-full max-w-4xl mx-auto">
            <p>Error: {error}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Full width */}
      <InputArea 
        onSend={sendMessage}
        onClear={clearConversation}
        onUpload={uploadDocument}
      />
    </div>
  );
}