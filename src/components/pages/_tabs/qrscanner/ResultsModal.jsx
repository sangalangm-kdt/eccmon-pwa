import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const ResultsModal = ({
  addDisable,
  message,
  isOpen,
  onClose,
  onConfirm,
  eccId,
}) => {
  // const message = "The cylinder cover does not exist. Do you want to add it?";
  // Handle Escape key to close modal
  const { t } = useTranslation("qrScanner");
  const translatedMessage = message;

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Add event listener for keydown
    window.addEventListener("keydown", handleEscKey);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  if (!isOpen) return null; // Early return for rendering

  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center bg-black bg-opacity-50">
      <div
        className={`w-full transform rounded-t-lg bg-white p-6 shadow-lg transition-transform dark:bg-gray-600 dark:text-gray-50 ${
          isOpen ? "animate-slideUp" : "animate-slideDown"
        }`}
      >
        <div className="flex flex-col items-center">
          <p className="p-1 text-sm">{t("serialNumberFound")}</p>
          <p className="w-full rounded-full bg-cyan-100 p-2 text-center text-lg font-semibold text-cyan-500 dark:bg-cyan-200">
            {eccId}
          </p>
        </div>

        <p className="py-10 text-center text-sm">{translatedMessage}</p>
        {addDisable === false ? (
          <div className="mt-4 flex flex-row justify-between">
            <button
              className="mr-2 w-full rounded-full bg-gray-200 px-4 py-2 dark:bg-gray-400 dark:text-gray-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="w-full rounded-full bg-primary px-4 py-2 text-white transition"
              onClick={onConfirm}
            >
              Yes
            </button>
          </div>
        ) : (
          <button
            className="mr-2 w-full rounded-full bg-gray-200 px-4 py-2"
            onClick={onClose}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultsModal;
