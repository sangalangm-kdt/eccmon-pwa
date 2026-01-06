import React from "react";
import Select from "react-select";
import { customSelectStyle, customSelectStyles } from "../utils/selectUtils"; // Import custom select styles

const MountingPositionSelect = ({ mountPos, setMountPos, disabled, t }) => {
  const mountingPositions = [
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

  const options = mountingPositions.map((pos) => ({
    value: pos,
    label: pos,
  }));

  const handleChange = (selectedOption) => {
    const newMountPos = selectedOption?.value || "";
    console.log("Selected Mounting Position:", newMountPos); // Debug log
    setMountPos(newMountPos); // Update state
  };
  const isDarkMode = document.documentElement.classList.contains("dark");

  return (
    <div className="flex flex-col space-y-2">
      <Select
        id="mountingPosition"
        value={options.find((opt) => opt.value === mountPos) || null}
        onChange={handleChange}
        options={options}
        isDisabled={disabled}
        styles={customSelectStyles(isDarkMode)}
        placeholder="e.g. B1"
        isClearable
        noOptionsMessage={() => "No positions available"}
      />
    </div>
  );
};

export default MountingPositionSelect;
