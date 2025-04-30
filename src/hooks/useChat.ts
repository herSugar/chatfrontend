import { useState } from 'react';
import { sendMessageToBackend, uploadDocumentToBackend } from '../utils/api';
import { ChatMessage, ChatResponse, UploadResponse } from '../types';

export default function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string): Promise<void> => {
    const userMessage: ChatMessage = { 
      role: 'user', 
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);
    
    try {
      const response: ChatResponse = await sendMessageToBackend(content, messages);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.answer,
        sources: response.sources || [],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses permintaan');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: File): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response: UploadResponse = await uploadDocumentToBackend(file);
      setMessages(prev => [...prev, {
        role: 'system',
        content: `Dokumen "${file.name}" berhasil diunggah dan siap digunakan untuk referensi.`,
        timestamp: new Date()
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengunggah dokumen');
      console.error('Error uploading document:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = (): void => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearConversation,
    uploadDocument
  };
}