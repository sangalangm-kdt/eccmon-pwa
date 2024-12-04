import React from "react";

import InventorySummary from "./InventorySummary";
import HistorySummary from "./HistorySummary";

const Home = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="w-full p-2">
        <div className="flex items-center justify-center w-full">
          <InventorySummary />
        </div>
        <div className="flex w-full  xs:w-full lg:w-full xs:px-1  bg-white rounded-lg">
          <HistorySummary />
        </div>
      </div>
    </div>
  );
};

export default Home;
