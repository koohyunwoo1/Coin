import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Table from "./components/Table";
import useCoinData from "./hooks/useCoinData";
import { CoinProvider } from "./context/coinContext";
import ChatFloatingButton from "./components/ChatFloatingButton";

import "./App.css";

const App = () => {
  const { coinData, error } = useCoinData();

  return (
    <CoinProvider>
      <div>
        <Header />
        <div className="container">
          <div className="dashboard">
            <Dashboard />
          </div>
          <div className="table">
            <Table coinData={coinData} error={error} />
          </div>
        </div>
        <ChatFloatingButton />
      </div>
    </CoinProvider>
  );
};

export default App;
