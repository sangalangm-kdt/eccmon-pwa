import React from "react";
import { useTranslation } from "react-i18next";

const StatusDropdown = ({
  options = [],
  selectedStatus,
  setSelectedStatus,
}) => {
  const { t } = useTranslation("qrScanner");

  if (options.length === 0) {
    return (
      <select id="status-select" disabled className="p-2 border rounded">
        <option value="sdfff">{t("qrScanner:noOptionsAvailable")}</option>
      </select>
    );
  }

  return (
    <select
      id="status-select"
      value={selectedStatus} // Ensure selectedValue is passed correctly here
      onChange={(e) => setSelectedStatus(e.target.value)}
      className="p-2 border rounded"
    >
      <option value="None" disabled>{t("qrScanner:selectAStatus")}</option>
      {options.map((option) => (
        <option key={option.id} value={option.status}>
          {option.status}
        </option>
      ))}
    </select>
  );
};

export default StatusDropdown;
