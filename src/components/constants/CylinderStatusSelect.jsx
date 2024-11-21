import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCylinderStatus } from "../../features/status/statusSlice";
import StatusDropdown from "./StatusDropdown";

export const CylinderStatusSelect = ({ onStatusChange, scannedCode }) => {
  const dispatch = useDispatch();

  // Get cylinder status options from Redux store
  const cylinderStatusOptions = useSelector(
    (state) => state.status.cylinderStatusOptions,
  );
  const status = useSelector((state) => state.status.status);
  console.log("statuss:", status);

  // Local state for selected status
  const [selectedStatus, setSelectedStatus] = useState("");

  // Fetch cylinder status options when the component mounts (or status is idle)
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCylinderStatus());
    }
  }, [status, dispatch]);

  // Sync selected status with existing cylinder status from scanned code
  useEffect(() => {
    if (scannedCode?.cylinderStatus) {
      setSelectedStatus(scannedCode.cylinderStatus);
    } else {
      setSelectedStatus(""); // Reset if no options
    }
  }, [scannedCode, cylinderStatusOptions]);

  const handleSelectChange = (newStatus) => {
    setSelectedStatus(newStatus); // Update local state
    onStatusChange(newStatus); // Pass selected status to parent component
  };

  const isLoading = status === "loading"; // Check if loading
  const hasOptions = cylinderStatusOptions.length > 0; // Check if options are available

  return (
    <div className="flex flex-col w-full">
      <label htmlFor="status-select">Status</label>
      <StatusDropdown
        options={cylinderStatusOptions}
        selectedValue={selectedStatus} // Use local state for selected status
        onChange={handleSelectChange}
        disabled={isLoading} // Disable only if loading
      />
      {!hasOptions && !isLoading && (
        <p className="text-gray-500">No options available</p> // Optional message
      )}
    </div>
  );
};
