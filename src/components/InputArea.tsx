import React, { useState } from "react";

type InputAreaProps = {
  onSend: (message: string) => void;
  onClear: () => void;
  onUpload: (file: File) => void;
};

export default function InputArea({ onSend, onClear, onUpload }: InputAreaProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <div className="relative flex-1 bg-transparent rounded-lg border border-white">
      <input
        type="text"
        placeholder="Type your message..."
        className="w-full p-2 rounded-lg focus:outline-none bg-transparent text-white border-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={false}
      />
      <button
        onClick={handleSend}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-indigo-300"
        disabled={!input.trim()}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 rotate-90" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
          />
        </svg>
      </button>
    </div>
  );
}
