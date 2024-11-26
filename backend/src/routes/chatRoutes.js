const express = require("express");
const { handleChatRequest } = require("../controllers/chatController");

const router = express.Router();

router.post("/", handleChatRequest);

module.exports = router;
