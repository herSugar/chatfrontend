import React from 'react';
import { ChatMessage } from '../types';

interface MessageProps {
  message: ChatMessage;
  isLast: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isLast }) => {
  const isUser = message.role === 'user';
  const timestamp = message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
        )}

        {/* Decorative elements for AI messages */}
        {!isUser && (
          <>
            {/* Corner accent */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-400/30 rounded-full"></div>
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-400/30 rounded-full"></div>
          </>
        )}

        {/* Animated indicator for last message */}
        {isLast && !isUser && (
          <div className="absolute -bottom-2 right-4 w-4 h-4 bg-indigo-500 rounded-full animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

export default Message;