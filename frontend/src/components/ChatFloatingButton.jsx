import { useState } from "react";
import ChatGPT from "./chat";
import "../style/ChatFloatingButton.css";

const ChatFloatingButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [position, setPosition] = useState({
    x: window.innerWidth - 80,
    y: window.innerHeight - 80,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;

      const boundedX = Math.max(0, Math.min(window.innerWidth - 60, newX));
      const boundedY = Math.max(0, Math.min(window.innerHeight - 60, newY));

      setPosition({ x: boundedX, y: boundedY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="chatFloatingContainer"
      style={{ top: position.y, left: position.x }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {isChatOpen && (
        <div
          className="chatBubble"
          style={{
            top: position.y - 560,
            left: position.x - 350,
          }}
        >
          <ChatGPT />
        </div>
      )}
      <button
        className="chatFloatingButton"
        onClick={toggleChat}
        onMouseDown={handleMouseDown}
      >
        💬
      </button>
    </div>
  );
};

export default ChatFloatingButton;
