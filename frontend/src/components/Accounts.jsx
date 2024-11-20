import { useEffect, useState } from "react";
import { getAccounts } from "../service/api";
import useCoinData from "../hooks/useCoinData";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [loading, setLoading] = useState(true);
  const { coinData, error: coinError } = useCoinData();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getAccounts();
        setAccounts(data);

        let total = 0;

        const krwBalance = parseFloat(
          data.find((account) => account.currency === "KRW")?.balance || 0
        );
        total += krwBalance;

        for (const account of data) {
          if (account.currency === "KRW") continue;

          const currentPrice = coinData.find(
            (coin) => coin.koreanName === account.currency
          )?.currentPrice;

          if (currentPrice) {
            const evaluation =
              parseFloat(account.balance) *
              parseFloat(currentPrice.replace(/,/g, ""));
            total += evaluation;
          }
        }

        setTotalAssets(total);
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [coinData]);

  if (loading) return <p>Loading...</p>;
  if (coinError)
    return <p>현재가 정보를 가져오는 데 실패했습니다: {coinError}</p>;

  return (
    <div>
      <h2>내 자산</h2>
      <p>총 자산: {totalAssets.toLocaleString()} KRW</p>
      <ul>
        {accounts.map((account, index) => (
          <li key={index}>
            {account.currency}: {account.balance} (
            {account.unit_currency === "KRW"
              ? "원화"
              : `${account.unit_currency} 코인`}
            )
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Accounts;
