const { sendMessageToChatGPT } = require("../services/chatService");

const handleChatRequest = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const chatResponse = await sendMessageToChatGPT([
      { role: "user", content: message },
    ]);
    res.status(200).json({ response: chatResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { handleChatRequest };
