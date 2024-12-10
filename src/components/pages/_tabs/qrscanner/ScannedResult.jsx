/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ScanCodes from "./ScanCodes";
import SaveButton from "../../../constants/SaveButton";
import { CylinderInfo, QrHeader } from "./components";
import { useCylinderUpdate } from "../../../../hooks/cylinderUpdates";

const ScannedResult = () => {
  const [selectedStatus, setSelectedStatus] = useState("None");
  const [data, setData] = useState({});
  const { addUpdate } = useCylinderUpdate();

  // useEffect(() => {
  //   setSelectedStatus(cylinder.status);
  // }, [cylinder])
  const handleClick = (e) => {
    e.preventDefault();
    console.log(data, selectedStatus);
    addUpdate(data, selectedStatus);
  };

  useEffect(() => {
    console.log(data, selectedStatus);
  }, [data]);

  return (
    <div>
      <form className="flex flex-col w-full bg-gray-100">
        <QrHeader />
        <ScanCodes
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
        <div className="mt-2">
          <CylinderInfo selectedStatus={selectedStatus} setData={setData} />
        </div>
        <SaveButton onClick={handleClick} />
      </form>
    </div>
  );
};

export default ScannedResult;
