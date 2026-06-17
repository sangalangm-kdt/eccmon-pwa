import React from "react";
import Loader from "./Loader";
import { useTranslation } from "react-i18next";

const SaveButton = ({
  onClick,
  text,
  className,
  type = "button",
  loading,
  disabled,
  helperText,
}) => {
  const { t } = useTranslation("common");

  return (
    <div className="fixed inset-x-0 bottom-0">
      <div className="flex w-full flex-col items-center justify-center bg-gray-50 p-3 dark:bg-gray-600">
        {helperText && disabled && (
          <p className="mb-2 w-full px-1 text-center text-xs text-amber-700 dark:text-amber-300">
            {helperText}
          </p>
        )}
        <button
          type={type}
          className={`ecc-touch-btn w-full rounded px-2 py-4 font-semibold text-white focus:bg-cyan-to-blue-active ${
            disabled || loading
              ? "cursor-not-allowed bg-gray-300"
              : "bg-cyan-to-blue hover:cursor-pointer"
          } ${className || ""}`}
          onClick={onClick}
          disabled={disabled || loading}
        >
          {loading ? <Loader label={t("saving")} /> : text}
        </button>
      </div>
    </div>
  );
};

export default SaveButton;
