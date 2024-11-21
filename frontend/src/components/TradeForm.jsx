import { useState } from "react";
import { placeBuyOrder, placeSellOrder } from "../service/api";
import coinMapping from "../constants/coinMapping";
import "../style/TradeForm.css";

const TradeForm = () => {
  const [coinNameInput, setCoinNameInput] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("buy");
  const [isKrwInput, setIsKrwInput] = useState(true);

  const fetchCurrentPrice = async (marketName) => {
    try {
      const response = await fetch(
        `https://api.upbit.com/v1/ticker?markets=${marketName}`
      );
      const data = await response.json();
      return data[0].trade_price;
    } catch (error) {
      console.error(error);
      throw new Error("현재가를 가져오는 데 실패했습니다.");
    }
  };

  const speak = (message) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "ko-KR";
    utterance.rate = 2;
    synth.speak(utterance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coinNameInput || !amount) {
      speak("모든 값을 입력해주세요.");
      return;
    }

    // 한글 이름 -> 시장 이름 변환
    const marketName = Object.keys(coinMapping).find(
      (key) => coinMapping[key] === coinNameInput
    );

    if (!marketName) {
      speak("유효한 코인 이름을 입력해주세요.");
      return;
    }

    try {
      const currentPrice = await fetchCurrentPrice(`KRW-${marketName}`);
      let volume;

      if (isKrwInput) {
        volume = parseFloat(amount) / currentPrice;
      } else {
        volume = parseFloat(amount);
      }

      if (type === "buy") {
        if (price) {
          await placeBuyOrder(`KRW-${marketName}`, volume, parseFloat(price));
          speak("지정가 매수 주문이 등록되었습니다.");
        } else {
          await placeBuyOrder(`KRW-${marketName}`, volume);
          speak("시장가 매수 주문이 등록되었습니다.");
        }
      } else {
        if (price) {
          await placeSellOrder(`KRW-${marketName}`, volume, parseFloat(price));
          speak("지정가 매도 주문이 등록되었습니다.");
        } else {
          await placeSellOrder(`KRW-${marketName}`, volume);
          speak("시장가 매도 주문이 등록되었습니다.");
        }
      }

      setCoinNameInput("");
      setAmount("");
      setPrice("");
    } catch (error) {
      speak("주문 실패");
      console.error(error);
    }
  };

  return (
    <form className="tradeFormContainer" onSubmit={handleSubmit}>
      <h1>{type === "buy" ? "매수" : "매도"}</h1>
      <div className="formGroup">
        <label>타입:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="buy">매수</option>
          <option value="sell">매도</option>
        </select>
      </div>
      <div className="formGroup">
        <label>코인 이름:</label>
        <input
          type="text"
          value={coinNameInput}
          onChange={(e) => setCoinNameInput(e.target.value)}
          placeholder="예: 비트코인"
          required
        />
      </div>
      <div className="formGroup">
        <label>
          {isKrwInput ? (
            <>
              금액 (KRW):{" "}
              <span style={{ fontSize: "0.8rem", color: "#666" }}>
                금액은 5천원 이상 매수해주세요.
              </span>
            </>
          ) : (
            "개수"
          )}
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={
            isKrwInput ? "매수/매도할 금액 (KRW)" : "매수/매도할 코인 개수"
          }
          required
        />
      </div>
      <div className="formGroup">
        <label>가격 ({type === "buy" ? "지정가 매수" : "지정가 매도"}):</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder={
            type === "buy" ? "지정가 매수 희망 가격" : "지정가 매도 희망 가격"
          }
        />
      </div>
      <div className="formGroup">
        <label>입력 방식:</label>
        <select
          value={isKrwInput ? "krw" : "coin"}
          onChange={(e) => setIsKrwInput(e.target.value === "krw")}
        >
          <option value="krw">금액 (KRW)</option>
          <option value="coin">개수</option>
        </select>
      </div>
      <button className="submitButton" type="submit">
        주문하기
      </button>
    </form>
  );
};

export default TradeForm;
