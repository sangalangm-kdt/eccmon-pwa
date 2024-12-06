import React, { useState } from "react";
import ScanCodes from "./ScanCodes";
import SaveButton from "../../../constants/SaveButton";
import { CylinderInfo, QrHeader } from "./components";

const ScannedResult = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("None");

  // useEffect(() => {
  //   setSelectedStatus(cylinder.status);
  // }, [cylinder])

  const data = {
    
  }

  const handleClick = () => {

  }

  return (
    <div>
      <form className="flex flex-col w-full bg-gray-100">
        <QrHeader />
        <ScanCodes
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
        <div className="mt-2">
          <CylinderInfo
            selectedStatus={selectedStatus}
            onDateChange={setSelectedDate}
            selectedDate={selectedDate}
          />
        </div>
        <SaveButton 
          disabled
          onClick={handleClick}
        />
      </form>
    </div>
  );
};

export default ScannedResult;
