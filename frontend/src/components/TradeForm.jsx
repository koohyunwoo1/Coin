import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/TradeForm.css";
import useTradeForm from "../hooks/useTradeForm";

const TradeForm = () => {
  const {
    coinNameInput,
    setCoinNameInput,
    amount,
    setAmount,
    price,
    setPrice,
    type,
    setType,
    isKrwInput,
    setIsKrwInput,
    handlePercentageClick,
    handleSubmit,
  } = useTradeForm();

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
            placeholder="예: 비트코인"
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
