// components/Message.tsx
import React from "react";

export interface ChatMessage {
  sender: string;
  text: string;
  timestamp?: string;
  image?: string; // Base64 image data or URL
  fileName?: string; // Optional file name for display
}

interface Props {
  message: any; // Bisa ChatMessage atau format dari OpenAI
}

export default function Message({ message }: Props) {
  const parsedMessage = normalizeMessage(message);
  const isUser = parsedMessage.sender === "You";
  const jsonData = extractJSON(parsedMessage.text);
  console.log("🧪 Raw text:", parsedMessage);
console.log("🧪 Parsed JSON:", jsonData);


  const formattedTime = parsedMessage.timestamp
    ? new Date(parsedMessage.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  let content: React.ReactNode = parsedMessage.text;

  // Handle JSON structured content
  if (jsonData && jsonData.title && jsonData.categories) {
    content = (
      <div className="bg-white/90 rounded-lg p-4 shadow-md text-black max-w-xl">
        <h3 className="font-bold text-lg mb-2">{jsonData.title}</h3>
        {jsonData.intro && <p className="mb-3">{jsonData.intro}</p>}

        {jsonData.categories.map((cat: any, idx: number) => (
          <div key={idx} className="mb-3">
            <h4 className="font-semibold">{cat.label}</h4>
            <ul className="list-disc list-inside">
              {cat.places.map((place: string, i: number) => (
                <li key={i}>{place}</li>
              ))}
            </ul>
          </div>
        ))}

        {jsonData.closing && <p className="italic">{jsonData.closing}</p>}
      </div>
    );
  }

  // Debug: Log the message to see what we're receiving
  // console.log("Message data:", parsedMessage);

  return (
  <div className="flex flex-col">
    {/* Display filename bubble if present */}

    {/* ✅ Display image if present */}
    {parsedMessage.image && (
  <div
    className={`max-w-[80%] mb-2 ${isUser ? "ml-auto" : "mr-auto"}`}
  >
    <img
      src={`data:image/jpeg;base64,${parsedMessage.image}`}  // ✅ JPEG khusus
      alt={parsedMessage.fileName || "Uploaded image"}
      className="rounded-lg max-h-60 object-cover"
    />
  </div>
)}


    {/* Display text message bubble */}
    {parsedMessage.text && parsedMessage.text.trim() && (
      <div className={`max-w-[80%] p-3 rounded-lg mb-1 break-words whitespace-pre-wrap ${isUser ? "bg-orange-600 text-white ml-auto" : "bg-gray-300 text-black mr-auto"}`}>
        {content}
      </div>
    )}

    {/* Timestamp */}
    <div className={`text-xs text-gray-400 ${isUser ? "text-right pr-1" : "text-left pl-1"}`}>
      {formattedTime}
    </div>
  </div>
);

}

// Mengubah message dari OpenAI-style ke format standar ChatMessage
function normalizeMessage(msg: any): ChatMessage {
  // Handle different message formats
  if ("role" in msg && "content" in msg) {
    return {
      sender: msg.role === "user" ? "You" : "Assistant",
      text: msg.content || "",
      timestamp: msg.timestamp ?? new Date().toISOString(),
      image: msg.image,
      fileName: msg.fileName,
    };
  }

  // Handle direct ChatMessage format
  return {
    sender: msg.sender ?? "Unknown",
    text: msg.text ?? "",
    timestamp: msg.timestamp ?? new Date().toISOString(),
    image: msg.image,
    fileName: msg.fileName,
  };
}

// Mengekstrak JSON dari isi text jika ada
function extractJSON(text: string): any | null {
  if (!text) return null;
  
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) return null;

  const jsonString = text.slice(start, end + 1);

  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}