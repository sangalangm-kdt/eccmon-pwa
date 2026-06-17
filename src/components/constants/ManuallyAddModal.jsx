import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const serialCodePattern =
  /^(T-\d{3,4}?[YC]?[C-Z]?|T-\d{4}YC|T-\d{4}YD|H-\d{3}|H[KLMN]?-\d{3}|HK-\d{3}|HL-\d{3}|HM-\d{3}|HN-\d{3}|23C\d{3}|23D\d{3}|24C\d{3}|24D\d{3}|\d{2}[C-Z]\d{3}|T-\d{3,4}[C-Z])$/;

const ManuallyAddModal = ({
  isOpen,
  onClose,
  onConfirm,
  setWillScan,
  isLoading = false,
}) => {
  const [manualData, setManualData] = useState("");
  const [alertKey, setAlertKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation("qrScanner");
  const patterns = t("eccIdInstructions.patterns", { returnObjects: true });
  const isBusy = isLoading || isSubmitting;

  useEffect(() => {
    if (isOpen) {
      setWillScan(false);
    } else {
      setIsSubmitting(false);
    }
  }, [isOpen, setWillScan]);

  useEffect(() => {
    if (!isLoading) {
      setIsSubmitting(false);
    }
  }, [isLoading]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (isBusy) return;

    if (manualData.trim() !== "") {
      if (serialCodePattern.test(manualData)) {
        setIsSubmitting(true);
        setAlertKey("");

        try {
          await onConfirm(manualData);
          setManualData("");
          setAlertKey("");
          onClose();
        } catch {
          setIsSubmitting(false);
          setAlertKey("errors.checkSerial");
        }
      } else {
        setAlertKey("errors.invalidSerialCode");
      }
    } else {
      setAlertKey("errors.enterSerialCode");
    }
  };

  const handleInputChange = (e) => {
    if (isBusy) return;

    const uppercaseValue = e.target.value.toUpperCase();
    setManualData(uppercaseValue.trim());
    if (alertKey) {
      setAlertKey("");
    }
  };

  const handleClose = () => {
    if (isBusy) return;
    setWillScan(true);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div
        className="relative w-96 rounded-lg bg-white p-6 dark:bg-gray-600"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-2 top-2 rounded-full p-1 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleClose}
          disabled={isBusy}
          aria-label={t("eccIdInstructions.label")}
        >
          x
        </button>
        <label className="mb-2 block w-full text-center text-base font-semibold">
          {t("eccIdInstructions.label")}
        </label>
        <p className="mb-1 text-center text-xs text-gray-600 dark:text-gray-50">
          {t("eccIdInstructions.description")}
        </p>
        <ul className="mt-2 list-disc pb-2 pl-6 text-xs text-gray-500 dark:text-gray-300">
          {patterns.map((pattern, index) => (
            <li key={index}>{pattern}</li>
          ))}
        </ul>

        <div className="mt-2">
          <input
            type="text"
            value={manualData}
            onChange={handleInputChange}
            className={`w-full rounded border bg-transparent p-2 text-center text-sm focus:outline-primary ${
              isBusy ? "cursor-not-allowed opacity-60" : ""
            }`}
            placeholder={t("eccIdInstructions.eccIdPlaceholder")}
            disabled={isBusy}
            autoComplete="off"
            spellCheck={false}
            aria-busy={isBusy}
          />
          <div
            className="mt-1 h-0.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-500"
            aria-hidden={!isBusy}
          >
            {isBusy ? (
              <div className="h-full w-1/3 rounded-full bg-primary animate-serial-progress" />
            ) : null}
          </div>
          <p
            className={`mt-2 text-center text-xs text-gray-500 dark:text-gray-300 ${
              isBusy ? "visible" : "invisible"
            }`}
            role="status"
            aria-live="polite"
          >
            {t("checkingCylinder")}
          </p>
        </div>

        {alertKey && !isBusy ? (
          <p className="mt-2 text-center text-xs text-red-500" role="alert">
            {t(alertKey)}
          </p>
        ) : null}

        <button
          type="button"
          className="mx-auto mt-4 flex items-center justify-center rounded bg-primary px-6 py-2 text-white disabled:cursor-not-allowed disabled:opacity-70"
          onClick={handleSubmit}
          disabled={isBusy}
        >
          {isBusy ? t("checking") : t("eccIdInstructions.confirm")}
        </button>
      </div>
    </div>
  );
};

ManuallyAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  setWillScan: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default ManuallyAddModal;
