import React from "react";
import EngineInfo from "./mountAndDismountInfo/EngineInfo";
import AdditionalInfo from "./mountAndDismountInfo/AdditionalInfo";

const Mounting = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="w-full border">
        <EngineInfo />
      </div>

      <div className="w-full border mt-2">
        <AdditionalInfo />
      </div>
    </div>
  );
};

export default Mounting;
