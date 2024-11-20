const Warning = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "#fff8e1",
        borderRadius: "4px",
        border: "1px solid #ffcc80",
        fontSize: "14px",
        fontWeight: "bold",
        color: "red",
      }}
    >
      <span
        style={{
          display: "inline-block",
          marginRight: "4px",
          marginBottom: "4px",
          fontSize: "16px",
          color: "#ff9800",
        }}
      >
        ⚠️
      </span>
      투자에는 원금 손실의 가능성이 있으며, 신중한 투자 결정을 부탁드립니다.
    </div>
  );
};

export default Warning;
