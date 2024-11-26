import useChat from "../hooks/useChat";
import "../style/Chat.css";

const ChatGPT = () => {
  const {
    message,
    setMessage,
    chatHistory,
    loading,
    loadingDots,
    chatBoxRef,
    sendMessage,
    handleKeyDown,
  } = useChat();

  return (
    <div className="chatContainer">
      <h1 className="chatHeader">Coin Chat</h1>

      <div className="chatBox" ref={chatBoxRef}>
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={msg.user === "You" ? "userMessage" : "botMessage"}
          >
            {msg.user === "You" ? (
              <>
                <strong>{msg.user}:</strong> {msg.content}
              </>
            ) : (
              <>
                <img src={msg.user} alt="Chatbot" className="chatBotImage" />
                <span>{msg.content}</span>
              </>
            )}
          </div>
        ))}
        {loading && (
          <div className="botMessage">
            <img src="../assets/chatbot.png" className="chatBotImage" />
            <strong>ChatGPT:</strong> {loadingDots}
          </div>
        )}
      </div>

      <div className="chatInputContainer">
        <input
          type="text"
          placeholder="메세지를 입력해주세요..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="chatInputField"
        />
        <button onClick={sendMessage} className="chatSendButton">
          보내기
        </button>
      </div>
    </div>
  );
};

export default ChatGPT;
