import React from 'react';
import ChatContainer from '../components/ChatContainer';

const ChatPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <ChatContainer />
    </div>
  );
};

export default ChatPage;