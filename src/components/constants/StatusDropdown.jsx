import React from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import {
  transformStatusOptions,
  customSelectStyles,
} from "../utils/selectUtils";

const StatusDropdown = ({
  options = [],
  selectedStatus,
  setSelectedStatus,
}) => {
  const { t } = useTranslation("qrScanner");

  if (options.length === 0) {
    return (
      <select id="status-select" disabled>
        <option value="sdfff">{t("qrScanner:noOptionsAvailable")}</option>
      </select>
    );
  }

  // Use utility function to transform options
  const statusOptions = transformStatusOptions(options);

  return (
    <div className="">
      <Select
        options={statusOptions}
        value={statusOptions.find((option) => option.value === selectedStatus)}
        onChange={(selectedOption) => setSelectedStatus(selectedOption.value)}
        styles={customSelectStyles}
        placeholder={t("qrScanner:selectAStatus")}
        isDisabled={options.length === 0} // Disable if no options
        // className="text-sm border-gray-300 rounded-md p-2" // Tailwind classes for styling
      />
    </div>
  );
};

export default StatusDropdown;
