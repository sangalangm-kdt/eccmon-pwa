import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select"; // Import react-select
import { FaLanguage, FaChevronDown } from "react-icons/fa"; // Import language and chevron icons
import { languagess } from "../styles/header";

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? "#00bfff" : "#ddd",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    position: "relative",
    minHeight: "38px",
    padding: "1px",
    boxShadow: state.isFocused ? "0 0 5px rgba(0, 191, 255, 0.87)" : "none",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#00bfff"
      : state.isFocused
        ? "#f0f8ff"
        : "",
    color: state.isSelected ? "#fff" : "#333",
    fontSize: "14px",
    padding: "8px 10px",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "#00bfff",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#888",
    fontSize: "14px",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#333",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#4A5568",
    "&:hover": {
      color: "#00bfff",
    },
  }),
  menu: (base) => ({
    ...base,
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    borderRadius: "0.375rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    maxHeight: "250px",
    overflowY: "auto",
    zIndex: 10,
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
    maxHeight: "250px",
    overflowY: "auto",
  }),
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [isModalOpen, setModalOpen] = useState(false);

  const languages = [
    { id: "en", label: "English (US)" },
    { id: "ja", label: "日本語" },
  ];

  const changeLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage.id);
    i18n.changeLanguage(selectedLanguage.id);
    setModalOpen(false); // Close modal after selection
  };

  return (
    <>
      {/* Inline dropdown for larger screens */}
      <div className="hidden sm:block ">
        <Select
          value={languages.find((lang) => lang.id === language)}
          onChange={changeLanguage}
          options={languages}
          getOptionLabel={(e) => e.label}
          getOptionValue={(e) => e.id}
          styles={customSelectStyles}
          className={languagess.languageSwitcher}
          placeholder="Select Language"
        />
      </div>

      {/* Modal for xs screens */}
      <div className="block sm:hidden">
        {/* Flex container for label and button */}
        <div className="flex items-center space-x-1">
          <label className="text-xs font-medium ">Select language</label>
          <label className="px-4">|</label>
          <button
            className="bg-white text-secondaryText font-medium px-4 py-2 rounded-md flex-grow flex items-center justify-between"
            onClick={() => setModalOpen(true)}
          >
            <span>
              {languages.find((lang) => lang.id === language)?.label ||
                "Select Language"}
            </span>
            {/* Chevron Icon */}
            <FaChevronDown className="textsecondaryText ml-2" />
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
            <div className="bg-white w-full rounded-t-lg p-4">
              <h2 className="text-sm font-semibold text-center mb-4">
                Select Language
              </h2>
              <ul className="space-y-2">
                {languages.map((lang) => (
                  <li
                    key={lang.id}
                    className={`p-3 rounded-md text-center text-sm cursor-pointer ${
                      lang.id === language
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => changeLanguage(lang)}
                  >
                    {lang.label}
                  </li>
                ))}
              </ul>
              <button
                className="mt-4 w-full bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
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
