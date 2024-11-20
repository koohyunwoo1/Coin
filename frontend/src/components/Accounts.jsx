import { useEffect, useState } from "react";
import { getAccounts } from "../service/api";
import useCoinData from "../hooks/useCoinData";
import coinMapping from "../constants/coinMapping";
import "../style/Account.css";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [loading, setLoading] = useState(true);
  const { coinData, error: coinError } = useCoinData();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getAccounts();
        let total = 0;

        const updatedAccounts = data
          .map((account) => {
            let evaluation = 0;

            if (account.currency === "KRW") {
              evaluation = parseFloat(account.balance); // 원화 잔액 그대로 사용
            } else {
              const koreanName = coinMapping[account.currency];
              const coinInfo = coinData.find(
                (coin) => coin.koreanName === koreanName
              );

              if (coinInfo) {
                const currentPrice = parseFloat(
                  coinInfo.currentPrice.replace(/,/g, "")
                );
                evaluation = parseFloat(account.balance) * currentPrice;
              }
            }

            total += evaluation;
            return {
              ...account,
              evaluation: evaluation.toFixed(2),
            };
          })
          .sort((a, b) => parseFloat(b.evaluation) - parseFloat(a.evaluation));

        setAccounts(updatedAccounts);
        setTotalAssets(total);
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [coinData]);

  if (loading) return <p className="loadingText">Loading...</p>;
  if (coinError)
    return (
      <p className="loadingText">
        현재가 정보를 가져오는 데 실패했습니다: {coinError}
      </p>
    );

  return (
    <div className="accountsContainer">
      <h2>내 자산</h2>
      <p className="totalAssets">총 자산: {totalAssets.toLocaleString()} KRW</p>
      <ul className="accountList">
        {accounts.map((account, index) => (
          <li className="accountListItem" key={index}>
            <span className="accountText">{account.currency}</span>
            <span className="accountText">개수: {account.balance} 개</span>
            <span className="accountText">
              평가 금액: {parseFloat(account.evaluation).toLocaleString()} KRW
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Accounts;
