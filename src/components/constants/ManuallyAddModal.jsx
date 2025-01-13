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
        className="relative w-96 rounded-lg bg-white p-6"
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
        <label className="block mb-2 text-center w-full font-semibold text-base">
          {t("eccIdInstructions.label")}
        </label>
        <p className="text-xs mb-1 text-gray-600 text-center">
          {t("eccIdInstructions.description")}
        </p>
        <ul className="list-disc pl-6 mt-2 text-xs text-gray-500 pb-2">
          {patterns.map((pattern, index) => (
            <li key={index}>{pattern}</li>
          ))}
        </ul>
        <input
          type="text"
          value={manualData.toUpperCase()}
          onChange={handleInputChange}
          className="border p-2 w-full rounded focus:outline-primary text-sm text-center"
          placeholder={t("eccIdInstructions.eccIdPlaceholder")}
        />
        {alertMessage && (
          <p className="mt-2 text-center text-xs text-red-500">
            {alertMessage}
          </p>
        )}
        <button
          className="mt-4 bg-primary text-white px-6 py-2  rounded flex items-center justify-center mx-auto"
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
