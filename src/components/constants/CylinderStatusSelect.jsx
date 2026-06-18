import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchCylinderStatus } from "../../features/status/statusSlice";
import StatusDropdown from "./StatusDropdown";
import { useTranslation } from "react-i18next";
import { useAuthentication } from "../../hooks/auth";
import { useLocation } from "../../hooks/location";

const normalizeStatus = (status) => String(status).trim().toLowerCase();

const buildCylinderStatusOptions = (processes = []) => {
  const options = processes.flatMap((process, processIdx) => {
    const normalizedProcess = normalizeStatus(process);

    if (normalizedProcess === "site") {
      return [
        { id: processIdx, status: "Mounted", labelKey: "mounted" },
        { id: processIdx + 1, status: "Dismounted", labelKey: "dismounted" },
      ];
    }

    return {
      id: processIdx,
      status: process,
      labelKey: normalizedProcess,
    };
  });

  const hasDisposal = options.some(
    (option) => normalizeStatus(option.status) === "disposal",
  );

  if (!hasDisposal) {
    options.push({
      id: "disposal",
      status: "Disposal",
      labelKey: "disposal",
    });
  }

  const uniqueOptions = options.filter(
    (option, index, list) =>
      index ===
      list.findIndex(
        (item) => normalizeStatus(item.status) === normalizeStatus(option.status),
      ),
  );

  return uniqueOptions;
};

export const CylinderStatusSelect = ({
  selectedStatus,
  setSelectedStatus,
  disabled,
}) => {
  // const dispatch = useDispatch();
  const { t } = useTranslation();
  const { user } = useAuthentication();

  const { process } = useLocation(user.id) ?? [];
  const cylinderStatusOptions = buildCylinderStatusOptions(process ?? []);

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
      />
      {!hasOptions && (
        <p className="text-xs text-gray-500 dark:text-gray-100">
          {t("qrScanner:noOptionsAvailable")}
        </p>
      )}
    </div>
  );
};
