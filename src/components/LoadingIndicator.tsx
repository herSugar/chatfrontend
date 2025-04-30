export default function LoadingIndicator() {
    return (
      <div className="flex justify-start">
        <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none px-4 py-2 shadow-sm">
          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }