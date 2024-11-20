import Accounts from "../components/Accounts";
import TradeForm from "../components/TradeForm";
import Warning from "../components/Warning";
import "../style/Dashboard.css";

const Dashboard = () => (
  <div>
    <div className="warningSection">
      <Warning />
    </div>
    <div className="dashboardContainer">
      <div className="accountsSection">
        <Accounts />
      </div>
      <div className="tradeFormSection">
        <TradeForm />
      </div>
    </div>
  </div>
);

export default Dashboard;
