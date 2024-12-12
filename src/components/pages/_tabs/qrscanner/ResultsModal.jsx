import React, { useEffect } from "react";

const ResultsModal = ({ isOpen, onClose, onConfirm, eccId }) => {
  const message = "The cylinder cover does not exist. Do you want to add it?";

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
  }, [onClose]);

  if (!isOpen) return null; // Early return for rendering

  return (
    <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50">
      <div
        className={`bg-white w-full rounded-t-lg shadow-lg p-6 transform transition-transform ${
          isOpen ? "animate-slideUp" : "animate-slideDown"
        }`}
      >
        <div className="flex flex-col items-center ">
          <p className="text-sm p-1">Serial number found</p>
          <p className="text-lg font-semibold w-full text-cyan-500 rounded-full p-2 bg-cyan-100 text-center">
            {eccId}
          </p>
        </div>

        <p className="text-center text-sm py-10">{message}</p>

        <div className="flex flex-row justify-between mt-4">
          <button
            className="mr-2 px-4 py-2 bg-gray-200 rounded-full w-full "
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded-full transition w-full"
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
