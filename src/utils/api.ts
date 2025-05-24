import { ChatMessage, ChatResponse, UploadResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create a reusable headers object
const defaultHeaders = {
  'Content-Type': 'application/json',
};

export const sendMessageToBackend = async (
  message: string, 
  history: ChatMessage[] = []
): Promise<ChatResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({
        message,
        history: history.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to get response from server');
    }

    return await response.json() as ChatResponse;
  } catch (error) {
    // Convert all errors to Error instance for consistency
    throw error instanceof Error ? error : new Error('Network error occurred');
  }
};

export const uploadDocumentToBackend = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type header when using FormData
      // The browser will set it automatically with the correct boundary
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to upload document');
    }

    return await response.json() as UploadResponse;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Network error during upload');
  }
};

// Optional: Add a utility function for handling errors
const handleApiError = (error: unknown) => {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
    return error;
  }
  return new Error('An unknown error occurred');
};