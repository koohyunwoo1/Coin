import { useState, useEffect } from "react";
import { getAccounts } from "../service/api";
import useCoinData from "../hooks/useCoinData";
import coinMapping from "../constants/coinMapping";

const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [totalAssets, setTotalAssets] = useState({
    evaluation: 0,
    investment: 0,
    profitRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const { coinData, error: coinError } = useCoinData();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getAccounts();
        let totalEvaluation = 0;
        let totalInvestment = 0;

        const updatedAccounts = data
          .map((account) => {
            let evaluation = 0;
            let investment = 0;
            let profitRate = 0;

            if (account.currency === "KRW") {
              evaluation = parseFloat(account.balance);
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

                investment =
                  parseFloat(account.avg_buy_price || 0) *
                  parseFloat(account.balance || 0);

                if (investment > 0) {
                  profitRate = ((evaluation - investment) / investment) * 100;
                }
              }
            }

            totalEvaluation += evaluation;
            totalInvestment += investment;

            return {
              ...account,
              evaluation: evaluation.toFixed(2),
              investment: investment.toFixed(2),
              profitRate: profitRate.toFixed(2),
              currencyKorean: coinMapping[account.currency] || account.currency,
            };
          })
          .sort((a, b) => parseFloat(b.evaluation) - parseFloat(a.evaluation));

        const totalProfitRate =
          totalInvestment > 0
            ? ((totalEvaluation - totalInvestment) / totalInvestment) * 100
            : 0;

        setAccounts(updatedAccounts);
        setTotalAssets({
          evaluation: totalEvaluation.toFixed(0),
          investment: totalInvestment.toFixed(2),
          profitRate: totalProfitRate.toFixed(0),
        });
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [coinData]);

  return { accounts, totalAssets, loading, coinError };
};

export default useAccounts;
