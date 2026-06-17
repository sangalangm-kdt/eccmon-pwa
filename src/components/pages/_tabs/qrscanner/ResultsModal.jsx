import React from "react";
import { useTranslation } from "react-i18next";
import { IoSearchOutline } from "react-icons/io5";
import ResponsiveSheet from "../../../constants/ResponsiveSheet";

const secondaryButtonClassName =
  "ecc-touch-btn min-h-[44px] w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 active:scale-[0.99] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700";

const primaryButtonClassName =
  "ecc-touch-btn min-h-[44px] w-full rounded-xl bg-cyan-to-blue px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-105 active:scale-[0.99]";

const continueButtonClassName =
  "ecc-touch-btn min-h-[44px] w-full rounded-xl bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all active:scale-[0.99] dark:bg-gray-600 dark:text-gray-100";

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
  const isCylinderNotFound = addDisable === false;
  const titleKey = isCylinderNotFound ? "cylinderNotFound" : "serialNumberFound";
  const messageKey = message || (isCylinderNotFound ? "addCylinderQuestion" : "");
  const translatedMessage = messageKey ? t(`qrScanner:${messageKey}`) : "";

  const renderCylinderNotFoundContent = () => (
    <>
      <div className="flex flex-col items-center text-center">
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/35 dark:text-amber-300"
          aria-hidden="true"
        >
          <IoSearchOutline className="h-7 w-7" />
        </div>

        <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 shadow-sm dark:border-amber-800/50 dark:bg-amber-950/25">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700/80 dark:text-amber-300/80">
            ECC ID
          </p>
          <p className="mt-1 break-all text-xl font-bold tracking-tight text-amber-950 dark:text-amber-50">
            {eccId}
          </p>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-gray-800 dark:text-gray-100">
          {t("qrScanner:cylinderNotFoundMessage")}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {t("qrScanner:cylinderNotFoundSecondary")}
        </p>
      </div>

      {hasStoragePermission ? (
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row">
          <button
            type="button"
            className={secondaryButtonClassName}
            onClick={onClose}
          >
            {t("qrScanner:cancel")}
          </button>
          <button
            type="button"
            className={primaryButtonClassName}
            onClick={onConfirm}
          >
            {t("qrScanner:registerNewCylinder")}
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={`${continueButtonClassName} mt-6`}
          onClick={onClose}
        >
          {t("qrScanner:continue")}
        </button>
      )}
    </>
  );

  const renderSerialFoundContent = () => (
    <>
      <div className="flex flex-col items-center">
        <p className="w-full rounded-full bg-cyan-100 p-2 text-center text-lg font-semibold text-cyan-500 dark:bg-cyan-200">
          {eccId}
        </p>
      </div>

      <p className="py-8 text-center text-sm">{translatedMessage}</p>

      <button
        type="button"
        className={continueButtonClassName}
        onClick={onClose}
      >
        {t("qrScanner:continue")}
      </button>
    </>
  );

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
      {isCylinderNotFound
        ? renderCylinderNotFoundContent()
        : renderSerialFoundContent()}
    </ResponsiveSheet>
  );
};

export default ResultsModal;
