/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import EngineInfo from "./mountAndDismountInfo/EngineInfo";
import AdditionalInfo from "./mountAndDismountInfo/AdditionalInfo";
import { useLocation } from "react-router-dom";

const Dismounting = ({ selectedStatus, setData, disabled }) => {
  const location = useLocation();
  const cylinderData = location.state?.data;
  console.log(cylinderData);
  const [site, setSite] = useState(cylinderData?.location);
  const [engineNum, setEngineNum] = useState(
    cylinderData?.updates?.otherDetails?.engineNumber
  );
  const [opHours, setOpHours] = useState(
    cylinderData?.updates?.otherDetails?.operationHours
  );
  const [mountPos, setMountPos] = useState(
    cylinderData?.updates?.otherDetails?.mountingPosition
  );
  const [date, setDate] = useState(() => {
    const today = cylinderData?.updates?.dateDone
      ? new Date(cylinderData?.updates?.dateDone)
      : new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`; // Return full dateTime
  });
  const [cycle, setCycle] = useState(cylinderData?.cycle);

  useEffect(() => {
    setSite(
      selectedStatus === cylinderData?.status ? cylinderData?.location : ""
    );
    setEngineNum(
      selectedStatus === cylinderData?.status
        ? cylinderData?.updates?.otherDetails?.engineNumber
        : ""
    );
    setOpHours(
      selectedStatus === cylinderData?.status
        ? cylinderData?.updates?.otherDetails?.operationHours
        : 0
    );
    setMountPos(
      selectedStatus === cylinderData?.status
        ? cylinderData?.updates?.otherDetails?.mountingPosition
        : ""
    );
    setDate(() => {
      const today =
        selectedStatus === cylinderData?.status &&
        cylinderData?.updates?.dateDone
          ? new Date(cylinderData?.updates?.dateDone)
          : new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const hours = String(today.getHours()).padStart(2, "0");
      const minutes = String(today.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`; // Return full dateTime
    });
  }, [selectedStatus]);

  useEffect(() => {
    setData({
      serialNumber: cylinderData?.serialNumber,
      location: site,
      // engineNum: engineNum,
      // opHours: opHours,
      // mountPos: mountPos,
      dateDone: date,
      cycle: cycle,
      otherDetails: `{"engineNumber" : "${engineNum}", "operationHours" : "${opHours}", "mountingPosition" : "${mountPos}"}`,
    });
  }, [site, engineNum, opHours, mountPos, date, cycle]);

  return (
    <div className="flex flex-col">
      <div className="w-full p-2 rounded-lg bg-white text-sm">
        <EngineInfo
          site={site}
          setSite={setSite}
          engineNum={engineNum}
          setEngineNum={setEngineNum}
          opHours={opHours}
          setOpHours={setOpHours}
          disabled={disabled}
        />
      </div>

      <div className="w-full p-2 rounded-lg bg-white mt-3  text-sm">
        <AdditionalInfo
          mountPos={mountPos}
          setMountPos={setMountPos}
          date={date}
          setDate={setDate}
          cycle={cycle}
          setCycle={setCycle}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default Dismounting;
