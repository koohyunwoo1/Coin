import useCoinData from "../hooks/useCoinData";

const SurgeAndDip = () => {
  const { coinData, error } = useCoinData();

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          backgroundColor: "#ffebee",
          borderRadius: "4px",
          border: "1px solid #e57373",
          fontSize: "14px",
          fontWeight: "bold",
          color: "#c62828",
        }}
      >
        ⚠️ 데이터를 가져오는 데 실패했습니다: {error}
      </div>
    );
  }

  const risingCoins = [...coinData]
    .sort((a, b) => b.changeRate - a.changeRate)
    .slice(0, 2);

  const fallingCoins = [...coinData]
    .sort((a, b) => a.changeRate - b.changeRate)
    .slice(0, 2);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "#e0f7fa",
        borderRadius: "4px",
        border: "1px solid #80deea",
        fontSize: "14px",
        fontWeight: "bold",
        color: "#00796b",
      }}
    >
      <span
        style={{
          display: "inline-block",
          marginRight: "4px",
          marginBottom: "4px",
          fontSize: "16px",
          color: "#004d40",
        }}
      >
        📈
      </span>
      급등 코인:{" "}
      {risingCoins
        .map((coin) => `${coin.koreanName} +${coin.changeRate}%`)
        .join(", ")}{" "}
      | 급락 코인:{" "}
      {fallingCoins
        .map((coin) => `${coin.koreanName} ${coin.changeRate}%`)
        .join(", ")}
    </div>
  );
};

export default SurgeAndDip;
