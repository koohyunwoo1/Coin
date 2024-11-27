import { useState, useEffect, useRef } from "react";
import axios from "axios";

const useChat = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [loading, setLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState("...");
  const chatBoxRef = useRef(null);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingDots((prev) =>
          prev === "..." ? "." : prev === "." ? ".." : "..."
        );
      }, 500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      user: "You",
      content: message,
    };

    setChatHistory([...chatHistory, newMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/chat", {
        message,
      });

      const botResponse = response.data.response;
      renderTypingEffect(botResponse);
    } catch (error) {
      console.error(error);
      alert("ChatGPT와 통신하는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const renderTypingEffect = (responseText) => {
    let index = 0;
    const botMessage = {
      user: "src/assets/chatbot.png",
      content: "",
    };

    setChatHistory((prev) => [...prev, botMessage]);

    const interval = setInterval(() => {
      if (index < responseText.length) {
        botMessage.content += responseText[index];
        setChatHistory((prev) => {
          const updatedHistory = [...prev];
          updatedHistory[updatedHistory.length - 1] = { ...botMessage };
          return updatedHistory;
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return {
    message,
    setMessage,
    chatHistory,
    loading,
    loadingDots,
    chatBoxRef,
    sendMessage,
    handleKeyDown,
  };
};

export default useChat;
