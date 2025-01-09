import React, { useState } from "react";
import PropTypes from "prop-types";

const ManuallyAddModal = ({ isOpen, onClose, onConfirm }) => {
  const [manualData, setManualData] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (manualData.trim() !== "") {
      onConfirm(manualData.toUpperCase());
      setManualData(""); // Reset the input field after submission
      setAlertMessage("");
      onClose();
    } else {
      setAlertMessage("Please enter a valid serial code.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2  p-1 rounded-full"
          onClick={onClose}
        >
          x
        </button>
        <label className="block mb-2 text-center">Enter ECC ID</label>

        <input
          type="text"
          value={manualData}
          onChange={(e) => setManualData(e.target.value)}
          className="border p-2 w-full rounded  focus:outline-primary"
        />
        {alertMessage && (
          <p className="text-red-500 mt-2 text-xs">{alertMessage}</p>
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
