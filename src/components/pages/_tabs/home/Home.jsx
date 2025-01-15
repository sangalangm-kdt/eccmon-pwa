import React, { useEffect } from "react";
import InventorySummary from "./InventorySummary";
import HistorySummary from "./HistorySummary";
import Onboarding from "../Onboarding";
import { useAuthentication } from "../../../../hooks/auth";

const Home = () => {
  // Use the authentication hook to get user data
  const { userId, user, errorMessage } = useAuthentication();

  useEffect(() => {
    if (errorMessage) {
      console.error("Authentication Error:", errorMessage);
    }
  }, [errorMessage]);

  // Safely extract employee ID or fallback to a default value
  const employeeFirstname = user?.first_name || "Unknown User";
  console.log("Employee ID:", userId);

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Onboarding />
      <div className="w-full p-2">
        <h1>Welcome, {employeeFirstname}</h1>
      </div>
      <div className="h-full w-full">
        <InventorySummary userId={userId} />

        <div id="history-summary" className="w-full p-2">
          <HistorySummary />
        </div>
      </div>
    </div>
  );
};

export default Home;
