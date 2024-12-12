import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const ButtonYesOrNo = ({ passed, setPassed, disabled }) => {
  const { t } = useTranslation();

  const handleButtonClick = (value) => {
    setPassed(value);
  };

  return (
    <div>
      <div className="flex flex-row w-full justify-between items-center border rounded-full p-1 text-sm text-primaryText">
        <button
          className={`p-2 grow rounded-full transition-colors duration-300 ${
            passed === 1 ? "bg-green-400 text-white" : "bg-white"
          }`}
          type="button"
          onClick={() => handleButtonClick(1)}
          disabled={disabled}
        >
          {t("common:yes")}
        </button>
        <button
          type="button"
          className={`p-2 grow rounded-full transition-colors duration-300 ${
            passed === 2
              ? "bg-red-400 text-white" // For normal case, keep it red
              : "bg-white"
          }`}
          onClick={() => handleButtonClick(0)}
          disabled={disabled}
        >
          {t("common:no")}
        </button>
      </div>
    </div>
  );
};

export default ButtonYesOrNo;
