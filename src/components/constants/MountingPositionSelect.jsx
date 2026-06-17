import React from "react";
import Select from "react-select";
import { customSelectStyles } from "../utils/selectUtils";

const MOUNTING_POSITIONS = [
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "A6",
  "A7",
  "A8",
  "A9",
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "B6",
  "B7",
  "B8",
  "B9",
];

const MountingPositionSelect = ({ mountPos, setMountPos, disabled, t }) => {
  const isDarkMode = document.documentElement.classList.contains("dark");

  const options = MOUNTING_POSITIONS.map((pos) => ({
    value: pos,
    label: pos,
  }));

  const handleChange = (selectedOption) => {
    setMountPos(selectedOption?.value || "");
  };

  return (
    <div className="flex flex-col space-y-2">
      <Select
        id="mountingPosition"
        value={options.find((opt) => opt.value === mountPos) || null}
        onChange={handleChange}
        options={options}
        isDisabled={disabled}
        styles={customSelectStyles(isDarkMode)}
        placeholder={t("selectEnginePos")}
        isClearable
        noOptionsMessage={() => t("noOptionsAvailable")}
      />
    </div>
  );
};

export default MountingPositionSelect;
