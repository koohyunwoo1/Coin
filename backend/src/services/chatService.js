const axios = require("axios");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

const sendMessageToChatGPT = async (messages) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: messages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to communicate with ChatGPT API");
  }
};

module.exports = { sendMessageToChatGPT };
