import React, { useState } from "react";
import PropTypes from "prop-types";

// Updated regex pattern for valid serial codes
const serialCodePattern =
  /^(T-\d{3,4}(Y[C-Z])?|T-\d{4}YC|T-\d{4}YD|H-\d{3}|H[KLMN]?-\d{3}|HK-\d{3}|HL-\d{3}|HM-\d{3}|HN-\d{3}|23C\d{3}|23D\d{3}|24C\d{3}|24D\d{3}|\d{2}[C-Z]\d{3}|\d{2}[C-Z]\d{3})$/;

const ManuallyAddModal = ({ isOpen, onClose, onConfirm, setWillScan }) => {
  const [manualData, setManualData] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

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
        setAlertMessage("Please enter a valid serial code.");
      }
    } else {
      setAlertMessage("Please enter a serial code.");
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
        <label className="mb-2 block w-full text-center text-base font-semibold">
          Enter ECC ID
        </label>
        <p className="mb-1 text-center text-xs text-gray-600">
          Please enter a valid serial code matching one of the following
          patterns:
        </p>
        <ul className="mt-2 list-disc pb-2 pl-6 text-xs text-gray-500">
          <li>
            T- followed by 3 or 4 digits, optionally ending with Y and a letter
            C-Z (e.g., T-1234YC)
          </li>
          <li>
            H- optionally followed by K, L, M, N, followed by 3 digits (e.g.,
            HK-123)
          </li>
          <li>
            2 digits followed by a letter C-Z, followed by 3 digits (e.g.,
            23C123)
          </li>
        </ul>
        <input
          type="text"
          value={manualData.toUpperCase()}
          onChange={handleInputChange}
          className="w-full rounded border p-2 text-center text-sm focus:outline-primary"
          placeholder="Enter a valid serial code"
        />
        {alertMessage && (
          <p className="mt-2 text-center text-xs text-red-500">
            {alertMessage}
          </p>
        )}
        <button
          className="mx-auto mt-4 flex items-center justify-center rounded bg-primary p-2 text-white"
          onClick={handleSubmit}
        >
          Confirm
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
