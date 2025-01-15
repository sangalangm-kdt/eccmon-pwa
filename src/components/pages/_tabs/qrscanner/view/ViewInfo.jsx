import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ViewInfo = () => {
  const location = useLocation();
  const navigate = useNavigate(); // For navigation
  const data = location.state?.data;
  const updates = data?.updates;

  console.log("Data:", data);
  console.log("Updates:", updates);

  const labels = {
    serialNumber: "Serial No.",
    location: "Location",
    dateDone: "Completion Date",
    cycle: "Cycle",
    case: "Case",
    isPassed: "Status",
    orderNumber: "Order No.",
    otherDetails: "Additional Details",
    engineNumber: "Engine Number",
    operationHours: "Operation Hours",
    mountingPosition: "Mounting Position",
    user_id: "Modified by",
  };

  if (!data || !updates) {
    return (
      <div className="rounded-md bg-red-100 p-4">
        <p className="text-lg text-red-600">No updates available</p>
      </div>
    );
  }

  const renderUpdateDetails = (update) => {
    return (
      <div className="space-y-4">
        {Object.entries(update).map(([key, value]) => {
          const label = labels[key] || key;

          if (key === "createdAt" && typeof value === "string") {
            value = value.replace("T", ", ");
          }

          if (typeof value === "object" && value !== null) {
            if (key === "otherDetails") {
              return (
                <div key={key} className="space-y-2">
                  <strong className="text-lg">{labels[key]}:</strong>
                  <ul className="ml-5 list-disc space-y-1">
                    {Object.entries(value).map(([detailKey, detailValue]) => (
                      <li key={detailKey}>
                        <strong>{labels[detailKey] || detailKey}:</strong>{" "}
                        {String(detailValue)}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            return (
              <div key={key} className="space-y-2">
                <strong className="text-lg">{label}:</strong>
                <ul className="ml-5 list-disc space-y-1">
                  {Object.entries(value).map(([nestedKey, nestedValue]) => (
                    <li key={nestedKey}>
                      <strong>{nestedKey}:</strong> {String(nestedValue)}
                    </li>
                  ))}
                </ul>
              </div>
            );
          }

          return (
            <div key={key} className="text-lg">
              <strong>{label}:</strong> <span>{String(value)}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="flex h-18 w-full flex-row items-center justify-between rounded-b-md bg-white p-4 shadow-sm">
        <button
          onClick={() => navigate("/")} // Navigate to home page
          className="text-cyan-500 hover:text-blue-700"
        >
          &larr; Back
        </button>
        <div className="left-3 mr-12 flex flex-1 justify-center">
          <p className="text-lg font-medium text-primaryText">Details</p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center p-6 text-xl">
        <p>{updates.serialNumber}</p>
      </div>
    </div>
  );
};

export default ViewInfo;
