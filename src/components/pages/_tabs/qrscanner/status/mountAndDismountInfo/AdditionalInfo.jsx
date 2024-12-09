import React, { useEffect, useState } from "react";
import DateField from "../../../../../constants/DateField";
import MountingPositionSelect from "../../../../../constants/MountingPositionSelect";

const AdditionalInfo = ({mountPos, setMountPos, date, setDate, cycle, setCycle}) => {

  return (
    <div className="flex flex-col w-full p-2">
      <label>Additional Information</label>
      <div>
        <label>Mounting position on engine</label>
        <MountingPositionSelect
          mountPos={mountPos}
          setMountPos={setMountPos}
        />
      </div>
      <div>
        <label>Completion date</label>
        <DateField 
          date={date}
          setDate={setDate} 
        />
      </div>
      <div>
        <label>Cycle</label>
        <input 
          className="w-full rounded p-2 border" 
          type="number" 
          value={cycle} 
          onChange={(e) => setCycle(e.target.value)} 
        />
      </div>
    </div>
  );
};

export default AdditionalInfo;
