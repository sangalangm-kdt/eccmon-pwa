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

  // Get cylinder status options with labelKey for translation
  const cylinderStatusOptions = [
    { id: 1, status: "Storage", labelKey: "storage" },
    { id: 2, status: "Disassembly", labelKey: "disassembly" },
    { id: 3, status: "Grooving", labelKey: "grooving" },
    { id: 4, status: "LMD", labelKey: "lmd" },
    { id: 5, status: "Finishing", labelKey: "finishing" },
    { id: 6, status: "Assembly", labelKey: "assembly" },
    { id: 7, status: "Mounted", labelKey: "mounted" },
    { id: 8, status: "Dismounted", labelKey: "dismounted" },
    { id: 9, status: "Disposal", labelKey: "disposal" },
  ];

  const hasOptions = cylinderStatusOptions.length > 0;

  return (
    <div className="flex w-full flex-col">
      <label
        htmlFor="status-select"
        className="mb-1 mt-2 text-sm font-semibold text-primaryText dark:text-gray-100"
      >
        {t("qrScanner:status")}
      </label>
      <StatusDropdown
        options={cylinderStatusOptions}
        selectedStatus={selectedStatus} // Use local state for selected status
        setSelectedStatus={setSelectedStatus}
        disabled={disabled}
        t={t}
      />
      {!hasOptions && (
        <p className="text-gray-500">No options available</p> // Optional message
      )}
    </div>
  );
};
