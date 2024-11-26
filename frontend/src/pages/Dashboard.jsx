import { useState, useEffect } from "react";
import Warning from "../components/Warning";
import SurgeAndDip from "../components/SurgeAndDip";
import TopVolumeCoins from "../components/TopVolumeCoins";
import Accounts from "../components/Accounts";
import TradeForm from "../components/TradeForm";

import "../style/Dashboard.css";

const Dashboard = () => {
  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("slideDown");

  const components = [
    { id: "warning", element: <Warning /> },
    { id: "surgeAndDip", element: <SurgeAndDip /> },
    { id: "topVolumeCoins", element: <TopVolumeCoins /> },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationClass("slideUp");

      setTimeout(() => {
        setCurrentComponentIndex(
          (prevIndex) => (prevIndex + 1) % components.length
        );
        setAnimationClass("slideDown");
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [components.length]);

  return (
    <div>
      <div className="warningSection">
        <div
          className={animationClass}
          key={components[currentComponentIndex].id}
        >
          {components[currentComponentIndex].element}
        </div>
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
};

export default Dashboard;
