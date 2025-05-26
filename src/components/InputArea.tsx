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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
      e.target.value = ""; // Reset input file
    }
  };

  return (
    <div className="flex space-x-2">
      <input
      type="text"
      placeholder="Type your message..."
      className="flex-1 p-2 border border-white rounded bg-transparent text-white "
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={false}
      />
      <button
      onClick={handleSend}
      className="bg-transparent border border-white text-white px-4 rounded hover:bg-white hover:text-black transition"
      >
      Send
      </button>
      <button
      onClick={onClear}
      className="bg-transparent border border-white text-white px-4 rounded hover:bg-white hover:text-black transition"
      >
      Clear
      </button>
      <label
      htmlFor="upload-file"
      className="bg-transparent border border-white text-white px-4 rounded cursor-pointer hover:bg-white hover:text-black transition"
      >
      Upload
      </label>
      <input
      id="upload-file"
      type="file"
      className="hidden"
      onChange={handleFileChange}
      />
    </div>
  );
}
