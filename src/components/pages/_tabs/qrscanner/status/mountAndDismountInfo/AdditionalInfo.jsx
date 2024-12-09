import React from "react";
import DateField from "../../../../../constants/DateField";
import MountingPositionSelect from "../../../../../constants/MountingPositionSelect";

const AdditionalInfo = () => {
  return (
    <div className="flex flex-col w-full p-2">
      <label className="font-semibold">Additional Information</label>
      <div>
        <label>Mounting position on engine</label>
        <MountingPositionSelect />
      </div>
      <div>
        <label>Completion date</label>
        <DateField />
      </div>
      <div>
        <label>Cycle</label>
        <input className="w-full rounded p-2 border" type="number" />
      </div>
    </div>
  );
};

export default AdditionalInfo;
