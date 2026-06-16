import React from "react";
import { t } from "i18next";
import Loader from "./Loader";

const ScannedResultActions = ({
  onPrimaryClick,
  onRemoveClick,
  text,
  className,
  disabled = false,
  loading,
  showRemoveButton = true,
}) => {
  return (
    <div className="fixed inset-x-0 bottom-0">
      <div className="flex w-full flex-col items-center justify-center gap-4 bg-gray-50 p-3 dark:bg-gray-600">
        <button
          type="button"
          className={`w-full rounded bg-cyan-to-blue px-2 py-4 font-semibold text-white focus:bg-cyan-to-blue-active ${
            disabled || loading
              ? "cursor-not-allowed opacity-60"
              : "hover:cursor-pointer"
          } ${className}`}
          onClick={onPrimaryClick}
          disabled={disabled || loading}
        >
          {loading ? <Loader label="Saving" /> : text}
        </button>

        {showRemoveButton && (
          <button
            type="button"
            className={`w-full rounded border-2 border-dashed border-red-500 px-2 py-4 font-semibold text-red-500 ${
              loading ? "cursor-not-allowed opacity-60" : "hover:cursor-pointer"
            } ${className}`}
            onClick={onRemoveClick}
            disabled={loading}
          >
            {t("common:removeThisCover")}
          </button>
        )}
      </div>
    </div>
  );
};

export default ScannedResultActions;
