import React from "react";
import EngineInfo from "./mountAndDismountInfo/EngineInfo";
import AdditionalInfo from "./mountAndDismountInfo/AdditionalInfo";

const Dismounting = () => {
  return (
    <div className="flex flex-col">
      <div className="w-full border p-2">
        <EngineInfo />
      </div>

      <div className="w-full border p-2">
        <AdditionalInfo />
      </div>
    </div>
  );
};

export default Dismounting;
