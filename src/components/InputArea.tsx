import { useState, useRef, FormEvent, KeyboardEvent } from 'react';

interface InputAreaProps {
  onSend: (message: string) => void;
  onClear: () => void;
  onUpload: (file: File) => Promise<void>;
}

export default function InputArea({ onSend, onClear, onUpload }: InputAreaProps) {
  const [input, setInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onUpload(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <div className="flex items-end gap-3">

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tulis pesan..."
            className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '144px' }}
            aria-label="Message input"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`absolute right-2 mb-[9px] mt-[12px] rounded-full transition-colors duration-200 ${
              input.trim() ? 'text-black hover:text-gray-800' : 'text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" transform="rotate(90)">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}