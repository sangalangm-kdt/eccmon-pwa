import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Select from "react-select"; // Import react-select
import { FaChevronDown } from "react-icons/fa";
import ResponsiveSheet from "./ResponsiveSheet";

const LanguageSwitcher = ({ variant = "default" }) => {
  const { t, i18n } = useTranslation("common");
  const [language, setLanguage] = useState(i18n.language);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language]);

  const languages = [
    { id: "ja", label: "日本語", shortLabel: "日本語" },
    { id: "en", label: "English (US)", shortLabel: "EN" },
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

  if (variant === "guest") {
    return (
      <div
        className="inline-flex items-center gap-0.5 rounded-full p-0.5 md:gap-1 md:border md:border-gray-200 md:bg-gray-50 md:p-1 md:shadow-sm dark:md:border-gray-600 dark:md:bg-gray-800"
        role="group"
        aria-label={t("language.select")}
      >
        {languages.map((lang) => {
          const isActive = language === lang.id;

          return (
            <button
              key={lang.id}
              type="button"
              onClick={() => changeLanguage(lang)}
              className={`ecc-touch-btn min-h-[36px] rounded-full px-3 py-1.5 text-xs font-semibold transition-colors md:min-h-[40px] md:px-4 md:py-2 md:text-sm ${
                isActive
                  ? "bg-primary text-white md:shadow-sm"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
              aria-pressed={isActive}
            >
              {lang.shortLabel}
            </button>
          );
        })}
      </div>
    );
  }

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
          placeholder={t("language.select")}
        />
      </div>

      {/* Modal for xs screens */}
      <div className="block sm:hidden">
        <div className="flex items-center space-x-1">
          <label className="text-sm font-medium md:text-xs">{t("language.select")}</label>
          <span className="px-2">|</span>
          <button
            className="dark:bg-black-10 flex flex-grow items-center justify-between rounded-md border bg-white px-4 py-2 font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-50"
            onClick={() => setModalOpen(true)}
          >
            <span>
              {languages.find((lang) => lang.id === language)?.label ||
                t("language.english")}
            </span>
            <FaChevronDown className="ml-2 text-gray-600 dark:text-gray-50" />
          </button>
        </div>

        <ResponsiveSheet
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          title={t("language.select")}
          size="sm"
          zIndex={50}
          closeLabel={t("close")}
          bodyClassName="p-4"
        >
          <ul className="space-y-2">
            {languages.map((lang) => (
              <li key={lang.id}>
                <button
                  type="button"
                  className={`min-h-[44px] w-full rounded-md border p-3 text-center text-sm transition-all duration-200 active:scale-[0.99] ${
                    lang.id === language
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => changeLanguage(lang)}
                >
                  {lang.label}
                </button>
              </li>
            ))}
          </ul>
        </ResponsiveSheet>
      </div>
    </>
  );
};

LanguageSwitcher.propTypes = {
  variant: PropTypes.oneOf(["default", "guest"]),
};

export default LanguageSwitcher;
