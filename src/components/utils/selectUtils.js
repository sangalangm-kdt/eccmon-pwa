/* eslint-disable no-unused-vars */
import zIndex from "@mui/material/styles/zIndex";

export const transformStatusOptions = (options) => {
  return options.map((option) => ({
    value: option.status,
    label: option.status,
    originalLabel: option.status,
  }));
};

export const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? "#00bfff" : "#ddd",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    position: "relative",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#00bfff" : "",
    color: state.isSelected ? "#fff" : "#333",
    fontSize: "14px",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#888",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#333",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#4A5568",
  }),
  menu: (base) => ({
    ...base,
    position: "absolute", // Absolute positioning for dropdown
    top: "100%", // Ensure it's below the control
    left: 0,
    width: "100%",
    borderRadius: "0.375rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    maxHeight: "unset", // Remove height restrictions
    overflow: "visible", // Ensure no content is cut off
    zIndex: 10,
  }),
  menuList: (base) => ({
    ...base,
    padding: 0, // Remove default padding
    maxHeight: "none", // Ensure no vertical scrolling
  }),
};
