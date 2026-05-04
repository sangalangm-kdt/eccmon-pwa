import React, { createContext, useState, useContext } from "react";

const HistoryContext = createContext();

export const useHistory = () => useContext(HistoryContext);

export const HistoryProvider = ({ children }) => {
  const [historyData, setHistoryData] = useState([]);

  // Function to update history
  const updateHistory = (newData) => {
    setHistoryData((prevHistory) => [...prevHistory, newData]);
  };

  return (
    <HistoryContext.Provider value={{ historyData, updateHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};
