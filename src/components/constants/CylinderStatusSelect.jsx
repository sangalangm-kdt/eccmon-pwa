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
    { id: 1, status: t("qrScanner:storage") }, // Translated
    { id: 2, status: t("qrScanner:disassembly") }, // Translated
    { id: 3, status: t("qrScanner:grooving") }, // Translated
    { id: 4, status: t("qrScanner:lmd") }, // Translated
    { id: 5, status: t("qrScanner:finishing") }, // Translated
    { id: 6, status: t("qrScanner:assembly") }, // Translated
    { id: 7, status: t("qrScanner:mounted") }, // Translated
    { id: 8, status: t("qrScanner:dismounted") }, // Translated
    { id: 9, status: t("qrScanner:disposal") }, // Translated
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
