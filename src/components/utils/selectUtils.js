/* eslint-disable no-unused-vars */
import zIndex from "@mui/material/styles/zIndex";
import { useTranslation } from "react-i18next";
import { padding } from "../styles/login";

export const transformStatusOptions = (options, t) => {
  return options.map((option) => ({
    value: option.status,
    label: t(`qrScanner:${option.labelKey}`),
  }));
};

export const customSelectStyles = (isDarkMode) => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: isDarkMode
      ? "rgb(75, 85, 99)" // Dark mode background
      : "rgb(255, 255, 255)", // Light mode background
    borderColor: state.isFocused ? "#00bfff" : "#ddd",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    position: "relative",
    color: isDarkMode ? "rgb(229, 231, 235)" : "#333", // Text color based on mode
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#00bfff" // Selected option background
      : state.isFocused
      ? isDarkMode
        ? "rgb(55, 65, 81)" // Dark mode focused option
        : "rgb(243, 244, 246)" // Light mode focused option
      : "transparent",
    color: state.isSelected
      ? "#fff" // White text when selected
      : isDarkMode
      ? "rgb(229, 231, 235)" // Light text for dark mode
      : "#333", // Dark text for light mode
    fontSize: "14px",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: isDarkMode ? "rgb(156, 163, 175)" : "#888", // Placeholder color based on mode
  }),
  singleValue: (provided) => ({
    ...provided,
    color: isDarkMode
      ? "rgb(229, 231, 235)" // Text color for dark mode
      : "#333", // Text color for light mode
  }),
   indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: isDarkMode ? "rgb(229, 231, 235)" : "#4A5568", // Adjust arrow color for dark mode
    "&:hover": {
      color: "#00bfff", // Cyan on hover
    },
  }),
  menu: (base) => ({
    ...base,
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    padding:0,
    borderRadius: "0.375rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    maxHeight: "300px",
    overflowY: "auto",
    zIndex: 10,
    backgroundColor: isDarkMode
      ? "rgb(75, 85, 99)" // Dark menu background
      : "rgb(255, 255, 255)", // Light menu background
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
    maxHeight: "none",
  }),
});


export const customSelectStyle = (isDarkMode) => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: isDarkMode
      ? "rgb(31, 41, 55)" // Tailwind `gray-800` for dark mode
      : "rgb(255, 255, 255)", // Tailwind `white` for light mode
    borderColor: state.isFocused
      ? "rgb(14, 165, 233)" // Tailwind `cyan-500` when focused
      : "rgb(209, 213, 219)", // Tailwind `gray-300`
    color: isDarkMode ? "rgb(229, 231, 235)" : "rgb(75, 85, 99)", // Text color
    borderRadius: "0.375rem",
    padding: "4px",
    boxShadow: state.isFocused
      ? "0 0 0 2px rgba(14, 165, 233, 0.5)" // Cyan ring
      : "none",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: isDarkMode
      ? "rgb(31, 41, 55)" // Tailwind `gray-800`
      : "rgb(255, 255, 255)", // Tailwind `white`
    borderRadius: "0.375rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "rgb(14, 165, 233)" // Tailwind `cyan-500`
      : state.isFocused
      ? isDarkMode
        ? "rgb(55, 65, 81)" // Tailwind `gray-700` for dark mode
        : "rgb(243, 244, 246)" // Tailwind `gray-100` for light mode
      : "transparent",
    color: state.isSelected
      ? "#ffffff" // White text when selected
      : isDarkMode
      ? "rgb(229, 231, 235)" // Tailwind `gray-200` for dark mode
      : "rgb(31, 41, 55)", // Tailwind `gray-800` for light mode
    cursor: "pointer",
    padding: "10px",
  }),
  singleValue: (base) => ({
    ...base,
    color: isDarkMode
      ? "rgb(229, 231, 235)" // Tailwind `gray-200`
      : "rgb(31, 41, 55)", // Tailwind `gray-800`
  }),
  placeholder: (base) => ({
    ...base,
    color: "rgb(156, 163, 175)", // Tailwind `gray-400`
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "rgb(156, 163, 175)", // Tailwind `gray-400`
    "&:hover": {
      color: "rgb(14, 165, 233)", // Tailwind `cyan-500`
    },
  }),
});
