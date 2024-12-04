/* eslint-disable no-unused-vars */
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
    { id: 2, status: "Disassembly" },
    { id: 3, status: "Grooving" },
    { id: 4, status: "LMD" },
    { id: 5, status: "Finishing" },
    { id: 6, status: "Assembly" },
    { id: 7, status: "Mounted" },
    { id: 8, status: "Dismounted" },
    { id: 9, status: "Disposal" },
  ];

  // const isLoading ? === "loading"; // Check if loading
  const hasOptions = cylinderStatusOptions.length > 0; // Check if options are available

  return (
    <div className="flex flex-col w-full">
      <label
        htmlFor="status-select"
        className="text-sm text-primaryText mt-2 mb-1 font-semibold"
      >
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
