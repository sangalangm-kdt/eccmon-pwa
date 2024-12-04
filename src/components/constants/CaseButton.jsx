import React, { useState } from "react";
import { caseButton } from "../styles/qrscanner";

const CaseButton = () => {
  const [selectedCase, setSelectedCase] = useState("");
  const cases = ["Case 00", "Case 01", "Case 02"];
  return (
    <div className="mt-4 text-sm text-primaryText">
      <label className="font-semibold">Case</label>
      <div className="rounded flex flex-row items-center justify-center">
        {cases.map((caseName, index) => (
          <button
            type="button"
            className={caseButton}
            key={index}
            onClick={() => setSelectedCase(caseName)}
          >
            {caseName}
          </button>
        ))}
      </div>
      <input
        type="text"
        className="importField"
        value={selectedCase}
        readOnly
        style={{ display: "none" }}
      />
    </div>
  );
};

export default CaseButton;
