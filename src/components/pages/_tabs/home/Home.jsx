import React, { useEffect } from "react";
import InventorySummary from "./InventorySummary";
import HistorySummary from "./HistorySummary";
import Onboarding from "../Onboarding";
import { useAuthentication } from "../../../../hooks/auth";

const Home = () => {
  // Use the authentication hook to get user data
  const { user, errorMessage } = useAuthentication();

  useEffect(() => {
    if (errorMessage) {
      console.error("Authentication Error:", errorMessage);
    }
  }, [errorMessage]);
  
  // Safely extract employee ID or fallback to a default value
  const employeeFirstname = user?.first_name || "Unknown User";
  const userId = user?.user_id || "Unknown Id"
  console.log("Employee ID:", employeeFirstname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Onboarding />
      <div className="w-full ">
        <h1>Welcome, {employeeFirstname}</h1>
      </div>
      <div className="w-full h-full">
    
          <InventorySummary userId={userId} />
       
        <div
          id="history-summary"
          className="flex w-full xs:w-full lg:w-full xs:px-1 bg-white rounded-lg"
        >
          <HistorySummary />
        </div>
      </div>
    </div>
  );
};

export default Home;
