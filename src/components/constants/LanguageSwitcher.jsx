import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select"; // Import react-select
import { FaChevronDown } from "react-icons/fa"; // Import chevron icons

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [isModalOpen, setModalOpen] = useState(false);

  const languages = [
    { id: "ja", label: "日本語" },
    { id: "en", label: "English (US)" },
  ];

  const changeLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage.id);
    i18n.changeLanguage(selectedLanguage.id);
    setModalOpen(false); // Close modal after selection
  };

  // Get current theme (dark or light)
  const isDarkMode = document.documentElement.classList.contains("dark");

  const customSelectStyles = {
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
  };

  return (
    <>
      {/* Inline dropdown for larger screens */}
      <div className="hidden sm:block">
        <Select
          value={languages.find((lang) => lang.id === language)}
          onChange={changeLanguage}
          options={languages}
          getOptionLabel={(e) => e.label}
          getOptionValue={(e) => e.id}
          styles={customSelectStyles}
          placeholder="Select Language"
        />
      </div>

      {/* Modal for xs screens */}
      <div className="block sm:hidden">
        <div className="flex items-center space-x-1">
          <label className="text-xs font-medium">Select language</label>
          <span className="px-2">|</span>
          <button
            className="dark:bg-black-10 flex flex-grow items-center justify-between rounded-md border bg-white px-4 py-2 font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-50"
            onClick={() => setModalOpen(true)}
          >
            <span>
              {languages.find((lang) => lang.id === language)?.label ||
                "English (US)"}
            </span>
            <FaChevronDown className="ml-2 text-gray-600 dark:text-gray-50" />
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end bg-black bg-opacity-50">
            <div className="w-full rounded-t-lg bg-white p-4 dark:bg-black">
              <h2 className="text-center text-sm font-semibold text-gray-600 dark:text-gray-50">
                Select Language
              </h2>
              <ul className="mt-4 space-y-2">
                {languages.map((lang) => (
                  <li
                    key={lang.id}
                    className={`cursor-pointer rounded-md border p-3 text-center text-sm ${
                      lang.id === language
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => changeLanguage(lang)}
                  >
                    {lang.label}
                  </li>
                ))}
              </ul>
              <button
                className="mt-4 w-full rounded-md border bg-gray-300 py-2 text-gray-700 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LanguageSwitcher;
