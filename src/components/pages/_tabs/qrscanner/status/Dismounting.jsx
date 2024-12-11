/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import EngineInfo from "./mountAndDismountInfo/EngineInfo";
import AdditionalInfo from "./mountAndDismountInfo/AdditionalInfo";
import { useLocation } from "react-router-dom";

const Dismounting = ({ setData, disabled }) => {
  const location = useLocation();
  const cylinderData = location.state?.data;

  const [site, setSite] = useState("");
  const [engineNum, setEngineNum] = useState("");
  const [opHours, setOpHours] = useState(0);
  const [mountPos, setMountPos] = useState("A1");
  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [cycle, setCycle] = useState(cylinderData?.cycle);

  useEffect(() => {
    setData({
      serialNumber: cylinderData?.serialNumber,
      location: site,
      engineNum: engineNum,
      opHours: opHours,
      mountPos: mountPos,
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
