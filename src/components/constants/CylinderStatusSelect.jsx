/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchCylinderStatus } from "../../features/status/statusSlice";
import StatusDropdown from "./StatusDropdown";
import { useTranslation } from "react-i18next";
import { useCylinderCover } from "../../hooks/cylinderCover";

export const CylinderStatusSelect = ({ onStatusChange, scannedCode }) => {
  // const dispatch = useDispatch();
  const { t } = useTranslation();
  const { updateCylinder } = useCylinderCover();

  // Get cylinder status options
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cylinderStatusOptions = [
    "Storage",
    "Material and Machining",
    "Disassembly",
    "Grooving",
    "LMD",
    "Finishing",
    "Assembly",
    "Mounted",
    "Dismounted",
    "Disposal",
  ];
  // const status = useSelector((state) => state.status.status);
  console.log("statuss:", cylinderStatusOptions);

  // Local state for selected status
  const [selectedStatus, setSelectedStatus] = useState("");

  // Sync selected status with existing cylinder status from scanned code
  useEffect(() => {
    if (scannedCode?.status) {
      setSelectedStatus(scannedCode.cylinderStatus);
    } else {
      setSelectedStatus(scannedCode?.status); // Reset if no options
    }
  }, [scannedCode, cylinderStatusOptions]);

  const handleSelectChange = (newStatus) => {
    setSelectedStatus(newStatus); // Update local state
    onStatusChange(newStatus); // Pass selected status to parent component
  };

  // const isLoading ? === "loading"; // Check if loading
  const hasOptions = cylinderStatusOptions.length > 0; // Check if options are available

  return (
    <div className="flex flex-col w-full">
      <label htmlFor="status-select" className="text-sm mt-2 font-semibold">
        {t("qrScanner:status")}
      </label>
      <StatusDropdown
        options={cylinderStatusOptions}
        selectedValue={selectedStatus} // Use local state for selected status
        onChange={handleSelectChange}
        scannedCode={scannedCode}
        // disabled={isLoading} // Disable only if loading
      />
      {!hasOptions && (
        <p className="text-gray-500">No options available</p> // Optional message
      )}{" "}
    </div>
  );
};
