import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IoCheckmarkDone,
  IoReturnUpBackOutline,
  IoHome,
} from "react-icons/io5";
import { getStatusColors } from "../utils/statusColors";
import { useHistory } from "../utils/HistoryContext";

const AddedOrUpdateSuccessfully = ({ data, selectedStatus }) => {
  const navigate = useNavigate();
  const { updateHistory } = useHistory(); // Access updateHistory function from context

  const handleBackToQR = () => {
    navigate("/qrscanner");
  };

  const handleGoToHome = () => {
    // Update history when navigating to home
    updateHistory(data); // Update the history in global state
    navigate("/"); // Navigate to home
  };

  // Function to render 'otherDetails' as parsed JSON
  const renderOtherDetails = (otherDetails) => {
    try {
      const parsedDetails = JSON.parse(otherDetails);
      return Object.entries(parsedDetails).map(([key, value]) => (
        <li key={key} className="flex justify-between">
          <span className="capitalize font-medium">{key}:</span>
          <span>{String(value)}</span>
        </li>
      ));
    } catch (error) {
      return <p className="text-sm text-gray-500">Invalid data format</p>;
    }
  };

  const { backgroundColor, textColor } = getStatusColors(selectedStatus);

  const renderData = (data) => {
    const seenKeys = new Set();

    return Object.entries(data).map(([key, value]) => {
      if (seenKeys.has(key)) return null;
      seenKeys.add(key);
      if (key === "otherDetails") {
        return renderOtherDetails(value);
      }
      return (
        <li key={key} className="flex justify-between">
          <span className="capitalize font-medium">{key}:</span>
          <span>{String(value)}</span>
        </li>
      );
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-80 max-w-md rounded-lg shadow-lg p-4 transform transition-transform">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-bounce">
            <IoCheckmarkDone size={32} color="#41c88b" />
          </div>
          <p className="font-medium text-green-500">Added successfully</p>

          {selectedStatus && (
            <div
              className="text-sm mt-2 p-2 rounded-full"
              style={{ backgroundColor, color: textColor }}
            >
              {selectedStatus}
            </div>
          )}

          <div className="w-full mt-4 p-2 bg-gray-100 rounded">
            <p className="text-sm font-semibold items-center flex justify-center">
              Details
            </p>
            {data ? (
              <ul className="text-sm text-gray-700">{renderData(data)}</ul>
            ) : (
              <p className="text-sm text-gray-500">No data available</p>
            )}
          </div>

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
              className="flex w-full bg-primary p-4 rounded-lg text-white hover:bg-cyan-500 transition"
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

export default AddedOrUpdateSuccessfully;
