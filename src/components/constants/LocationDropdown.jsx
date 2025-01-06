import React, { useState } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { customSelectStyles } from "../utils/selectUtils";

const LocationDropdown = ({
  onLocationChange,
  options = [],
  loading,
  error,
  processor,
  setProcessor,
  disabled,
}) => {
  const { t } = useTranslation();

  const handleChange = (selectedOption) => {
    const newLocation = selectedOption?.value || "";
    setProcessor(newLocation);
    if (onLocationChange) {
      onLocationChange(newLocation); // Call the passed function
    }
  };

  const transformedOptions = options.map((option) => ({
    value: option.name,
    label: option.name,
  }));

  return (
    <div className="mt-2 text-sm">
      <div className="flex flex-col w-full">
        {loading && <div>{t("qrScanner:loadingOptions")}</div>}
        {error && <div>{t("qrScanner:error", { error })}</div>}
        <Select
          value={
            transformedOptions.find((opt) => opt.value === processor) || null
          }
          onChange={handleChange}
          options={transformedOptions}
          isDisabled={disabled}
          styles={customSelectStyles}
          placeholder={t("qrScanner:selectALocation")}
          isClearable
          noOptionsMessage={() => t("qrScanner:noOptionsAvailable")}
        />
      </div>
    </div>
  );
};

export default LocationDropdown;
