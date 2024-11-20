const express = require("express");
const router = express.Router();
const {
  getAccounts,
  buyCoin,
  sellCoin,
} = require("../controllers/tradingController");

router.get("/accounts", getAccounts);
router.post("/buy", buyCoin);
router.post("/sell", sellCoin);

module.exports = router;
