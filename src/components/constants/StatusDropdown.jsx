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
  disabled,
}) => {
  const { t } = useTranslation();
  const isDarkMode = document.documentElement.classList.contains("dark");

  if (options.length === 0) {
    return (
      <select
        id="status-select"
        disabled
        className="w-full rounded border bg-gray-100 px-2 py-2.5 text-base text-gray-500 dark:bg-gray-600 dark:text-gray-300 md:min-h-0 md:text-sm"
      >
        <option value="">{t("qrScanner:noOptionsAvailable")}</option>
      </select>
    );
  }

  const statusOptions = transformStatusOptions(options, t);

  const translatedSelectedStatus = t(
    `qrScanner:${selectedStatus}`,
  ).toLowerCase();

  const getOptionLabel = (option, inputValue) => {
    if (!inputValue) {
      return option.label;
    }

    const regex = new RegExp(`(${inputValue})`, "gi");
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
    <Select
      options={statusOptions}
      value={statusOptions.find((option) => option.value === selectedStatus)}
      onChange={(selectedOption) => setSelectedStatus(selectedOption.value)}
      styles={customSelectStyles(isDarkMode)}
      placeholder={t("qrScanner:selectAStatus")}
      isDisabled={disabled}
      noOptionsMessage={() => t("qrScanner:noOptionsAvailable")}
      getOptionLabel={(option) =>
        getOptionLabel(option, translatedSelectedStatus)
      }
    />
  );
};

export default StatusDropdown;
