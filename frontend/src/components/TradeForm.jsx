import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  const notify = (message, type = "info") => {
    if (type === "success") {
      toast.success(message, { position: "top-right", autoClose: 3000 });
    } else if (type === "error") {
      toast.error(message, { position: "top-right", autoClose: 3000 });
    } else {
      toast.info(message, { position: "top-right", autoClose: 3000 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coinNameInput || !amount) {
      const errorMessage = "모든 값을 입력해주세요.";
      speak(errorMessage);
      notify(errorMessage, "error");
      return;
    }

    const marketName = Object.keys(coinMapping).find(
      (key) => coinMapping[key] === coinNameInput
    );

    if (!marketName) {
      const errorMessage = "유효한 코인 이름을 입력해주세요.";
      speak(errorMessage);
      notify(errorMessage, "error");
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
          const successMessage = `매수 주문: ${coinNameInput} (${price}원에 ${volume.toFixed(
            6
          )} 개 매수)`;
          speak(successMessage);
          notify(successMessage, "success");
        } else {
          await placeBuyOrder(`KRW-${marketName}`, volume);
          const successMessage = `매수 주문: ${coinNameInput} (${currentPrice.toFixed(
            2
          )}원에 ${volume.toFixed(6)} 개 매수)`;
          speak(successMessage);
          notify(successMessage, "success");
        }
      } else {
        if (price) {
          await placeSellOrder(`KRW-${marketName}`, volume, parseFloat(price));
          const successMessage = `매도 주문: ${coinNameInput} (${price}원에 ${volume.toFixed(
            6
          )} 개 매도)`;
          speak(successMessage);
          notify(successMessage, "success");
        } else {
          await placeSellOrder(`KRW-${marketName}`, volume);
          const successMessage = `매도 주문: ${coinNameInput} (${currentPrice.toFixed(
            2
          )}원에 ${volume.toFixed(6)} 개 매도)`;
          speak(successMessage);
          notify(successMessage, "success");
        }
      }

      setCoinNameInput("");
      setAmount("");
      setPrice("");
    } catch (error) {
      const errorMessage = "주문 실패";
      speak(errorMessage);
      notify(errorMessage, "error");
      console.error(error);
    }
  };

  return (
    <>
      <ToastContainer /> {/* 토스트 알림 컴포넌트 추가 */}
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
          <label>
            가격 ({type === "buy" ? "지정가 매수" : "지정가 매도"}):
          </label>
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
    </>
  );
};

export default TradeForm;
