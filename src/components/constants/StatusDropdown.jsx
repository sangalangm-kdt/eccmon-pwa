import React from "react";

const StatusDropdown = ({
  options = [],
  selectedValue,
  onChange,
  disabled,
}) => {
  const isDisabled = disabled; // Change logic to only depend on the disabled prop

  if (options.length === 0) {
    return (
      <select id="status-select" disabled className="p-2 border rounded">
        <option value="">No options available</option>
      </select>
    );
  }

  return (
    <select
      id="status-select"
      value={selectedValue || ""} // Ensure selectedValue is passed correctly here
      onChange={(e) => onChange(e.target.value)}
      disabled={isDisabled} // Now this will only depend on the disabled prop
      className="p-2 border rounded"
    >
      <option value="">Select a status</option>
      {options.map((option) => (
        <option key={option.id} value={option.cylinderStatus}>
          {option.cylinderStatus}
        </option>
      ))}
    </select>
  );
};

export default StatusDropdown;
