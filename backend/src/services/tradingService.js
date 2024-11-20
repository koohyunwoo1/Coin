const { getRequest, postRequest } = require("./apiService");

// 자산 조회
const getAccountInfo = async () => {
  return await getRequest("/accounts");
};

// 매수 (시장가/지정가 처리)
const placeBuyOrder = async (coinName, volume, price = null) => {
  const body = {
    market: coinName,
    side: "bid",
    volume,
    ...(price ? { price, ord_type: "limit" } : { ord_type: "market" }),
  };
  return await postRequest("/orders", body);
};

// 매도 (시장가/지정가 처리)
const placeSellOrder = async (coinName, volume, price = null) => {
  const body = {
    market: coinName,
    side: "ask",
    volume,
    ...(price ? { price, ord_type: "limit" } : { ord_type: "market" }),
  };
  return await postRequest("/orders", body);
};

module.exports = { getAccountInfo, placeBuyOrder, placeSellOrder };
