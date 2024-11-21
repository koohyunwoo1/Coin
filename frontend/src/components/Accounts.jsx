import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import useAccounts from "../hooks/useAccounts";
import "../style/Account.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const Accounts = () => {
  const { accounts, totalAssets, loading, coinError } = useAccounts();

  const krwAccount = accounts.find((account) => account.currency === "KRW");
  const orderableAmount = krwAccount
    ? parseFloat(krwAccount.balance).toFixed(0)
    : "0";

  const getCoinIconUrl = (symbol) =>
    `https://static.upbit.com/logos/${symbol}.png`;

  if (loading) return <p className="loadingText">Loading...</p>;

  if (coinError)
    return (
      <p className="loadingText">
        현재가 정보를 가져오는 데 실패했습니다: {coinError}
      </p>
    );

  // 코인 비중 데이터 생성
  const filteredAccounts = accounts.filter(
    (account) => account.currency !== "KRW"
  );
  const coinLabels = filteredAccounts.map(
    (account) => `${account.currencyKorean} (${account.currency})`
  );
  const coinData = filteredAccounts.map((account) =>
    parseFloat(account.evaluation)
  );

  const pieData = {
    labels: coinLabels,
    datasets: [
      {
        data: coinData,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div className="accountsContainer">
      <h1>보유 자산</h1>
      <div
        className={`totalAssetsContainer ${
          parseFloat(totalAssets.profitRate) > 0
            ? "positive"
            : parseFloat(totalAssets.profitRate) < 0
            ? "negative"
            : "neutral"
        }`}
      >
        <div>
          <p>
            총 투자 금액: {parseFloat(totalAssets.investment).toLocaleString()}{" "}
            <small style={{ fontSize: "12px", color: "gray" }}>KRW</small>
          </p>
          <p>
            총 평가 금액: {parseFloat(totalAssets.evaluation).toLocaleString()}{" "}
            <small style={{ fontSize: "12px", color: "gray" }}>KRW</small>
          </p>
          <p>
            총 평가 손익:{" "}
            <span
              style={{
                fontWeight: "bold",
                color:
                  parseFloat(totalAssets.evaluation) -
                    parseFloat(totalAssets.investment) >
                  0
                    ? "red"
                    : parseFloat(totalAssets.evaluation) -
                        parseFloat(totalAssets.investment) <
                      0
                    ? "blue"
                    : "black",
              }}
            >
              {(
                parseFloat(totalAssets.evaluation) -
                parseFloat(totalAssets.investment)
              ).toLocaleString()}{" "}
              <small style={{ fontSize: "12px", color: "gray" }}>KRW</small>
            </span>
          </p>
          <p>
            총 수익률:{" "}
            <span
              style={{
                fontWeight: "bold",
                color:
                  parseFloat(totalAssets.profitRate) > 0
                    ? "red"
                    : parseFloat(totalAssets.profitRate) < 0
                    ? "blue"
                    : "black",
              }}
            >
              {parseFloat(totalAssets.profitRate).toFixed(2)}%
            </span>
          </p>
          <p>
            주문 가능 금액:{" "}
            <span style={{ fontWeight: "bold" }}>
              {orderableAmount}{" "}
              <small style={{ fontSize: "12px", color: "gray" }}>KRW</small>
            </span>
          </p>
          <div className="chartContainer">
            <Pie data={pieData} />
          </div>
        </div>
      </div>
      <h1>보유 자산 목록</h1>
      <ul className="accountList">
        {accounts
          .filter((account) => account.currency !== "KRW")
          .map((account, index) => (
            <li className="accountListItem" key={index}>
              <div className="coinItem">
                <div
                  className="coinIcon"
                  style={{
                    background: `url(${getCoinIconUrl(
                      account.currency
                    )}) 0px 0px / cover no-repeat`,
                  }}
                ></div>
                <div>
                  <span className="accountTitle">{account.currencyKorean}</span>
                  <span className="accountSymbol">({account.currency})</span>
                </div>
              </div>
              <span className="accountText investment">
                투자 금액: {parseFloat(account.investment).toLocaleString()}
                <small
                  style={{ marginLeft: "5px", fontSize: "12px", color: "gray" }}
                >
                  KRW
                </small>
              </span>
              <span className="accountText">
                평가 금액: {parseFloat(account.evaluation).toLocaleString()}
                <small
                  style={{ marginLeft: "5px", fontSize: "12px", color: "gray" }}
                >
                  KRW
                </small>
              </span>
              <span className="accountText">
                매수평균가:{" "}
                {account.avg_buy_price
                  ? parseFloat(account.avg_buy_price).toLocaleString()
                  : "N/A"}
                <small
                  style={{ marginLeft: "5px", fontSize: "12px", color: "gray" }}
                >
                  KRW
                </small>
              </span>
              <span className="accountText">
                보유 개수: {parseFloat(account.balance).toFixed(2)}{" "}
                {account.currency}
              </span>
              <span
                className={`profitRate ${
                  parseFloat(account.profitRate) > 0
                    ? "positive"
                    : parseFloat(account.profitRate) < 0
                    ? "negative"
                    : "neutral"
                }`}
              >
                수익률: {parseFloat(account.profitRate).toFixed(2)}%
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Accounts;
