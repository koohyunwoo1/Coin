import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Table from "./components/Table";
import useCoinData from "./hooks/useCoinData";

import "./App.css";

const App = () => {
  const { coinData, error } = useCoinData();

  return (
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
    </div>
  );
};

export default App;
