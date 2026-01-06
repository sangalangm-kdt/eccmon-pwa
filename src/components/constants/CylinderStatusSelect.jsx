import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchCylinderStatus } from "../../features/status/statusSlice";
import StatusDropdown from "./StatusDropdown";
import { useTranslation } from "react-i18next";
import { useCylinderCover } from "../../hooks/cylinderCover";
import { useLocationProcess } from "../../hooks/locationProcess";
import { useAuth } from "../auth/AuthContext";
import { useAuthentication } from "../../hooks/auth";
import { useLocation } from "../../hooks/location";

export const CylinderStatusSelect = ({
  selectedStatus,
  setSelectedStatus,
  disabled,
}) => {
  // const dispatch = useDispatch();
  const { t } = useTranslation();
  const { user } = useAuthentication();

  const { process } = useLocation(user.id) ?? [];
  console.log(user);
  // Get cylinder status options with labelKey for translation
  const cylinderStatusOptions = [
    ...(process?.flatMap((process, processIdx) => {
      if (process === "site") {
        return [
          { id: processIdx, status: "Mounted", labelKey: "mounted" },
          { id: processIdx + 1, status: "Dismounted", labelKey: "dismounted" },
        ];
      }
      return {
        id: processIdx,
        status: process,
        labelKey: process.toLowerCase(),
      };
    }) || []),
  ];

  // Dynamically add "Disposal" at the last index
  cylinderStatusOptions.push({
    id: cylinderStatusOptions.length, // Last index dynamically
    status: "Disposal",
    labelKey: "disposal",
  });

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
        <p className="text-xs text-gray-500 dark:text-gray-100">
          No options available
        </p> // Optional message
      )}
    </div>
  );
};
