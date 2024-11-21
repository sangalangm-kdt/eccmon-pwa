import React from "react";

import InventorySummary from "./InventorySummary";
import HistorySummary from "./HistorySummary";

const Home = () => {
  return (
    <div className="flex flex-col h-screen bg-primary">
      <div className="flex items-center justify-center w-full">
        <InventorySummary />
      </div>

      <div className="flex w-full h-full bg-white rounded-t-lg">
        <HistorySummary />
      </div>
    </div>
  );
};

export default Home;
