const {
  getAccountInfo,
  placeBuyOrder,
  placeSellOrder,
} = require("../services/tradingService");

// 자산 조회
const getAccounts = async (req, res) => {
  try {
    const accounts = await getAccountInfo();
    console.log(accounts);
    res.status(200).json({ success: true, data: accounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 매수 (시장가/지정가 매수)
const buyCoin = async (req, res) => {
  const { coinName, volume, price } = req.body;
  try {
    const result = await placeBuyOrder(coinName, volume, price);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error during buy operation:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 매도 (시장가/지정가 매도)
const sellCoin = async (req, res) => {
  const { coinName, volume, price } = req.body;
  try {
    const result = await placeSellOrder(coinName, volume, price);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error during sell operation:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAccounts, buyCoin, sellCoin };
