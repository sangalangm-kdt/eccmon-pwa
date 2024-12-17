import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoReturnUpBackOutline, IoHome, IoClose } from "react-icons/io5"; // Add IoClose for close icon
import { GrPowerCycle } from "react-icons/gr";

const CycleModal = ({ selectedStatus, data, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const cylinderData = location.state?.data;

  const cycle =
    cylinderData?.status === "Dismounted" && selectedStatus === "Storage"
      ? +data?.cycle + 1
      : +data?.cycle;

  const handleBackToQR = () => {
    navigate("/qrscanner");
  };

  const handleGoToHome = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300">
      <div className="relative bg-white w-80 max-w-md rounded-lg shadow-lg p-6 transform transition-all duration-500">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
        >
          <IoClose size={20} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center justify-center">
          {/* Icon and Title */}
          <div className="p-2">
            <GrPowerCycle size={32} color="#41c88b" />
          </div>
          <p className="font-medium text-green-500 text-lg">Current Cycle</p>

          {/* Cycle Display */}
          <div className="w-full mt-4 py-3 bg-gray-100 rounded-lg text-center shadow-inner">
            <p className="text-lg font-bold text-gray-700">{cycle}</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-row w-full justify-between items-center text-sm pt-6">
            <button
              onClick={handleBackToQR}
              className="flex w-full bg-gray-100 p-3 rounded-lg mr-2 items-center justify-center text-gray-600 hover:bg-gray-200 transition"
            >
              <IoReturnUpBackOutline size={16} />
              <p className="ml-2 font-medium">Back to QR</p>
            </button>
            <button
              onClick={handleGoToHome}
              className="flex w-full bg-blue-500 p-3 rounded-lg text-white justify-center hover:bg-blue-600 transition"
            >
              <IoHome size={16} />
              <p className="ml-2 font-medium">Go to home</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleModal;
