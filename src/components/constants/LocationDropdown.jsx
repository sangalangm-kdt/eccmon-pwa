import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { inputContainerClass } from "../styles/components";

const StorageLocationDropdown = ({
  onLocationChange,
  options = [],
  loading,
  error,
}) => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const { t } = useTranslation();

  const handleChange = (e) => {
    const newLocation = e.target.value;
    setSelectedLocation(newLocation);
    if (onLocationChange) {
      onLocationChange(newLocation); // Call the passed function
    }
  };

  return (
    <div className="mt-2">
      <div className="flex flex-col w-full border rounded">
        {loading && <div>Loading options...</div>}
        {error && <div>Error: {error}</div>}
        <select
          value={selectedLocation}
          onChange={handleChange}
          disabled={loading || options.length === 0}
          className={inputContainerClass}
        >
          <option value="">{t("qrScanner:selectALocation")}</option>
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
