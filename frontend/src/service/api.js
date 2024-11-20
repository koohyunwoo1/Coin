import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 내 자산 조회
export const getAccounts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/accounts`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};

// 매수 주문 (시장가/지정가 처리)
export const placeBuyOrder = async (coinName, volume, price = null) => {
  try {
    const body = {
      coinName,
      volume,
      ...(price ? { price, ord_type: "limit" } : { ord_type: "market" }),
    };
    const response = await axios.post(`${API_BASE_URL}/buy`, body);
    return response.data.data;
  } catch (error) {
    console.error("Error placing buy order:", error);
    throw error;
  }
};

// 매도 주문 (시장가/지정가 처리)
export const placeSellOrder = async (coinName, volume, price = null) => {
  try {
    const body = {
      coinName,
      volume,
      ...(price ? { price, ord_type: "limit" } : { ord_type: "market" }),
    };
    const response = await axios.post(`${API_BASE_URL}/sell`, body);
    return response.data.data;
  } catch (error) {
    console.error("Error placing sell order:", error);
    throw error;
  }
};
