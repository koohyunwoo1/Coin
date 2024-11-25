const { handleChatMessage } = require("../services/chatService");

const chatHandler = async (req, res) => {
  const { message } = req.body;

  try {
    const responseMessage = await handleChatMessage(message);
    res.status(200).json({ success: true, message: responseMessage });
  } catch (error) {
    console.error("Error in chatHandler:", error.message);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
};

module.exports = { chatHandler };
