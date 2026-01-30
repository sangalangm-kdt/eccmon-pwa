import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { FaPlusCircle } from "react-icons/fa";
import { CheckCircle, Close } from "@mui/icons-material";

import InfoIcon from "@mui/icons-material/Info";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const severityUI = {
  info: { Icon: InfoIcon, className: "text-sky-400" },
  warning: { Icon: WarningAmberIcon, className: "text-amber-500" },
  error: { Icon: ErrorOutlineIcon, className: "text-red-500" },
  success: { Icon: CheckCircleOutlineIcon, className: "text-green-500" },
};

const ResultsModal = ({
  addDisable,
  message,
  severity = "info",
  isOpen,
  onClose,
  onConfirm,
  eccId,
  hasStoragePermission,
}) => {
  const { t } = useTranslation("qrScanner");

  useEffect(() => {
    const handleEscKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [onClose]);

  if (!isOpen) return null;

  const { Icon, className } = severityUI[severity] || severityUI.info;

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/60">
      <div className="w-full max-w-md animate-slideUp rounded-t-2xl bg-white px-5 pb-6 pt-4 shadow-xl dark:bg-gray-700 dark:text-gray-50">
        {/* Drag handle */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-500" />

        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <CheckCircle sx={{ fontSize: 34 }} className="text-green-500" />
          <p className="text-sm text-gray-600 dark:text-gray-200">
            {t("serialNumberFound")}
          </p>

          <div className="w-full rounded-full bg-cyan-100 py-2 text-center text-lg font-semibold text-cyan-600 dark:bg-cyan-200 dark:text-cyan-900">
            {eccId}
          </div>
        </div>

        {/* Content */}
        {!hasStoragePermission ? (
          <div className="mt-6 flex flex-col items-center gap-3 text-center">
            <ErrorOutlineIcon className="text-red-500" sx={{ fontSize: 26 }} />
            <p className="text-sm text-red-500">
              {t("errors.noStoragePermission")}
            </p>

            <button
              onClick={onClose}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-200 py-3 text-sm font-semibold dark:bg-gray-600"
            >
              <Close fontSize="small" />
              {t("close")}
            </button>
          </div>
        ) : (
          <div className="mt-6 text-center">
            {/* ✅ Severity icon + message */}
            <div className="mb-6 flex items-start justify-center gap-2">
              <Icon className={className} sx={{ fontSize: 20, mt: "2px" }} />
              <p className="text-sm text-gray-700 dark:text-gray-200">
                {message}
              </p>
            </div>

            {addDisable === false ? (
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-200 py-3 text-sm font-semibold dark:bg-gray-600"
                >
                  <Close fontSize="small" />
                  {t("cancel")}
                </button>

                <button
                  onClick={onConfirm}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white"
                >
                  <FaPlusCircle className="h-4 w-4" />
                  {t("yes")}
                </button>
              </div>
            ) : (
              <button
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-200 py-3 text-sm font-semibold dark:bg-gray-600"
              >
                <Close fontSize="small" />
                {t("qrScanner:close")}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsModal;
