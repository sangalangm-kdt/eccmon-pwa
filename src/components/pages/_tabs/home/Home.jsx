import React from "react";

import InventorySummary from "./InventorySummary";
import HistorySummary from "./HistorySummary";

const Home = () => {
  return (
    <div className="flex flex-col h-screen xs:justify-center xs:items-center bg-gray-100">
      <div className="flex items-center justify-center w-full">
        <InventorySummary />
      </div>

      <div className="flex w-full h-full xs:w-96 xs:h-96 lg:w-full  bg-white rounded-lg">
        <HistorySummary />
      </div>
    </div>
  );
};

export default Home;
