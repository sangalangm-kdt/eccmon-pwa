import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { sections, renderSectionContent } from "./GuidelineSections.jsx";

const UserGuidelines = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("textSection");
  const [openSection, setOpenSection] = useState(null);

  const handleBackToProfile = () => navigate("/profile");
  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

  const [openSubsection, setOpenSubsection] = useState(null);

  const toggleSubsection = (subsection) =>
    setOpenSubsection(openSubsection === subsection ? null : subsection);

  return (
    <div className="flex min-h-screen flex-col justify-between">
      {/* Header */}
      <div className="fixed flex w-full items-center justify-center rounded-b-xl bg-white py-6 shadow-md dark:bg-gray-700">
        <button
          onClick={handleBackToProfile}
          className="flex items-center justify-center gap-1 rounded-full p-2"
        >
          <IoArrowBack className="text-gray-700 dark:text-gray-100" />
          <p className="text-sm text-gray-700 dark:text-gray-100">Back</p>
        </button>
        <h1 className="flex-1 text-center font-medium text-gray-700 dark:text-gray-100 xs:mr-12">
          User Guidelines
        </h1>
      </div>

      {/* Table of Contents */}
      <div className="m-4 mt-28 flex flex-grow flex-col gap-4 rounded bg-gray-50 p-6 px-4 text-sm dark:bg-gray-700">
        <h1 className="mb-2 text-center text-xl font-semibold text-gray-800 dark:text-white">
          {t("welcomeToECCMon")}
        </h1>
        <nav className="mt-1">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            Table of Contents
          </h2>
          <ul className="ml-8 mt-2 list-disc pl-0 text-gray-500">
            {sections.map((section) => (
              <li key={section} className="mb-3">
                <button
                  onClick={() => toggleSection(section)}
                  className="text-sm text-gray-600 hover:text-primary dark:text-gray-100 dark:hover:text-primary"
                >
                  {t(section)}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Section Content */}
        <section className="mt-4 flex flex-col justify-between">
          {!openSection
            ? sections.map((section) => (
                <div key={section} className="mb-8">
                  {renderSectionContent(section, t)}
                </div>
              ))
            : renderSectionContent(
                openSection,
                t,
                toggleSubsection,
                openSubsection,
              )}
        </section>
      </div>
    </div>
  );
};

export default UserGuidelines;
