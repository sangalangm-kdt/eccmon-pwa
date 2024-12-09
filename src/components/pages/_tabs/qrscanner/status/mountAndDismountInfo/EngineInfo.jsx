import React, { useEffect, useState } from "react";
import SiteNameOptions from "../../../../../constants/SiteNameOptions";

const EngineInfo = ({site, setSite, engineNum, setEngineNum, opHours, setOpHours}) => {

  return (
    <div className="flex flex-col p-2">
      <div className="flex flex-col w-full">
        <label>Engine information</label>
        <SiteNameOptions 
          setSite={setSite}
        />
      </div>
      <div>
        <label>Engine no.</label>
        <input
          value={engineNum}
          className="w-full p-2 rounded border"
          type="text"
          placeholder="Enter number"
          onChange={(e) => setEngineNum(e.target.value)}
        />
      </div>
      <div>
        <label>Operating hours</label>
        <input 
          className="w-full p-2 rounded border" 
          type="number" 
          value={opHours} 
          onChange={(e) => setOpHours(e.target.value)} 
        />
      </div>
    </div>
  );
};

export default EngineInfo;
