import React from "react";
import { useLocation } from "react-router-dom";

const ViewInfo = () => {
  const location = useLocation();
  const data = location.state?.data;
  const updates = data?.updates; // Updates is an object

  // Log data and updates to inspect the structure
  console.log("Data:", data);
  console.log("Updates:", updates);

  // Define a mapping of keys to labels
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

  // If there's no data or updates, show a placeholder
  if (!data || !updates) {
    return (
      <div>
        <p>No updates available</p>
      </div>
    );
  }

  // Function to render updates in a human-readable format with labels
  const renderUpdateDetails = (update) => {
    return (
      <div>
        {Object.entries(update).map(([key, value]) => {
          // Get the display label from the mapping or default to the key
          const label = labels[key] || key;

          // Format the 'createdAt' field to be more readable
          if (key === "createdAt" && typeof value === "string") {
            value = value.replace("T", ", "); // Replace T with a comma
          }

          // Check if value is an object and handle it (e.g., Additional Details)
          if (typeof value === "object" && value !== null) {
            // If it's the 'otherDetails' field, render it in a more structured way
            if (key === "otherDetails") {
              return (
                <div key={key}>
                  <strong>{labels[key]}:</strong>
                  <ul>
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

            // For any other nested object, render a generic list of its properties
            return (
              <div key={key}>
                <strong>{label}:</strong>
                <ul>
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
            <div key={key}>
              <strong>{label}:</strong> <span>{String(value)}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <h3>Update Details</h3>
      {/* Check if updates is an object and render its details */}
      {updates && Object.keys(updates).length > 0 ? (
        <div>
          <h4>Update Details</h4>
          {renderUpdateDetails(updates)}
        </div>
      ) : (
        <p>No updates to display</p>
      )}
    </div>
  );
};

export default ViewInfo;
