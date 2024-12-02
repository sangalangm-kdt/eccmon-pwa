import React from "react";
import SiteNameOptions from "../../../../../constants/SiteNameOptions";

const EngineInfo = () => {
  return (
    <div className="flex flex-col p-4">
      <div className="flex w-full">
        <SiteNameOptions />
      </div>
      <div>
        <label>Engine no.</label>
        <input
          className="w-full p-2 rounded border"
          type="text"
          placeholder="Enter number"
        />
      </div>
      <div>
        <label>Operating hours</label>
        <input className="w-full p-2 rounded border" />
      </div>
    </div>
  );
};

export default EngineInfo;
