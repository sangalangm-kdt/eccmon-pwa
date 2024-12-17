import React from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5"; // Close icon
import { IoReturnUpBackOutline, IoHome } from "react-icons/io5"; // Icons for navigation buttons

const DisposalErrorModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen) return null; // Don't render if not open

  const handleGoBack = () => {
    navigate("/qrscanner"); // Redirect back to QR scanner
  };

  const handleGoHome = () => {
    navigate("/"); // Redirect to home
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div
        className="relative bg-white rounded-lg shadow-lg w-96 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
        >
          <IoClose size={20} />
        </button>

        {/* Modal Content */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-center text-red-500">
            Error
          </h2>
          <p className="text-gray-600 mt-4 text-center">
            This cylinder has already been disposed of. It cannot be updated.
          </p>

          {/* Buttons */}
          <div className="flex flex-row w-full justify-between items-center text-sm pt-6">
            <button
              onClick={handleGoBack}
              className="flex w-full bg-gray-100 p-3 rounded-lg mr-2 items-center justify-center text-gray-600 hover:bg-gray-200 transition"
            >
              <IoReturnUpBackOutline size={16} />
              <p className="ml-2 font-medium">Go Back to QR</p>
            </button>
            <button
              onClick={handleGoHome}
              className="flex w-full bg-blue-500 p-3 rounded-lg text-white justify-center hover:bg-blue-600 transition"
            >
              <IoHome size={16} />
              <p className="ml-2 font-medium">Go to Home</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisposalErrorModal;
