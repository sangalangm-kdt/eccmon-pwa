import React, { useEffect, useState } from "react";
import EngineInfo from "./mountAndDismountInfo/EngineInfo";
import AdditionalInfo from "./mountAndDismountInfo/AdditionalInfo";
import { useLocation } from "react-router-dom";
import { formatDate } from "../../../../utils/formatdate";
import { useAuthentication } from "../../../../../hooks/auth";

const Dismounting = ({
  selectedStatus,
  setData,
  disabled,
  showAlert,
  setShowAlert,
  resetFlag, // Add resetFlag prop to trigger reset
}) => {
  const location = useLocation("dismounted");
  const cylinderData = location.state?.data;
  const { user } = useAuthentication();

  // Store the initial data and prevent changes unless the user modifies it
  const [initialData, setInitialData] = useState(cylinderData);
  console.log(initialData);
  const [site, setSite] = useState(initialData?.location);
  const [engineNum, setEngineNum] = useState(
    initialData?.updates?.otherDetails?.engineNumber,
  );
  const [opHours, setOpHours] = useState(
    initialData?.updates?.otherDetails?.operationHours,
  );
  const [mountPos, setMountPos] = useState(
    initialData?.updates?.otherDetails?.mountingPosition,
  );
  const [date, setDate] = useState(() => {
    const today = initialData?.updates?.dateDone
      ? new Date(initialData?.updates?.dateDone)
      : new Date();
    return formatDate(today); // Return full dateTime
  });
  const [cycle, setCycle] = useState(initialData?.cycle);

  // Update fields when selectedStatus changes
  useEffect(() => {
    if (selectedStatus === cylinderData?.status) {
      setSite(cylinderData?.location);
      setEngineNum(cylinderData?.updates?.otherDetails?.engineNumber);
      setOpHours(cylinderData?.updates?.otherDetails?.operationHours);
      setMountPos(cylinderData?.updates?.otherDetails?.mountingPosition);
      setDate(cylinderData?.updates?.dateDone || new Date());
    } else {
      const today = new Date();
      setDate(formatDate(today));
      setOpHours("");
    }
  }, [selectedStatus]);

  // Update the data to parent component when fields change
  useEffect(() => {
    setData({
      serialNumber: cylinderData?.serialNumber,
      location: user.is_admin === 1 ? site : user.affiliation,
      dateDone: date,
      cycle: cycle,
      otherDetails: `{"engineNumber" : "${engineNum}", "operationHours" : "${opHours}", "mountingPosition" : "${mountPos}"}`,
    });
  }, [site, engineNum, opHours, mountPos, date, cycle, setData]);

  return (
    <div className="flex flex-col">
      <div className="w-full rounded-lg bg-white p-2 text-sm dark:bg-gray-500">
        <EngineInfo
          affiliation={user.affiliation}
          site={site}
          setSite={setSite}
          engineNum={engineNum}
          setEngineNum={setEngineNum}
          opHours={opHours}
          setOpHours={setOpHours}
          disabled={disabled}
          showAlert={showAlert}
          setShowAlert={setShowAlert}
        />
      </div>

      <div className="mt-3 w-full rounded-lg bg-white p-2 text-sm dark:bg-gray-500">
        <AdditionalInfo
          mountPos={mountPos}
          setMountPos={setMountPos}
          date={date}
          setDate={setDate}
          cycle={cycle}
          setCycle={setCycle}
          disabled={disabled}
          showAlert={showAlert}
          setShowAlert={setShowAlert}
        />
      </div>
    </div>
  );
};

export default Dismounting;
