import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { placeBuyOrder, placeSellOrder } from "../service/api";
import coinMapping from "../constants/coinMapping";
import "../style/TradeForm.css";
import useAccounts from "../hooks/useAccounts";

const TradeForm = () => {
  const [coinNameInput, setCoinNameInput] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("buy");
  const [isKrwInput, setIsKrwInput] = useState(true);
  const { accounts } = useAccounts();

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

  const handlePercentageClick = (percentage) => {
    if (type === "buy") {
      const krwAccount = accounts.find((account) => account.currency === "KRW");
      if (!krwAccount) {
        const errorMessage = "원화 계좌 정보를 찾을 수 없습니다.";
        speak(errorMessage);
        notify(errorMessage, "error");
        return;
      }

      const krwBalance = parseFloat(krwAccount.balance || "0");
      const calculatedAmount = ((krwBalance * percentage) / 100).toFixed(2);
      setAmount(calculatedAmount);
    } else {
      const selectedAccount = accounts.find(
        (account) => account.currencyKorean === coinNameInput
      );

      if (!selectedAccount) {
        const errorMessage =
          "입력한 코인 이름에 해당하는 계좌를 찾을 수 없습니다.";
        speak(errorMessage);
        notify(errorMessage, "error");
        return;
      }

      const evaluationValue = parseFloat(selectedAccount.evaluation || "0");
      const calculatedAmount = ((evaluationValue * percentage) / 100).toFixed(
        2
      );
      setAmount(calculatedAmount);
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
      <ToastContainer />
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
            placeholder="예: 이더리움"
            required
          />
        </div>
        <div className="formGroup">
          <label>{type === "buy" ? "매수 비율:" : "매도 비율:"}</label>
          <div>
            {[10, 25, 50, 75, 100].map((percent) => (
              <button
                key={percent}
                type="button"
                onClick={() => handlePercentageClick(percent)}
                className="ratioButton"
              >
                {percent}%
              </button>
            ))}
          </div>
        </div>
        <div className="formGroup">
          <label>{isKrwInput ? "금액 (KRW):" : "개수:"}</label>
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
