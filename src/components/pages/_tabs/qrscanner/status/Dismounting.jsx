import React from "react";
import EngineInfo from "./mountAndDismountInfo/EngineInfo";
import AdditionalInfo from "./mountAndDismountInfo/AdditionalInfo";

const Dismounting = () => {
  return (
    <div className="flex flex-col">
      <div className="w-full p-2 rounded-lg bg-white text-sm">
        <EngineInfo />
      </div>

      <div className="w-full p-2 rounded-lg bg-white mt-3  text-sm">
        <AdditionalInfo />
      </div>
    </div>
  );
};

export default Dismounting;
