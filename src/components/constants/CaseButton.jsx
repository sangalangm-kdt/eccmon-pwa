import React from "react";
import { caseButton } from "../styles/qrscanner";
import { useTranslation } from "react-i18next";
import { IoInformationCircleOutline } from "react-icons/io5";

const CaseButton = ({
  selectedCase,
  setSelectedCase,
  disabled,
  setDisabledProcessors,
  handleInfoIconClick,
}) => {
  const { t } = useTranslation("qrScanner");
  const cases = [
    { id: 0, name: t("case0") },
    { id: 1, name: t("case1") },
    { id: 2, name: t("case2") },
  ];

  const handleSelectCase = (caseId) => {
    // Toggle the selected case
    setSelectedCase((prevSelectedCase) =>
      prevSelectedCase === caseId ? null : caseId,
    );
  };

  return (
    <div className="mt-4 text-primaryText dark:text-gray-100">
      <label className="mb-2 flex flex-row items-center justify-between text-sm font-semibold">
        <div>
          {t("qrScanner:case")} <strong className="text-red-500">*</strong>
        </div>
        <IoInformationCircleOutline
          size={20}
          className="ml-2 cursor-pointer"
          onClick={handleInfoIconClick} // Show dialog box on click
        />
      </label>
      <div className="flex flex-row items-center justify-between gap-2 rounded text-xs">
        {cases.map((caseItem) => (
          <button
            type="button"
            className={`${caseButton} ${
              selectedCase === caseItem.id
                ? "h-12 w-full bg-primary font-semibold text-white transition-all duration-200 ease-in-out"
                : "h-12 w-full border border-primary font-semibold text-primary transition-all duration-200 ease-in-out"
            }`}
            key={caseItem.id}
            onClick={() => handleSelectCase(caseItem.id)}
            disabled={disabled}
          >
            {caseItem.name}
          </button>
        ))}
      </div>
      <input
        type="text"
        className="hidden"
        value={selectedCase ?? ""}
        readOnly
      />
    </div>
  );
};

export default CaseButton;
