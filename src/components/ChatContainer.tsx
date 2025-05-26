// import React, { useEffect, useRef } from "react";
// import { useChat } from "../hooks/useChat";
// import InputArea from "./InputArea";
// import LoadingIndicator from "./LoadingIndicator";
// import Navbar from "./Navbar";

// type ChatMessage = {
//   sender: "You" | "Agent";
//   text: string;
//   timestamp?: Date;
// };

// function Message({ message }: { message: ChatMessage }) {
//   const isUser = message.sender === "You";
//   return (
//     <div
//       className={`max-w-[80%] p-3 rounded-lg mb-2 ${
//         isUser 
//           ? "bg-indigo-600 text-white ml-auto" 
//           : "bg-gray-200 text-black mr-auto"
//       }`}
//     >
//       {message.text}
//     </div>
//   );
// }

// export default function ChatContainer() {
//   const {
//     messages,
//     loading,
//     error,
//     sendMessage,
//     clearConversation,
//     uploadDocument,
//   } = useChat();

//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
//       {/* Navbar - modified for chat interface */}
//       <Navbar 
//         transparentOnTop={true}
//         // disableScrollEffect={true}  
//       />
      
//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col pt-16 h-[calc(100vh-4rem)]">
//         {/* Messages container with scroll */}
//         <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-indigo-700 to-indigo-900">
//           <div className="max-w-4xl mx-auto h-full flex flex-col">
//             {messages.length === 0 && !loading && (
//               <div className="h-full flex flex-col items-center justify-center text-center p-6">
//                 <h2 className="text-4xl font-bold text-white mb-4">Hi, User!</h2>
//                 <p className="text-white/80 text-lg mb-8 max-w-md">
//                   Start a conversation by typing your message below or upload a document to get started.
//                 </p>
//               </div>
//             )}

//             <div className="flex flex-col gap-3 w-full">
//               {messages.map((msg, idx) => (
//                 <Message key={${idx}-${msg.timestamp?.getTime()}} message={msg} />
//               ))}
//             </div>

//             {loading && (
//               <div className="flex justify-center py-4">
//                 <LoadingIndicator />
//               </div>
//             )}

//             {error && (
//               <div className="max-w-xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg my-4">
//                 <div className="flex items-center gap-2">
//                   <span>⚠</span>
//                   <p>{error}</p>
//                 </div>
//               </div>
//             )}

//             <div ref={messagesEndRef} />
//           </div>
//         </div>

//         {/* Input area stays fixed at bottom */}
//         <div style={{ 
//           position: 'sticky', 
//           bottom: 0, 
//           width: '100%', 
//           padding: '16px 16px 12px',
//         }}>
//           <InputArea 
//             onSend={sendMessage}
//             onClear={clearConversation}
//             onUpload={uploadDocument}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }


// src/components/ChatContainer.tsx
import React, { useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import InputArea from "./InputArea";
import LoadingIndicator from "./LoadingIndicator";
import Navbar from "./Navbar";

type ChatMessage = {
  sender: "You" | "Agent";
  text: string;
  timestamp?: Date;
};

function Message({ message }: { message: ChatMessage }) {
  const isUser = message.sender === "You";
  return (
    <div
      className={`max-w-[80%] p-3 rounded-lg mb-2 ${
        isUser 
          ? "bg-indigo-600 text-white ml-auto" 
          : "bg-gray-200 text-black mr-auto"
      }`}
    >
      {message.text}
    </div>
  );
}

export default function ChatContainer() {
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen w-full bg-indigo-700 overflow-hidden">
      <Navbar transparentOnTop={true} />
      
      <div className="flex-1 flex flex-col pt-16 h-[calc(100vh-4rem)]">
        {/* Messages container with scroll */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-indigo-700 to-indigo-900">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {messages.length === 0 && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <h2 className="text-4xl font-bold text-white mb-4">Hi, User!</h2>
                <p className="text-white/80 text-lg mb-8 max-w-md">
                  Start a conversation by typing your message below or upload a document to get started.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 w-full">
              {messages.map((msg, idx) => (
                <Message key={`${idx}-${msg.timestamp?.getTime()}`} message={msg} />
              ))}
            </div>

            {loading && (
              <div className="flex justify-center py-4">
                <LoadingIndicator />
              </div>
            )}

            {error && (
              <div className="max-w-xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg my-4">
                <div className="flex items-center gap-2">
                  <span>⚠</span>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area stays fixed at bottom */}
        <div className="sticky bottom-0 w-full px-4 py-3 bg-white border-t border-gray-200">
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