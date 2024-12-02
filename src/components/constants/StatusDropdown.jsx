import React from "react";
import { useTranslation } from "react-i18next";

const StatusDropdown = ({
  options = [],
  selectedValue,
  onChange,
  disabled,
}) => {
  const isDisabled = disabled; // Change logic to only depend on the disabled prop
  const { t } = useTranslation("qrScanner");

  if (options.length === 0) {
    return (
      <select id="status-select" disabled className="p-2 border rounded">
        <option value="">{t("qrScanner:noOptionsAvailable")}</option>
      </select>
    );
  }

  return (
    <select
      id="status-select"
      value={selectedValue ? selectedValue : null} // Ensure selectedValue is passed correctly here
      onChange={(e) => onChange(e.target.value)}
      className="p-2 border rounded"
    >
      <option value="">{t("qrScanner:selectAStatus")}</option>
      {options.map((option) => (
        <option key={option.id} value={option.cylinderStatus}>
          {option.cylinderStatus}
        </option>
      ))}
    </select>
  );
};

export default StatusDropdown;
