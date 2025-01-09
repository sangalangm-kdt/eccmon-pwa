import React, { useState } from "react";
import PropTypes from "prop-types";

// Updated regex pattern for valid serial codes
const serialCodePattern =
  /^(T-\d{3,4}(Y[C-Z])?|T-\d{4}YC|T-\d{4}YD|H-\d{3}|H[KLMN]?-\d{3}|HK-\d{3}|HL-\d{3}|HM-\d{3}|HN-\d{3}|23C\d{3}|23D\d{3}|24C\d{3}|24D\d{3}|\d{2}[C-Z]\d{3}|\d{2}[C-Z]\d{3})$/;

const ManuallyAddModal = ({ isOpen, onClose, onConfirm, setWillScan }) => {
  const [manualData, setManualData] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  if (!isOpen) return null;

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
        className="bg-white p-6 rounded-lg relative w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 p-1 rounded-full"
          onClick={onClose}
        >
          x
        </button>
        <label className="block mb-2 text-center w-full font-semibold text-base">
          Enter ECC ID
        </label>
        <p className="text-xs mb-1 text-gray-600 text-center">
          Please enter a valid serial code matching one of the following
          patterns:
        </p>
        <ul className="list-disc pl-6 mt-2 text-xs text-gray-500 pb-2">
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
          className="border p-2 w-full rounded focus:outline-primary text-sm text-center"
          placeholder="Enter a valid serial code"
        />
        {alertMessage && (
          <p className="text-red-500 mt-2 text-xs text-center">
            {alertMessage}
          </p>
        )}
        <button
          className="mt-4 bg-primary text-white p-2 rounded flex items-center justify-center mx-auto"
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
