/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import { caseButton } from "../styles/qrscanner";
import { useTranslation } from "react-i18next";

const CaseButton = ({ selectedCase, setSelectedCase, disabled }) => {
  const { t } = useTranslation("qrScanner");
  const cases = [
    { id: 0, name: t("case0") },
    { id: 1, name: t("case1") },
    { id: 2, name: t("case2") },
  ];

  const handleSelectCase = (caseId) => {
    setSelectedCase(caseId); // Update internal state
  };

  return (
    <div className="mt-4 text-primaryText">
      <label className="font-semibold text-sm">
        {t("qrScanner:case")} <strong className="text-red-500">*</strong>
      </label>
      <div className="rounded flex flex-row items-center justify-between text-xs">
        {cases.map((caseItem) => (
          <button
            type="button"
            className={`${caseButton} ${
              selectedCase == caseItem.id
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
        value={selectedCase ?? ""}
        readOnly
      />
    </div>
  );
};

export default CaseButton;
