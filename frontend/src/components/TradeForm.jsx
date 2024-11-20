import { useState } from "react";
import { placeBuyOrder, placeSellOrder } from "../service/api";
import "../style/TradeForm.css";

const TradeForm = () => {
  const [coinName, setCoinName] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("buy");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coinName || !amount || (type === "buy" && price === "")) {
      alert("모든 값을 입력해주세요.");
      return;
    }

    try {
      if (type === "buy") {
        if (price) {
          await placeBuyOrder(coinName, parseFloat(amount), parseFloat(price));
          alert("지정가 매수 주문 성공!");
        } else {
          await placeBuyOrder(coinName, parseFloat(amount));
          alert("시장가 매수 주문 성공!");
        }
      } else {
        if (price) {
          await placeSellOrder(coinName, parseFloat(amount), parseFloat(price));
          alert("지정가 매도 주문 성공!");
        } else {
          await placeSellOrder(coinName, parseFloat(amount));
          alert("시장가 매도 주문 성공!");
        }
      }

      setCoinName("");
      setAmount("");
      setPrice("");
    } catch (error) {
      alert("주문 실패. 콘솔을 확인해주세요.");
      console.error(error);
    }
  };

  return (
    <form className="tradeFormContainer" onSubmit={handleSubmit}>
      <h2>{type === "buy" ? "매수" : "매도"}</h2>
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
        <label>개수:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="매수/매도 개수"
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
      <button className="submitButton" type="submit">
        주문하기
      </button>
    </form>
  );
};

export default TradeForm;
