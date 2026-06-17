import React from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { customSelectStyles } from "../utils/selectUtils";

const LocationDropdown = ({
  options = [],
  loading,
  error,
  processor,
  setProcessor,
  disabled,
  emptyHelperKey = "noOptionsForProcess",
}) => {
  const { t } = useTranslation("qrScanner");
  const isDarkMode = document.documentElement.classList.contains("dark");
  const hasOptions = options.length > 0;

  const handleChange = (selectedOption) => {
    setProcessor(selectedOption?.value || "");
  };

  const transformedOptions = options.map((option) => ({
    value: option.name,
    label: option.name,
  }));

  if (error) {
    return <div className="text-sm text-red-600">{t("error", { error })}</div>;
  }

  if (loading) {
    return <div className="mt-2 text-sm">{t("loadingOptions")}</div>;
  }

  if (!hasOptions) {
    return (
      <div className="mt-2 text-sm">
        <select
          disabled
          className="w-full rounded border bg-gray-100 px-2 py-2.5 text-sm text-gray-500 dark:bg-gray-600 dark:text-gray-300"
        >
          <option>{t("noOptionsAvailable")}</option>
        </select>
        {emptyHelperKey ? (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 md:text-xs">
            {t(emptyHelperKey)}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-2 text-sm">
      <Select
        value={
          transformedOptions.find((opt) => opt.value === processor) || null
        }
        onChange={handleChange}
        options={transformedOptions}
        isDisabled={disabled}
        styles={customSelectStyles(isDarkMode)}
        placeholder={t("selectALocation")}
        isClearable
        noOptionsMessage={() => t("noOptionsAvailable")}
      />
    </div>
  );
};

export default LocationDropdown;
