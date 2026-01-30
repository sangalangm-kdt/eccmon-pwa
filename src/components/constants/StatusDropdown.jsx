import React from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import {
  transformStatusOptions,
  customSelectStyles,
} from "../utils/selectUtils";
import { IoLockClosed } from "react-icons/io5";

const StatusDropdown = ({
  options = [],
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
  const statusOptions = transformStatusOptions(options, t);

  const selectedOption = statusOptions.find(
    (option) => option.value === selectedStatus,
  );

  // ✅ If locked, don't allow changing at all
  const handleChange = (selectedOption) => {
    if (disabled) return;
    setSelectedStatus(selectedOption?.value);
  };

  return (
    <div className="relative">
      {/* ✅ HARD LOCK: block pointer events so it can't be clicked/focused */}
      <div className={disabled ? "pointer-events-none" : ""}>
        <Select
          options={statusOptions}
          value={selectedOption}
          onChange={handleChange}
          styles={customSelectStyles(isDarkMode)}
          placeholder={t("qrScanner:selectAStatus")}
          isDisabled={disabled}
          // ✅ HARD LOCK: do not allow menu to open
          menuIsOpen={disabled ? false : undefined}
          // ✅ optional: also prevent searching when locked
          isSearchable={!disabled}
          // ✅ optional: keep menu from opening on click when locked
          openMenuOnClick={!disabled}
          openMenuOnFocus={!disabled}
        />
      </div>

      {/* ✅ overlay lock icon (still clickable? no, because pointer-events-none above blocks) */}
      {disabled && (
        <div className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 text-gray-400">
          <IoLockClosed className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
