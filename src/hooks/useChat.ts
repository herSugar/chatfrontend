// src/hooks/useChat.ts
import { useState, useCallback } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToBackend, uploadDocumentToBackend } from '../utils/api';

const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Add user message immediately
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);

      // Send to backend
      const response = await sendMessageToBackend(message, messages);
      
      // Add bot response
      const botMessage: ChatMessage = {
        role: 'assistant',
        content: response.answer,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  }, [messages]);

  const uploadDocument = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await uploadDocumentToBackend(file);
      
      // Add bot response from document processing
      const botMessage: ChatMessage = {
        role: 'assistant',
        content: response.message || 'I have processed your document',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    uploadDocument,
    clearConversation
  };
};

export default useChat;