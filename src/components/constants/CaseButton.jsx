import React, { useState, useEffect } from "react";
import { caseButton } from "../styles/qrscanner";

const CaseButton = ({ initialSelectedCase, setSelectedCase }) => {
  const [selectedCaseState, setSelectedCaseState] =
    useState(initialSelectedCase);
  const cases = [
    { id: 0, name: "Case 0" },
    { id: 1, name: "Case 1" },
    { id: 2, name: "Case 2" },
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
    <div className="mt-4 text-sm text-primaryText">
      <label className="font-semibold">Case</label>
      <div className="rounded flex flex-row items-center justify-between">
        {cases.map((caseItem) => (
          <button
            type="button"
            className={`${caseButton} ${
              selectedCaseState === caseItem.id
                ? "font-semibold bg-primary text-white"
                : "font-semibold text-primary border opacity-50 border-primary"
            }`}
            key={caseItem.id}
            onClick={() => handleSelectCase(caseItem.id)}
            disabled={
              selectedCaseState !== "" && selectedCaseState !== caseItem.id
            } // Allow selection if selectedCaseState is ""
            aria-pressed={selectedCaseState === caseItem.id}
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
