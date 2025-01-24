import React from "react";
import { caseButton } from "../styles/qrscanner";
import { useTranslation } from "react-i18next";

const CaseButton = ({
  selectedCase,
  setSelectedCase,
  disabled,
  setDisabledProcessors,
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
    <div className="mt-4 text-primaryText">
      <label className="flex flex-row items-center justify-between text-sm font-semibold">
        <div>
          {t("qrScanner:case")} <strong className="text-red-500">*</strong>
        </div>
      </label>
      <div className="flex flex-row items-center justify-between rounded text-xs">
        {cases.map((caseItem) => (
          <button
            type="button"
            className={`${caseButton} ${
              selectedCase === caseItem.id
                ? "bg-primary font-semibold text-white transition-all duration-200 ease-in-out"
                : "border border-primary font-semibold text-primary transition-all duration-200 ease-in-out"
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
