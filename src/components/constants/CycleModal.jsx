import React from "react";
import { useNavigate } from "react-router-dom";
import { IoReturnUpBackOutline, IoHome } from "react-icons/io5";
import { GrPowerCycle } from "react-icons/gr";

const CycleModal = ({ cycle, onClose }) => {
  const navigate = useNavigate();

  const handleBackToQR = () => {
    navigate("/qrscanner");
    onClose();
  };

  const handleGoToHome = () => {
    navigate("/");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-80 max-w-md rounded-lg shadow-lg p-4 transform transition-transform">
        <div className="flex flex-col items-center justify-center">
          {/* Animated Checkmark */}
          <div className="p-2">
            <GrPowerCycle size={32} color="#41c88b" />
          </div>
          <p className="font-medium text-green-500">Cycle Completed</p>

          {/* Display the current cycle */}
          <div className="w-full mt-4 p-2 bg-gray-100 rounded">
            <p className="text-sm font-semibold">Current Cycle: {cycle}</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-row w-full justify-between items-center text-sm pt-8">
            <button
              onClick={handleBackToQR}
              className="flex w-full bg-gray-100 p-4 rounded-lg mr-3 items-center hover:bg-gray-200 transition"
            >
              <IoReturnUpBackOutline className="size-4" />
              <p className="px-2">Back to QR</p>
            </button>
            <button
              onClick={handleGoToHome}
              className="flex w-full bg-primary p-4 rounded-lg text-white hover:bg-blue-600 transition"
            >
              <IoHome className="size-4" />
              <p className="px-1">Go to home</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleModal;
