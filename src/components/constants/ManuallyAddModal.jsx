import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const serialCodePattern =
  /^(T-\d{3,4}?[YC]?[C-Z]?|T-\d{4}YC|T-\d{4}YD|H-\d{3}|H[KLMN]?-\d{3}|HK-\d{3}|HL-\d{3}|HM-\d{3}|HN-\d{3}|23C\d{3}|23D\d{3}|24C\d{3}|24D\d{3}|\d{2}[C-Z]\d{3}|T-\d{3,4}[C-Z])$/;

const ManuallyAddModal = ({ isOpen, onClose, onConfirm, setWillScan }) => {
  const [manualData, setManualData] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const { t } = useTranslation("qrScanner");
  const patterns = t("eccIdInstructions.patterns", { returnObjects: true });

  if (!isOpen) return null;
  setWillScan(false);
  const handleSubmit = () => {
    if (manualData.trim() !== "") {
      if (serialCodePattern.test(manualData)) {
        onConfirm(manualData.toUpperCase());
        setManualData("");
        setAlertMessage("");
        onClose();
      } else {
        setAlertMessage(t("errors.invalidSerialCode"));
      }
    } else {
      setAlertMessage(t("errors.enterSerialCode"));
    }
  };

  const handleInputChange = (e) => {
    setManualData(e.target.value);
    if (alertMessage) {
      setAlertMessage("");
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative w-96 rounded-lg bg-white p-6 dark:bg-gray-600"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-2 top-2 rounded-full p-1"
          onClick={() => {
            setWillScan(true);
            onClose();
          }}
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
        <input
          type="text"
          value={manualData}
          onChange={handleInputChange}
          className="w-full rounded border bg-transparent p-2 text-center text-sm focus:outline-primary"
          placeholder={t("eccIdInstructions.eccIdPlaceholder")}
        />
        {alertMessage && (
          <p className="mt-2 text-center text-xs text-red-500">
            {alertMessage}
          </p>
        )}
        <button
          className="mx-auto mt-4 flex items-center justify-center rounded bg-primary px-6 py-2 text-white"
          onClick={handleSubmit}
        >
          {t("eccIdInstructions.confirm")}
        </button>
      </div>
    </div>
  );
};

ManuallyAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ManuallyAddModal;
