const axios = require("axios");
const {
  getAccountInfo,
  placeBuyOrder,
  placeSellOrder,
} = require("./tradingService");

// CryptoCompare API 키
const CRYPTOCOMPARE_API_KEY = process.env.CRYPTOCOMPARE_API_KEY;

// CryptoCompare API를 호출해 뉴스 가져오기
const fetchCryptoNews = async () => {
  try {
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/v2/news/",
      {
        params: { lang: "EN", apikey: CRYPTOCOMPARE_API_KEY },
      }
    );
    return response.data.Data.map((article) => ({
      title: article.title,
      body: article.body,
      url: article.url,
      source: article.source,
    }));
  } catch (error) {
    console.error("Error fetching news:", error.message);
    throw new Error("뉴스 데이터를 가져오는 중 오류가 발생했습니다.");
  }
};

// CryptoCompare API를 호출해 암호화폐 가격 가져오기
const fetchCryptoPrice = async (symbol) => {
  try {
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/price",
      {
        params: {
          fsym: symbol,
          tsyms: "USD,KRW",
          apikey: CRYPTOCOMPARE_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching price:", error.message);
    throw new Error("가격 데이터를 가져오는 중 오류가 발생했습니다.");
  }
};

// 메시지 분석 및 처리
const handleChatMessage = async (message) => {
  try {
    let responseMessage = "죄송합니다. 요청을 이해하지 못했습니다.";

    // 뉴스 요청 처리
    if (message.includes("뉴스")) {
      const news = await fetchCryptoNews();
      responseMessage = news
        .slice(0, 3) // 상위 3개의 뉴스만 반환
        .map(
          (article) =>
            `${article.title} - 출처: ${article.source}\n${article.url}`
        )
        .join("\n\n");
    }

    // 가격 요청 처리
    else if (message.includes("가격")) {
      const [_, symbol] = message.split(" "); // "가격 BTC" 형태로 입력받음
      const price = await fetchCryptoPrice(symbol);
      responseMessage = `${symbol} 현재 가격:\nUSD: $${price.USD}, KRW: ₩${price.KRW}`;
    }

    return responseMessage;
  } catch (error) {
    console.error("Error in handleChatMessage:", error.message);
    return "요청 처리 중 오류가 발생했습니다.";
  }
};

module.exports = { handleChatMessage };
