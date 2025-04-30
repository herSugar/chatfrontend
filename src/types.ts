// types.ts
export type MessageRole = 'user' | 'assistant' | 'system';

export interface MessageSource {
  title?: string;
  text?: string;
  url?: string;
  page?: number;
  confidence?: number;
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
  sources?: MessageSource[];
  timestamp?: Date;
}

export interface ChatResponse {
  answer: string;
  sources: MessageSource[];
  context?: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  documentId?: string;
  filename?: string;
}