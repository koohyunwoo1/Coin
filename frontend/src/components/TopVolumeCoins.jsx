import useCoinData from "../hooks/useCoinData";

const TopVolumeCoins = () => {
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

  const topVolumeCoins = [...coinData]
    .sort(
      (a, b) =>
        Number(b.tradeVolume.replace(/[^0-9]/g, "")) -
        Number(a.tradeVolume.replace(/[^0-9]/g, ""))
    )
    .slice(0, 3);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "#e8f5e9",
        borderRadius: "4px",
        border: "1px solid #81c784",
        fontSize: "14px",
        fontWeight: "bold",
        color: "#2e7d32",
      }}
    >
      <span
        style={{
          display: "inline-block",
          marginRight: "4px",
          marginBottom: "4px",
          fontSize: "16px",
          color: "#1b5e20",
        }}
      >
        🔥
      </span>
      거래량 상위 코인:{" "}
      {topVolumeCoins
        .map(
          (coin) =>
            `${coin.koreanName} (${Number(
              coin.tradeVolume.replace(/[^0-9]/g, "")
            ).toLocaleString()}백만)`
        )
        .join(", ")}
    </div>
  );
};

export default TopVolumeCoins;
