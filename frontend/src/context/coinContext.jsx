import { createContext, useContext, useState } from "react";

const CoinContext = createContext();

export const useCoinContext = () => useContext(CoinContext);

export const CoinProvider = ({ children }) => {
  const [selectedCoin, setSelectedCoin] = useState("");
  return (
    <CoinContext.Provider value={{ selectedCoin, setSelectedCoin }}>
      {children}
    </CoinContext.Provider>
  );
};
