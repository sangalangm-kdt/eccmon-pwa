import React from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import {
  transformStatusOptions,
  customSelectStyles,
} from "../utils/selectUtils";

const StatusDropdown = ({
  options = [], // Original options containing the actual values
  selectedStatus,
  setSelectedStatus,
  disabled,
}) => {
  const { t } = useTranslation();

  if (options.length === 0) {
    return (
      <select id="status-select" disabled>
        <option value="">{t("qrScanner:noOptionsAvailable")}</option>
      </select>
    );
  }
  const isDarkMode = document.documentElement.classList.contains("dark");

  // Use the `t` function from `useTranslation` and pass it to the utility function
  const statusOptions = transformStatusOptions(options, t); // Now passing `t`

  // Get the translated label for display purposes and convert to lowercase
  const translatedSelectedStatus = t(
    `qrScanner:${selectedStatus}`,
  ).toLowerCase();

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
        options={statusOptions} // Using the transformed and translated options
        value={statusOptions.find(
          (option) => option.value === selectedStatus, // Use raw value for comparison
        )}
        onChange={(selectedOption) => setSelectedStatus(selectedOption.value)} // Keep raw value for saving
        styles={customSelectStyles(isDarkMode)}
        placeholder={t("qrScanner:selectAStatus")}
        isDisabled={disabled}
        getOptionLabel={(option) =>
          getOptionLabel(option, translatedSelectedStatus)
        }
      />
    </div>
  );
};

export default StatusDropdown;
