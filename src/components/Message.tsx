import { useState } from 'react';
import { ChatMessage } from '../types';

interface MessageProps {
  message: ChatMessage;
  isLast: boolean;
}

export default function Message({ message, isLast }: MessageProps) {
  const [showSources, setShowSources] = useState(false);

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3xl rounded-lg px-4 py-2 ${message.role === 'user'
          ? 'bg-blue-600 text-white rounded-br-none'
          : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
          <div className="mt-2 text-xs">
            <button
              onClick={() => setShowSources(!showSources)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {showSources ? 'Sembunyikan referensi' : 'Tampilkan referensi'}
            </button>
            
            {showSources && (
              <div className="mt-1 p-2 bg-gray-100 rounded">
                <p className="font-semibold">Sumber pengetahuan:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {message.sources.map((source, i) => (
                    <li key={i}>
                      {source.title && <span className="font-medium">{source.title}: </span>}
                      {source.text || source.url}
                      {source.page && <span className="text-gray-500 ml-1">(hal. {source.page})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}