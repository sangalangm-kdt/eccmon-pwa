import React from "react";
import EngineInfo from "./mountAndDismountInfo/EngineInfo";
import AdditionalInfo from "./mountAndDismountInfo/AdditionalInfo";

const Mounting = () => {
  return (
    <div className="flex flex-col">
      <div className="w-full border p-2  mb-4">
        <EngineInfo />
      </div>

      <div className="w-full border p-2">
        <AdditionalInfo />
      </div>
    </div>
  );
};

export default Mounting;
