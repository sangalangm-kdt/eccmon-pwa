/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchCylinderStatus } from "../../features/status/statusSlice";
import StatusDropdown from "./StatusDropdown";
import { useTranslation } from "react-i18next";
import { useCylinderCover } from "../../hooks/cylinderCover";

export const CylinderStatusSelect = ({
  selectedStatus,
  setSelectedStatus,
  disabled,
}) => {
  // const dispatch = useDispatch();
  const { t } = useTranslation();

  // Get cylinder status options
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cylinderStatusOptions = [
    { id: 1, status: "Storage" }, // Translated
    { id: 2, status: "Disassembly" }, // Translated
    { id: 3, status: "Grooving" }, // Translated
    { id: 4, status: "LMD" }, // Translated
    { id: 5, status: "Finishing" }, // Translated
    { id: 6, status: "Assembly" }, // Translated
    { id: 7, status: "Mounted" }, // Translated
    { id: 8, status: "Dismounted" }, // Translated
    { id: 9, status: "Disposal" }, // Translated
  ];

  const hasOptions = cylinderStatusOptions.length > 0;

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
        disabled={disabled}
      />
      {!hasOptions && (
        <p className="text-gray-500">No options available</p> // Optional message
      )}
    </div>
  );
};
