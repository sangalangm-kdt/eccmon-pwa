import React, { useState, useEffect } from "react";
import { caseButton } from "../styles/qrscanner";
import { useTranslation } from "react-i18next";

const CaseButton = ({ initialSelectedCase, setSelectedCase, disabled }) => {
  const [selectedCaseState, setSelectedCaseState] =
    useState(initialSelectedCase);
  const { t } = useTranslation("qrScanner");
  const cases = [
    { id: 0, name: t("case0") },
    { id: 1, name: t("case1") },
    { id: 2, name: t("case2") },
  ];

  useEffect(() => {
    // Update the internal state when the initialSelectedCase changes
    if (initialSelectedCase !== null) {
      setSelectedCaseState(initialSelectedCase);
    }
  }, [initialSelectedCase]);

  const handleSelectCase = (caseId) => {
    setSelectedCase(caseId); // Notify parent component of the selected case
    setSelectedCaseState(caseId); // Update internal state
  };

  return (
    <div className="mt-4 text-xs text-primaryText">
      <label className="font-semibold">{t("qrScanner:case")}</label>
      <div className="rounded flex flex-row items-center justify-between">
        {cases.map((caseItem) => (
          <button
            type="button"
            className={`${caseButton} ${
              selectedCaseState === caseItem.id
                ? "font-semibold bg-primary text-white"
                : "font-semibold text-primary border  border-primary"
            }`}
            key={caseItem.id}
            onClick={() => handleSelectCase(caseItem.id)}
            disabled={disabled}
          >
            {caseItem.name}
          </button>
        ))}
      </div>
      {/* Hidden field to hold the selected case value */}
      <input
        type="text"
        className="hidden"
        value={selectedCaseState}
        readOnly
      />
    </div>
  );
};

export default CaseButton;
