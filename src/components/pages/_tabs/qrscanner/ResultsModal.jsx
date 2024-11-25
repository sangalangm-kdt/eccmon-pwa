import React, { useEffect } from "react";

const ResultsModal = ({ isOpen, onClose, onConfirm, actionType }) => {
  const getMessage = () => {
    return actionType === "add"
      ? "The cylinder cover does not exist. Do you want to add it?"
      : "The cylinder cover already exists. Do you want to update the data?";
  };

  // Handle Escape key to close modal
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
  }, [onClose]); // Only depend on onClose, no need for isOpen

  if (!isOpen) return null; // Early return for rendering

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 id="modal-title" className="text-lg font-semibold">
          Confirmation
        </h2>
        <p id="modal-description">{getMessage()}</p>
        <div className="flex justify-end mt-4">
          <button
            className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600 transition"
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;
