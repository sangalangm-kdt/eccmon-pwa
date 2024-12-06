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

  // Function to highlight matching text in options
  const getOptionLabel = (option, inputValue) => {
    if (!inputValue) {
      return option.label; // If no input, just return the label
    }

    const regex = new RegExp(`(${inputValue})`, "gi"); // Case-insensitive match
    const parts = option.label.split(regex);

    return (
      <div>
        {parts.map((part, index) => (
          <span
            key={index}
            style={{ fontWeight: regex.test(part) ? "normal" : "" }}
          >
            {part}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="">
      <Select
        options={statusOptions}
        value={statusOptions.find((option) => option.value === selectedStatus)}
        onChange={(selectedOption) => setSelectedStatus(selectedOption.value)}
        styles={customSelectStyles}
        placeholder={t("qrScanner:selectAStatus")}
        isDisabled={options.length === 0} // Disable if no options
        getOptionLabel={(option) => getOptionLabel(option, selectedStatus)}
      />
    </div>
  );
};

export default StatusDropdown;
