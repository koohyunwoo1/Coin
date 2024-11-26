import { useState } from "react";
import ChatGPT from "./chat";
import "../style/ChatFloatingButton.css";

const ChatFloatingButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <div className="chatFloatingContainer">
      {isChatOpen && (
        <div className="chatBubble">
          <ChatGPT />
        </div>
      )}
      <button className="chatFloatingButton" onClick={toggleChat}>
        💬
      </button>
    </div>
  );
};

export default ChatFloatingButton;
