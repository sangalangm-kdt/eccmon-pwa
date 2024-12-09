import React, { useState } from "react";

const StorageLocationDropdown = ({
  onLocationChange,
  options = [],
  loading,
  error,
  setProcessor,
}) => {
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleChange = (e) => {
    const newLocation = e.target.value;
    setSelectedLocation(newLocation);
    setProcessor(newLocation);
    if (onLocationChange) {
      onLocationChange(newLocation); // Call the passed function
    }
  };

  return (
    <div className="mt-2">
      <label className="text-sm text-primaryText font-semibold">
        Processor
      </label>
      <div className="flex flex-col w-full border rounded">
        {loading && <div>Loading options...</div>}
        {error && <div>Error: {error}</div>}
        <select
          value={selectedLocation}
          onChange={handleChange}
          disabled={loading || options.length === 0}
          className="p-2 rounded focus:ring-primary text-sm text-primaryText"
        >
          <option value="">Select a location</option>
          {options.length > 0 ? (
            options.map((option) => (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No options available
            </option>
          )}
        </select>
      </div>
    </div>
  );
};

export default StorageLocationDropdown;
