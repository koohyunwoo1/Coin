import { useState } from "react";
import { placeBuyOrder, placeSellOrder } from "../service/api";
import "../style/TradeForm.css";

const TradeForm = () => {
  const [coinName, setCoinName] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("buy");
  const [isKrwInput, setIsKrwInput] = useState(true);

  const fetchCurrentPrice = async (coinName) => {
    try {
      const response = await fetch(
        `https://api.upbit.com/v1/ticker?markets=${coinName}`
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
    utterance.rate = 2; // 음성 속도 설정
    synth.speak(utterance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coinName || !amount) {
      speak("모든 값을 입력해주세요.");
      return;
    }

    try {
      const currentPrice = await fetchCurrentPrice(coinName);
      let volume;

      if (isKrwInput) {
        // 금액(KRW)으로 입력한 경우 코인 개수 계산
        volume = parseFloat(amount) / currentPrice;
      } else {
        // 코인 개수로 입력한 경우 그대로 사용
        volume = parseFloat(amount);
      }

      if (type === "buy") {
        if (price) {
          // 지정가 매수
          await placeBuyOrder(coinName, volume, parseFloat(price));
          speak("지정가 매수 주문이 등록되었습니다.");
        } else {
          // 시장가 매수
          await placeBuyOrder(coinName, volume);
          speak("시장가 매수 주문이 등록되었습니다.");
        }
      } else {
        if (price) {
          // 지정가 매도
          await placeSellOrder(coinName, volume, parseFloat(price));
          speak("지정가 매도 주문이 등록되었습니다.");
        } else {
          // 시장가 매도
          await placeSellOrder(coinName, volume);
          speak("시장가 매도 주문이 등록되었습니다.");
        }
      }

      setCoinName("");
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
        <label>코인 이름:</label>
        <input
          type="text"
          value={coinName}
          onChange={(e) => setCoinName(e.target.value)}
          placeholder="예: KRW-BTC"
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
        <label>타입:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="buy">매수</option>
          <option value="sell">매도</option>
        </select>
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
