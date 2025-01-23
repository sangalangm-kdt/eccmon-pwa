import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthentication } from "../../../../../hooks/auth";
import { IoArrowBack } from "react-icons/io5";

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
    if (updates?.userId === data?.user.id) {
      setModifiedBy(
        `${data?.user.firstName} ${data?.user.lastName}` || "Unknown User",
      );
    } else {
      setModifiedBy("Unknown User");
    }
  }, [data?.user, updates]);

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
          if (
            [
              "id",
              "serialNumber",
              "process",
              "location",
              "dateDone",
              "createdAt",
              "userId",
              "cycle",
            ].includes(key)
          )
            return null;

          const label = labels[key] || key;

          // Special handling for 'otherDetails' and 'isPassed'
          if (
            key === "otherDetails" &&
            value &&
            typeof value === "object" &&
            Object.keys(value).length
          ) {
            const details = Object.entries(value);
            return (
              <div key={key} className="space-y-2">
                <label className="text-md font-semibold text-gray-700 dark:text-gray-100">
                  {labels[key]}
                </label>
                <ul className="space-y-1">
                  {details.map(([detailKey, detailValue], index) => {
                    if (
                      [
                        "id",
                        "serialNumber",
                        "process",
                        "location",
                        "dateDone",
                        "createdAt",
                        "userId",
                        "cycle",
                      ].includes(detailKey)
                    )
                      return null;

                    // Handle 'isPassed' key
                    if (detailKey === "isPassed") {
                      detailValue =
                        ["Ongoing", "Yes", "No"][parseInt(detailValue, 10)] ||
                        "--";
                    }

                    return (
                      <li
                        key={detailKey}
                        className={`flex justify-between px-2 py-2 ${index !== details.length - 1 ? "border-b-0.5" : ""}`}
                      >
                        <label className="text-md font-medium text-gray-700 dark:text-gray-100">
                          {labels[detailKey] || detailKey}
                        </label>
                        <p className="text-sm text-gray-600 dark:text-gray-200">
                          {String(detailValue || "--")}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          }

          return (
            <div key={key}>
              <label className="text-md font-medium">{label}</label>
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
    <div className="dark:bg- flex min-h-screen flex-col bg-gray-100 dark:bg-gray-800">
      <div className="flex h-18 w-full items-center justify-between rounded-b-lg bg-white p-4 shadow-sm dark:bg-gray-900">
        <button
          onClick={() => navigate("/")}
          className="flex flex-row items-center gap-0.5 text-cyan-400 hover:text-blue-700"
        >
          <IoArrowBack size={20} /> <p>Back</p>
        </button>
        <div className="flex-1 text-center">
          <p className="mr-14 text-lg font-medium text-primaryText dark:text-gray-200">
            Details
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col p-6">
        <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-4 dark:bg-gray-600">
          <p className="text-2xl font-medium text-gray-700 dark:text-gray-100">
            {updates.serialNumber}
          </p>
          <label className="pt-2 text-xs text-gray-500 dark:text-gray-200">
            Serial number
          </label>
        </div>

        <div className="mt-2 flex w-full flex-col rounded-lg bg-white p-4 dark:bg-gray-600">
          {[
            { label: "Last modified by", value: modifiedBy },
            { label: "Process", value: updates.process },
            { label: "Completion date", value: updates.dateDone },
            { label: "Location", value: updates.location },
            { label: "Cycle", value: updates.cycle },
            { label: "Disposal", value: data.disposal },
            { label: "Disposal Date", value: data.disposalDate },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between border-b-0.5 px-2 py-2"
            >
              <label className="text-md font-medium text-primaryText dark:text-gray-50">
                {label}
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-100">
                {value || "--"}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-2 flex w-full flex-col rounded-lg bg-white p-4 dark:bg-gray-600">
          {renderUpdateDetails(updates)}
        </div>
      </div>
    </div>
  );
};

export default ViewInfo;
