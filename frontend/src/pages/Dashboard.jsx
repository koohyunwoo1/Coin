import Accounts from "../components/Accounts";
import TradeForm from "../components/TradeForm";
import "../style/Dashboard.css";

const Dashboard = () => (
  <div className="dashboardContainer">
    <div className="accountsSection">
      <Accounts />
    </div>
    <div className="tradeFormSection">
      <TradeForm />
    </div>
  </div>
);

export default Dashboard;
