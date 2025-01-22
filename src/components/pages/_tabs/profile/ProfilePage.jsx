import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuthentication } from "../../../../hooks/auth";
import {
  IoBugOutline,
  IoChevronForwardOutline,
  IoLanguageOutline,
  IoMoonOutline,
  IoSettingsOutline,
  IoSunnyOutline,
} from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { useTheme } from "../../../../context/theme-context";
import ToggleButton from "../../../constants/ToggleButton";
import { PiQuestion } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { t, i18n } = useTranslation("profile");
  const { logout, isLoading, user, errorMessage } = useAuthentication({
    middleware: "auth",
  });
  const { theme, toggleTheme } = useTheme();
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (errorMessage) {
      console.error("Authentication Error:", errorMessage);
    }
  }, [errorMessage]);

  const employeeFirstname = user?.first_name || "Unknown";
  const employeeLastname = user?.last_name || "User";
  const employeeIdNo = user?.user_id || "N/A";

  const profileIcon =
    `${employeeFirstname[0]}${employeeLastname[0]}`.toUpperCase();

  const handleLogout = () => {
    logout();
  };
  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
  };

  const toggleLanguage = (isJapanese) => {
    const nextLanguage = isJapanese ? "ja" : "en";
    i18n.changeLanguage(nextLanguage);
    localStorage.setItem("languageState", nextLanguage);
  };

  const version = import.meta.env.VITE_APP_VERSION;

  return (
    <div
      className={`flex min-h-screen flex-col ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-50"}`}
    >
      {/* Profile Section */}
      <div className="flex w-full flex-col items-center bg-white py-20 dark:bg-gray-700">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-to-blue text-xl font-semibold text-white">
          {profileIcon}
        </div>
        <div className="mt-2 text-lg font-semibold text-gray-600 dark:text-gray-300">
          {`${employeeFirstname} ${employeeLastname}`}
        </div>
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t("profileSection.employeeId")} {employeeIdNo}
        </div>
      </div>

      {/* Sidebar Menu Section */}
      <div className="m-5 flex flex-col rounded-md bg-white p-2 text-sm shadow-sm dark:bg-gray-700">
        <div className="text-gray-700 dark:text-gray-300">
          {/* Account Settings */}
          <div
            className="flex cursor-pointer items-center gap-3 p-4 transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            onClick={() => setIsAccountSettingsOpen((prev) => !prev)}
          >
            <IoSettingsOutline size={18} />
            <span>{t("menuSection.accountSettings.account")}</span>
          </div>
          {isAccountSettingsOpen && (
            <div className="ml-8 space-y-2 text-gray-600 dark:text-gray-400">
              <div
                className={`flex cursor-pointer items-center justify-between p-3 transition-colors duration-300 ${
                  selectedOption === "updateInfo"
                    ? "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                    : "hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-600 dark:hover:text-gray-200"
                }`}
                onClick={() => handleNavigation("/update-info")}
              >
                <span>{t("menuSection.accountSettings.updateInfo")}</span>
                <IoChevronForwardOutline size={16} />
              </div>
              <div
                className={`flex cursor-pointer items-center justify-between p-3 transition-colors duration-300 ${
                  selectedOption === "changePass"
                    ? "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                    : "hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-600 dark:hover:text-gray-200"
                }`}
                onClick={() => handleNavigation("/change-password")}
              >
                <span>{t("menuSection.accountSettings.changePass")}</span>
                <IoChevronForwardOutline size={16} />
              </div>
            </div>
          )}
        </div>
        <hr className="border-gray-200 dark:border-gray-600" />

        {/* Language Toggle */}
        <div className="flex items-center justify-between p-4 text-gray-700 transition-all dark:text-gray-300">
          <div className="flex items-center gap-3">
            <IoLanguageOutline size={18} />
            <span>
              {t("menuSection.language")}{" "}
              {i18n.language === "en" ? "English (US)" : "日本語"}
            </span>
          </div>
          <ToggleButton
            isToggledInitially={i18n.language === "ja"}
            onToggle={toggleLanguage}
          />
        </div>
        <hr className="border-gray-200 dark:border-gray-600" />

        {/* Theme Toggle */}
        <div className="flex items-center justify-between p-4 text-gray-700 transition-all dark:text-gray-300">
          <div className="flex items-center gap-3">
            {theme === "light" ? (
              <IoSunnyOutline size={18} />
            ) : (
              <IoMoonOutline size={18} />
            )}
            <span>
              {theme === "light"
                ? t("menuSection.theme.dark")
                : t("menuSection.theme.light")}
            </span>
          </div>
          <ToggleButton
            isToggledInitially={theme === "dark"}
            onToggle={toggleTheme}
          />
        </div>
        <hr className="border-gray-200 dark:border-gray-600" />

        <div
          className="flex cursor-pointer items-center gap-3 p-4 text-gray-700 transition-all duration-300 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
          onClick={() => console.log("FAQ Clicked")}
        >
          <PiQuestion size={18} />
          {t("menuSection.faq")}
        </div>
        <hr className="border-gray-200 dark:border-gray-600" />

        {/* Report Bugs Section */}
        <div
          className="flex cursor-pointer items-center gap-3 p-4 text-gray-700 transition-all duration-300 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
          onClick={() => console.log("Report Bugs Clicked")}
        >
          <IoBugOutline size={18} />
          {t("menuSection.reportBugs")}
        </div>
        <hr className="border-gray-200 dark:border-gray-600" />

        <div
          className="flex cursor-pointer items-center gap-3 p-4 text-red-500 transition-all duration-300 hover:bg-red-100 dark:hover:bg-red-800"
          onClick={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <span className="ml-2">{t("menuSection.logout")}...</span>
            </div>
          ) : (
            <>
              <TbLogout2 size={18} />
              {t("menuSection.logout")}
            </>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 lg:mt-auto lg:py-4">
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          Version: {version}
        </div>
        <div className="text-tiny text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} KHI Design and Technical Services,
          Inc. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;
