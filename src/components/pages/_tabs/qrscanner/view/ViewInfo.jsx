import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthentication } from "../../../../../hooks/auth";

const ViewInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthentication();
  const [modifiedBy, setModifiedBy] = useState(null);
  const data = location.state?.data;
  const updates = data?.updates;

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
    userId: "Modified by",
    process: "Process",
  };

  useEffect(() => {
    // Compare the userId in updates with the userId prop or the authenticated user
    if (updates && updates.userId) {
      if (updates.userId === data?.user.id) {
        // If the userId matches, display the first name
        console.log(user?.first_name);
        setModifiedBy(
          `${data?.user.firstName} ${data?.user.lastName}` || "Unknown User",
        );
      } else {
        setModifiedBy("Unknown User");
      }
    }
  }, [data?.user.firstName, data?.user.id, data?.user.lastName, updates, user]);

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

          // Handle createdAt separately to format the date
          if (key === "createdAt" && typeof value === "string") {
            value = value.replace("T", ", ");
          }

          // If the field is in the exclusion list, skip rendering it
          const excludedKeys = [
            "id",
            "serialNumber",
            "process",
            "location",
            "dateDone",
            "createdAt",
            "userId",
            "cycle",
          ];
          if (excludedKeys.includes(key)) {
            return null;
          }

          // If the value is an object, handle nested details
          if (typeof value === "object" && value !== null) {
            if (key === "otherDetails") {
              if (!value || Object.keys(value).length === 0) {
                return null; // Don't render anything if otherDetails is null or empty
              }
              const details = Object.entries(value);
              return (
                <div key={key} className="space-y-2">
                  <label className="text-md font-semibold text-gray-700">
                    {labels[key]}
                  </label>
                  <ul className="space-y-1">
                    {details.map(([detailKey, detailValue], index) => {
                      // Skip specific fields in otherDetails
                      if (excludedKeys.includes(detailKey)) {
                        return null;
                      }
                      const isLastItem = index === details.length - 1;
                      return (
                        <li
                          key={detailKey}
                          className={`flex flex-row items-center justify-between px-2 py-2 ${!isLastItem ? "border-b-0.5" : ""}`}
                        >
                          <label className="text-md font-medium text-gray-700">
                            {labels[detailKey] || detailKey}
                          </label>{" "}
                          <p className="text-sm text-gray-600">
                            {String(detailValue || "--")}
                            {labels[detailKey] === "Case"
                              ? "Ongoing"
                              : "Failed"}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            }

            return (
              <div key={key} className="space-y-2">
                <strong className="text-lg">{label}:</strong>
                <ul className="flex flex-row">
                  {Object.entries(value).map(
                    ([nestedKey, nestedValue], index) => {
                      // Skip specific fields in nested objects
                      if (excludedKeys.includes(nestedKey)) {
                        return null;
                      }
                      const isLastItem =
                        index === Object.entries(value).length - 1;
                      return (
                        <li
                          key={nestedKey}
                          className={`flex flex-row items-center justify-between border-b-0.5 px-2 py-2 ${!isLastItem ? "" : ""}`}
                        >
                          <strong>{nestedKey}:</strong>{" "}
                          {String(nestedValue || "--")}
                        </li>
                      );
                    },
                  )}
                </ul>
              </div>
            );
          }

          // For other values, display in paragraph format
          return (
            <div key={key}>
              <label className="text-md font-medium">{label}</label>{" "}
              <p className="text-center text-gray-500">
                {String(value || "No data to display")}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <div className="flex h-18 w-full flex-row items-center justify-between rounded-b-lg bg-white p-4 shadow-sm">
        <button
          onClick={() => navigate("/")} // Navigate to home page
          className="text-cyan-400 hover:text-blue-700"
        >
          &larr; Back
        </button>
        <div className="left-3 mr-12 flex flex-1 justify-center">
          <p className="text-lg font-medium text-primaryText">Details</p>
        </div>
      </div>

      <div className="flex w-full flex-col p-6">
        <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-4">
          <p className="text-2xl font-medium text-gray-700">
            {updates.serialNumber}
          </p>
          <label className="pt-2 text-xs text-gray-500">Serial number</label>
        </div>

        <div className="mt-2 flex w-full flex-col justify-between rounded-lg bg-white p-4 text-base">
          <div className="flex flex-row items-center justify-between border-b-0.5 px-2 py-2">
            <label className="text-md font-medium text-primaryText">
              Last modified by
            </label>
            <p className="text-sm text-gray-600">{modifiedBy || "--"}</p>
          </div>
          <div className="flex flex-row items-center justify-between border-b-0.5 px-2 py-2">
            <label className="text-md font-medium text-primaryText">
              Process
            </label>
            <p className="text-sm text-gray-600">{updates.process || "--"}</p>
          </div>
          <div className="flex flex-row items-center justify-between border-b-0.5 px-2 py-2">
            <label className="text-md font-medium text-primaryText">
              Completion date
            </label>
            <p className="text-sm text-gray-600">{updates.dateDone || "--"}</p>
          </div>
          <div className="flex flex-row items-center justify-between border-b-0.5 px-2 py-2">
            <label className="text-md font-medium text-primaryText">
              Location
            </label>
            <p className="text-sm text-gray-600">{updates.location || "--"}</p>
          </div>
          <div className="flex flex-row items-center justify-between border-b-0.5 px-2 py-2">
            <label className="text-md font-medium text-primaryText">
              Cycle
            </label>
            <p className="text-sm text-gray-600">{updates.cycle || "--"}</p>
          </div>
          <div className="flex flex-row items-center justify-between border-b-0.5 px-2 py-2">
            <label className="text-md font-medium text-primaryText">
              Disposal
            </label>
            <p className="text-sm text-gray-600">{data.disposal || "--"}</p>
          </div>
          <div className="flex flex-row items-center justify-between px-2 py-2">
            <label className="text-md font-medium text-primaryText">
              Disposal Date
            </label>
            <p className="text-sm text-gray-600">{data.disposalDate || "--"}</p>
          </div>
        </div>

        {/* Render additional details section */}
        <div className="mt-2 flex w-full flex-col justify-between rounded-lg bg-white p-4">
          {renderUpdateDetails(updates)}
        </div>
      </div>
    </div>
  );
};

export default ViewInfo;
