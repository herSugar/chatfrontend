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
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-blue-400/10 rounded-lg rotate-45 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-10 h-10 bg-purple-300/10 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-indigo-300/5 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            animation: 'gridMove 25s linear infinite'
          }}></div>
        </div>
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Header with Glassmorphism */}
      <header className="relative z-10 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl">
        <div className="p-6 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            {/* AI Avatar */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-indigo-200/20 flex items-center justify-center border border-white/30 shadow-lg backdrop-blur-sm">
                <span className="text-2xl animate-pulse">🤖</span>
              </div>
              {/* Orbiting dot */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                <div className="absolute -top-1 left-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2"></div>
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                Pitu Assistant
              </h1>
              <p className="text-indigo-100 opacity-90 drop-shadow-sm">
                Your AI Travel Guide for Bali
              </p>
            </div>
          </div>
          
          {/* Enhanced Home Button */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-lg opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
            <button 
              onClick={() => navigate('/')}
              className="relative bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white p-3 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg group"
              title="Back to Home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Messages Area with Glassmorphism Container */}
      <div className="flex-1 overflow-hidden relative z-10 p-6">
        <div className="h-full backdrop-blur-lg bg-white/5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="h-full overflow-y-auto p-6 space-y-6 custom-scrollbar">
            
            {/* Welcome Screen */}
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-white">
                <div className="text-center p-8 max-w-2xl mx-auto">
                  
                  {/* Animated Welcome Avatar */}
                  <div className="relative mb-8">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-white/20 to-indigo-200/20 flex items-center justify-center border-2 border-white/30 shadow-2xl backdrop-blur-sm">
                      <span className="text-4xl animate-pulse">🌴</span>
                    </div>
                    {/* Floating elements around avatar */}
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s' }}>
                      <div className="absolute -top-2 left-1/2 w-3 h-3 bg-blue-400/60 rounded-full transform -translate-x-1/2"></div>
                      <div className="absolute -bottom-2 left-1/2 w-2 h-2 bg-purple-400/60 rounded-full transform -translate-x-1/2"></div>
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold mb-4 drop-shadow-lg bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
                    Start Your Bali Adventure
                  </h2>
                  <p className="mb-8 text-indigo-100 drop-shadow-sm leading-relaxed">
                    Ask me anything about Bali tourism and I'll provide you with expert knowledge and personalized recommendations
                  </p>
                  
                  {/* Enhanced Suggestion Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
                      <button 
                        onClick={() => sendMessage("What is Bali famous for?")}
                        className="relative w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-4 rounded-xl border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xl">🏝️</span>
                          <span className="font-medium">What is Bali famous for?</span>
                        </div>
                      </button>
                    </div>
                    
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
                      <button 
                        onClick={() => sendMessage("Budget-friendly places in Bali")}
                        className="relative w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-4 rounded-xl border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xl">💰</span>
                          <span className="font-medium">Budget-friendly Places</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Messages List */}
            {messages.length > 0 && (
              <div className="space-y-6">
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
              <div className="flex justify-center">
                <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
                  <LoadingIndicator />
                </div>
              </div>
            )}
            
            {error && (
              <div className="backdrop-blur-sm bg-red-500/20 border border-red-400/30 text-red-100 p-6 rounded-2xl shadow-xl">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">⚠️</span>
                  <p className="font-medium">Error: {error}</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Enhanced Input Area */}
      <div className="relative z-10 p-6 pt-0">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <InputArea 
            onSend={sendMessage}
            onClear={clearConversation}
            onUpload={uploadDocument}
          />
        </div>
      </div>


    </div>
  );
}