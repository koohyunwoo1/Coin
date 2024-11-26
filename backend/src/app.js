const express = require("express");
const cors = require("cors");

const app = express();

// CORS 설정
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// 나머지 라우트 설정
app.use(express.json());
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/trading", require("./routes/tradingRoutes"));

module.exports = app;
