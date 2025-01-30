import React, { useEffect, useState } from "react";
import EngineInfo from "./mountAndDismountInfo/EngineInfo";
import AdditionalInfo from "./mountAndDismountInfo/AdditionalInfo";
import { useLocation } from "react-router-dom";
import { formatDate } from "../../../../utils/formatdate";

const Mounting = ({
  selectedStatus,
  setData,
  disabled,
  showAlert,
  setShowAlert,
}) => {
  const location = useLocation();
  const cylinderData = location.state?.data;

  // Store the initial data and prevent changes unless the user modifies it
  const [initialData, setInitialData] = useState(cylinderData);

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
    return formatDate(today);
  });
  const [cycle, setCycle] = useState(initialData?.cycle);

  useEffect(() => {
    // Update state if selectedStatus matches
    if (selectedStatus === cylinderData?.status) {
      setSite(cylinderData?.location || "");
      setEngineNum(cylinderData?.updates?.otherDetails?.engineNumber || "");
      setOpHours(cylinderData?.updates?.otherDetails?.operationHours || "");
      setMountPos(cylinderData?.updates?.otherDetails?.mountingPosition || "");
      setDate(cylinderData?.updates?.dateDone || new Date());
    } else {
      // Reset the fields when the status changes
      setOpHours(""); // Reset operating hours

      setDate(new Date().toISOString().slice(0, 16)); // Reset completion date to current time
    }
  }, [
    cylinderData?.location,
    cylinderData?.status,
    cylinderData?.updates?.dateDone,
    cylinderData?.updates?.otherDetails?.engineNumber,
    cylinderData?.updates?.otherDetails?.mountingPosition,
    cylinderData?.updates?.otherDetails?.operationHours,
    selectedStatus,
  ]);
  useEffect(() => {
    if (selectedStatus === cylinderData?.status) {
      setSite(cylinderData?.location);
      setEngineNum(cylinderData?.updates?.otherDetails?.engineNumber);
      setOpHours(cylinderData?.updates?.otherDetails?.operationHours);
      setMountPos(cylinderData?.updates?.otherDetails?.mountingPosition);
      setDate(cylinderData?.updates?.dateDone || new Date());
    } else {
      setOpHours(""); // Reset operating hours
      setDate(formatDate(new Date())); // Reset completion date to current time
    }
  }, [selectedStatus, cylinderData]);

  // Update date whenever 'passed' changes
  useEffect(() => {
    const today = new Date();
    setDate(formatDate(today)); // Update date when 'passed' changes
  }, []);

  useEffect(() => {
    // Setting data for parent form submission
    setData({
      serialNumber: cylinderData?.serialNumber,
      location: site,
      dateDone: date,
      cycle: cycle,
      otherDetails: `{"engineNumber" : "${engineNum}", "operationHours" : "${opHours}", "mountingPosition" : "${mountPos}"}`,
    });
  }, [site, engineNum, opHours, mountPos, date, cycle, setData]);

  return (
    <div className="flex flex-col">
      <div className="w-full rounded-lg bg-white p-2 text-sm dark:bg-gray-500">
        <EngineInfo
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

export default Mounting;
