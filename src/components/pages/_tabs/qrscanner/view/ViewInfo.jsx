import React from "react";
import { useLocation } from "react-router-dom";

const ViewInfo = () => {
  const location = useLocation();
  const data = location.state?.data;

  // Function to render the data
  const renderData = (data) => {
    const seenKeys = new Set();

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
            <li key={subKey}>
              <span>{labels[subKey] || subKey}:</span>
              <span>{String(subValue)}</span>
            </li>
          ));
        } catch (error) {
          return <p>Invalid data format</p>;
        }
      }

      return (
        <li key={key}>
          <span>{displayKey}:</span>
          <span>{String(value)}</span>
        </li>
      );
    });
  };

  // If there's no data or it's empty, show a placeholder
  if (!data) {
    return (
      <div>
        <div>
          <p>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <p>Data Details</p>

        <div>
          <p>Details</p>
          {data ? <ul>{renderData(data)}</ul> : <p>No data available</p>}
        </div>
      </div>
    </div>
  );
};

export default ViewInfo;
