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
    const { logout, isLoading } = useAuthentication({ middleware: "auth" });
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
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <svg
                                aria-hidden="true"
                                className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                            <span className="ms-2">Logging out</span>
                        </div>
                    ) : (
                        <>
                            <TbLogout2 />
                            Logout
                        </>
                    )}
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
