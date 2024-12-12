import React from "react";
import { useNavigate } from "react-router-dom";
import { IoReturnUpBackOutline, IoHome } from "react-icons/io5";
import { GrPowerCycle } from "react-icons/gr";
import { useCylinderUpdate } from "../../hooks/cylinderUpdates";

const DismountedModal = () => {
  const navigate = useNavigate();
  const { addUpdate } = useCylinderUpdate(); // Access the last update data

  const handleBackToQR = () => {
    navigate("/qrscanner");
  };

  const handleGoToHome = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-80 max-w-md rounded-lg shadow-lg p-4 transform transition-transform">
        <div className="flex flex-col items-center justify-center">
          {/* Animated Checkmark */}
          <div className=" p-2">
            <GrPowerCycle size={32} color="#41c88b" />
          </div>
          <p className="font-medium text-green-500">Dismounted successfully.</p>

          {/* Display the last update data */}
          <div className="w-full mt-4 p-2 bg-gray-100 rounded">
            <p className="text-sm font-semibold">Cycle:</p>
            {addUpdate ? (
              <ul className="text-sm text-gray-700">
                {Object.entries(addUpdate).map(([key, value]) => (
                  <li key={key} className="flex justify-between">
                    <span className="capitalize font-medium">{key}:</span>
                    <span>{String(value)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No data available</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-row w-full justify-between items-center text-sm pt-8">
            <button
              onClick={handleBackToQR}
              className="flex w-full bg-gray-100 p-4 rounded-lg mr-3 items-center hover:bg-gray-200 transition"
            >
              <IoReturnUpBackOutline className="size-4" />
              <p className="px-2">Save storage</p>
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

export default DismountedModal;
