import React, { useState } from "react";

const StorageLocationDropdown = ({
  onLocationChange,
  options = [],
  loading,
  error,
}) => {
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleChange = (e) => {
    const newLocation = e.target.value;
    setSelectedLocation(newLocation);
    if (onLocationChange) {
      onLocationChange(newLocation); // Call the passed function
    }
  };

  return (
    <div className="flex flex-col w-full border rounded">
      {loading && <div>Loading options...</div>}
      {error && <div>Error: {error}</div>}
      <select
        value={selectedLocation}
        onChange={handleChange}
        disabled={loading || options.length === 0}
        required
        className="p-2 rounded"
      >
        <option value="">Select a location</option>
        {options.length > 0 ? (
          options.map((option) => (
            <option key={option.id} value={option.locationName}>
              {option.locationName}
            </option>
          ))
        ) : (
          <option value="" disabled>
            No options available
          </option>
        )}
      </select>
    </div>
  );
};

export default StorageLocationDropdown;
