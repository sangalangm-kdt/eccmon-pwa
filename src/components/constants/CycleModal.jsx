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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="relative w-80 max-w-md transform rounded-lg bg-white p-6 shadow-lg transition-all duration-500 dark:bg-gray-600">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-400 transition hover:text-gray-600"
        >
          <IoClose size={20} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center justify-center">
          {/* Icon and Title */}
          <div className="p-2">
            <GrPowerCycle size={32} color="#41c88b" />
          </div>
          <p className="text-lg font-medium text-green-500">Current Cycle</p>

          {/* Cycle Display */}
          <div className="mt-4 w-full rounded-lg bg-gray-100 py-2 text-center shadow-inner dark:bg-gray-700">
            <p className="text-lg font-bold text-gray-700 dark:text-gray-200">
              {cycle}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex w-full flex-row items-center justify-between pt-6 text-sm">
            <button
              onClick={handleBackToQR}
              className="mr-2 flex w-full items-center justify-center rounded-lg bg-gray-100 p-3 text-gray-600 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100"
            >
              <IoReturnUpBackOutline size={16} />
              <p className="ml-2 font-medium">Back to QR</p>
            </button>
            <button
              onClick={handleGoToHome}
              className="flex w-full justify-center rounded-lg bg-primary p-3 text-white transition hover:bg-cyan-500"
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
