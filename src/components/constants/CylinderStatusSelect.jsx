import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchCylinderStatus } from "../../features/status/statusSlice";
import StatusDropdown from "./StatusDropdown";
import { useTranslation } from "react-i18next";
import { useCylinderCover } from "../../hooks/cylinderCover";

export const CylinderStatusSelect = ({ selectedStatus, setSelectedStatus }) => {
  // const dispatch = useDispatch();
  const { t } = useTranslation();

  // Get cylinder status options
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cylinderStatusOptions = [
    { id: 1, status: "Storage" },
    { id: 2, status: "Material and Machining" },
    { id: 3, status: "Disassembly" },
    { id: 4, status: "Grooving" },
    { id: 5, status: "LMD" },
    { id: 6, status: "Finishing" },
    { id: 7, status: "Assembly" },
    { id: 8, status: "Mounted" },
    { id: 9, status: "Dismounted" },
    { id: 10, status: "Disposal" },
  ];

  // const isLoading ? === "loading"; // Check if loading
  const hasOptions = cylinderStatusOptions.length > 0; // Check if options are available

  return (
    <div className="flex flex-col w-full">
      <label htmlFor="status-select" className="text-sm mt-2 font-semibold">
        {t("qrScanner:status")}
      </label>
      <StatusDropdown
        options={cylinderStatusOptions}
        selectedStatus={selectedStatus} // Use local state for selected status
        setSelectedStatus={setSelectedStatus}
        // disabled={isLoading} // Disable only if loading
      />
      {!hasOptions && (
        <p className="text-gray-500">No options available</p> // Optional message
      )}
    </div>
  );
};
