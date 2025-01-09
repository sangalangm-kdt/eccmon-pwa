import React from "react";

import InventorySummary from "./InventorySummary";
import HistorySummary from "./HistorySummary";
import Onboarding from "../Onboarding";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Onboarding />
      <div className="w-full p-4">
        <h1>Home</h1>
      </div>
      <div className="w-full p-2">
        <div className="flex items-center justify-center w-full">
          <InventorySummary Onboarding={Onboarding} />
        </div>
        <div
          id="history-summary"
          className="flex w-full  xs:w-full lg:w-full xs:px-1  bg-white rounded-lg"
        >
          <HistorySummary />
        </div>
      </div>
    </div>
  );
};

export default Home;
