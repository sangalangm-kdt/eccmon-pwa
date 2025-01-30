import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IoCheckmarkDone,
  IoReturnUpBackOutline,
  IoHome,
} from "react-icons/io5";
import { getStatusColors } from "../utils/statusColors";
import { useHistory } from "../utils/HistoryContext";
import { useTranslation } from "react-i18next";

const AddedOrUpdateSuccessfully = ({ data, selectedStatus }) => {
  const navigate = useNavigate();
  const { updateHistory } = useHistory(); // Access updateHistory function from context
  const { t } = useTranslation();

  const handleBackToQR = () => {
    navigate("/qrscanner");
  };

  const handleGoToHome = () => {
    // Update history when navigating to home
    updateHistory(data); // Update the history in global state
    navigate("/"); // Navigate to home
  };

  // Get dynamic background and text colors from status
  const { bgColor, textColor } = getStatusColors(selectedStatus);

  const renderData = (data) => {
    const seenKeys = new Set();

    // Define a mapping of keys to labels
    const labels = {
      serialNumber: t("qrScanner:label.serialNo"),
      location: t("qrScanner:label.location"),
      dateDone: t("qrScanner:label.completionDate"),
      cycle: t("qrScanner:label.cycle"),
      case: t("qrScanner:label.case"),
      isPassed: t("qrScanner:label.status"),
      orderNumber: t("qrScanner:label.orderNo"),
      otherDetails: t("qrScanner:label.additionalInfo"),
      engineNumber: t("qrScanner:label.engineNo"),
      operationHours: t("qrScanner:label.operatingHours"),
      mountingPosition: t("qrScanner:label.mountingPosition"),
    };

    return Object.entries(data).map(([key, value]) => {
      if (seenKeys.has(key)) return null;
      seenKeys.add(key);

      // Get the label for the key, default to the key if no label is defined
      const displayKey = labels[key] || key;

      // Format the dateDone field
      if (key === "dateDone" && typeof value === "string") {
        value = value.replace("T", ", "); // Replace T with a space
      }

      if (key === "otherDetails") {
        try {
          const parsedDetails = JSON.parse(value);
          // Check and update isPassed value based on its initial value
          if (parsedDetails.isPassed !== "") {
            if (+parsedDetails.isPassed === 1) {
              parsedDetails.isPassed = "Yes";
            } else if (+parsedDetails.isPassed === 2) {
              parsedDetails.isPassed = "No";
            } else if (+parsedDetails.isPassed === 0) {
              parsedDetails.isPassed = "Ongoing";
            }
          }

          return Object.entries(parsedDetails).map(([subKey, subValue]) => (
            <li key={subKey} className="flex justify-between">
              <span className="font-medium capitalize">
                {labels[subKey] || subKey}:
              </span>
              <span>{String(subValue)}</span>
            </li>
          ));
        } catch (error) {
          return <p className="text-sm text-gray-500">Invalid data format</p>;
        }
      }

      return (
        <li key={key} className="flex justify-between">
          <span className="font-medium capitalize">{displayKey}:</span>
          <span>{String(value)}</span>
        </li>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-80 max-w-md transform rounded-lg bg-white p-4 shadow-lg transition-transform dark:bg-gray-600">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-bounce">
            <IoCheckmarkDone size={32} color="#41c88b" />
          </div>
          <p className="font-medium text-green-500">Updated successfully</p>

          {selectedStatus && (
            <div
              className={`mt-2 rounded-full p-2 text-sm font-medium ${textColor} ${bgColor}`}
            >
              {selectedStatus}
            </div>
          )}

          <div className="mt-4 w-full rounded bg-gray-100 p-2 dark:bg-gray-500">
            <p className="flex items-center justify-center text-sm font-semibold">
              Details
            </p>
            {data ? (
              <ul className="text-sm text-gray-700 dark:text-gray-200">
                {renderData(data)}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No data available</p>
            )}
          </div>

          <div className="flex w-full flex-row items-center justify-between pt-8 text-sm">
            <button
              onClick={handleBackToQR}
              className="mr-3 flex w-full items-center rounded-lg bg-gray-100 p-4 transition hover:bg-gray-200 dark:bg-gray-500"
            >
              <IoReturnUpBackOutline className="size-4" />
              <p className="px-2">Back to QR</p>
            </button>
            <button
              onClick={handleGoToHome}
              className="flex w-full rounded-lg bg-primary p-4 text-white transition hover:bg-cyan-500"
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
