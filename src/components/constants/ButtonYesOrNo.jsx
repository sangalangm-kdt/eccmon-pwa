import React from "react";
import { useTranslation } from "react-i18next";

const ButtonYesOrNo = ({ passed, setPassed, disabled }) => {
  const { t } = useTranslation();

  const handleButtonClick = (value) => {
    setPassed(passed === value ? "0" : value);
  };

  return (
    <div>
      <div className="flex w-full flex-row items-center justify-between gap-2 rounded-full border bg-white p-1 text-sm text-primaryText">
        <button
          className={`grow rounded-full p-2 transition-colors duration-300 ${
            +passed === 1 ? "bg-green-400 text-white" : "bg-white"
          }`}
          type="button"
          onClick={() => handleButtonClick(1)}
          disabled={disabled}
        >
          {t("common:yes")}
        </button>
        <div className="h-8 w-px gap-1 bg-gray-300"></div>
        <button
          type="button"
          className={`grow rounded-full p-2 transition-colors duration-300 ${
            +passed === 2
              ? "bg-red-400 text-white" // For normal case, keep it red
              : "bg-white"
          }`}
          onClick={() => handleButtonClick(2)}
          disabled={disabled}
        >
          {t("common:no")}
        </button>
      </div>
    </div>
  );
};

export default ButtonYesOrNo;
