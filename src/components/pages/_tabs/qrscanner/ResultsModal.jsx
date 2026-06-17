import React from "react";
import { useTranslation } from "react-i18next";
import ResponsiveSheet from "../../../constants/ResponsiveSheet";

const ResultsModal = ({
  addDisable,
  message,
  isOpen,
  onClose,
  onConfirm,
  eccId,
  hasStoragePermission,
}) => {
  const { t } = useTranslation(["qrScanner", "common"]);
  const isAddingCylinder = addDisable === false;
  const titleKey = isAddingCylinder ? "cylinderNotFound" : "serialNumberFound";
  const messageKey = message || (isAddingCylinder ? "addCylinderQuestion" : "");
  const translatedMessage = messageKey ? t(`qrScanner:${messageKey}`) : "";

  return (
    <ResponsiveSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t(`qrScanner:${titleKey}`)}
      size="sm"
      zIndex={60}
      closeLabel={t("common:close")}
      bodyClassName="p-4 sm:p-6"
    >
      <div className="flex flex-col items-center">
        <p className="w-full rounded-full bg-cyan-100 p-2 text-center text-lg font-semibold text-cyan-500 dark:bg-cyan-200">
          {eccId}
        </p>
      </div>

      {!hasStoragePermission ? (
        <>
          <p className="py-8 text-center text-sm text-red-500">
            {t("errors.noStoragePermission")}
          </p>
          <button
            type="button"
            className="min-h-[44px] w-full rounded-full bg-gray-200 px-4 py-2 transition-all duration-200 active:scale-95 dark:bg-gray-400 dark:text-gray-100"
            onClick={onClose}
          >
            {t("qrScanner:continue")}
          </button>
        </>
      ) : (
        <>
          <p className="py-8 text-center text-sm">{translatedMessage}</p>
          {addDisable === false ? (
            <div className="flex flex-row justify-between gap-2">
              <button
                type="button"
                className="min-h-[44px] w-full rounded-full bg-gray-200 px-4 py-2 transition-all duration-200 active:scale-95 dark:bg-gray-400 dark:text-gray-100"
                onClick={onClose}
              >
                {t("qrScanner:cancel")}
              </button>
              <button
                type="button"
                className="min-h-[44px] w-full rounded-full bg-primary px-4 py-2 text-white transition-all duration-200 active:scale-95"
                onClick={onConfirm}
              >
                {t("qrScanner:yes")}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="min-h-[44px] w-full rounded-full bg-gray-200 px-4 py-2 transition-all duration-200 active:scale-95"
              onClick={onClose}
            >
              {t("qrScanner:continue")}
            </button>
          )}
        </>
      )}
    </ResponsiveSheet>
  );
};

export default ResultsModal;
