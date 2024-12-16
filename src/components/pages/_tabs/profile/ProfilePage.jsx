import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthentication } from "../../../../hooks/auth";
import { FaCog, FaLanguage, FaQuestionCircle } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { IoLanguage } from "react-icons/io5";

const LanguageSwitcher = ({ closeFullscreen }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const languages = [
    { id: "en", label: "English (US)" },
    { id: "ja", label: "日本語" },
  ];

  const changeLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
    if (closeFullscreen) closeFullscreen(); // Close fullscreen after selection
  };

  return (
    <div className="flex flex-col w-full bg-white p-4 ">
      <h2>Select language</h2>
      <div className="flex flex-col gap-4">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => changeLanguage(lang.id)}
            className={`p-3 rounded text-lg font-medium ${
              language === lang.id
                ? "bg-primary text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { t } = useTranslation("common");
  const { logout } = useAuthentication({ middleware: "auth" });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="bg-cyan-to-blue w-full h-52 relative">
        <div className="flex-col text-white font-semibold w-full p-4 text-lg">
          Profile
        </div>
      </div>

      {/* Sidebar Menu Section */}
      <div className="bg-white w-full p-4 flex flex-col gap-6">
        <button
          type="button"
          className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded"
          onClick={openFullscreen}
        >
          <IoLanguage />
          Language
        </button>
        <button
          type="button"
          className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          <FaCog />
          Settings
        </button>
        <button
          type="button"
          className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          <FaQuestionCircle />
          FAQ
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 p-2 text-red-500 hover:bg-red-100 rounded"
        >
          <TbLogout2 />
          Logout
        </button>
      </div>

      {/* Fullscreen Language Switcher */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-96 h-96 p-4 rounded-lg shadow-lg">
            <button
              className="absolute top-4 right-4 text-black text-xl"
              onClick={closeFullscreen}
            >
              ✕
            </button>
            <LanguageSwitcher closeFullscreen={closeFullscreen} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
