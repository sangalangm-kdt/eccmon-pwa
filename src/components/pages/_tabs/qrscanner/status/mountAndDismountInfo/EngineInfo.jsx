import React, { useEffect, useState } from "react";
import SiteNameOptions from "../../../../../constants/SiteNameOptions";
import { useTranslation } from "react-i18next";

const EngineInfo = ({
  site,
  setSite,
  engineNum,
  setEngineNum,
  opHours,
  setOpHours,
  disabled,
  showAlert,
  setShowAlert,
}) => {
  const { t } = useTranslation("qrScanner");

  // State to manage error messages
  const [engineNumError, setEngineNumError] = useState("");
  const [opHoursError, setOpHoursError] = useState("");

  // Handle engine number change
  const handleEngineNumChange = (e) => {
    const value = e.target.value;

    // Validate engine number (must be <= 2 characters)
    if (value.length <= 2) {
      setEngineNum(value);
      setEngineNumError(""); // Clear error if valid
    } else {
      setEngineNumError("Engine number cannot exceed 2 characters."); // Show error if invalid
    }
  };

  // Handle operating hours change
  const handleOpHoursChange = (e) => {
    const value = e.target.value;

    // Ensure operating hours is a valid non-negative number
    if (value >= 0 || value === "") {
      setOpHours(value);
      setOpHoursError(""); // Clear error if valid
    } else {
      setOpHoursError("Operating hours must be a non-negative number."); // Show error if invalid
    }
  };

  return (
    <div className="flex flex-col p-2">
      {/* Site Name */}
      <div className="flex flex-col w-full">
        <label className="font-semibold">{t("qrScanner:engineInfo")}</label>
        <SiteNameOptions site={site} setSite={setSite} disabled={disabled} />
      </div>

      {showAlert && !site && (
        <p className="text-red-600 text-xs">{t("validation.siteRequired")}</p>
      )}

      {/* Engine Number */}
      <div>
        <label>
          {t("qrScanner:engineNo")} <strong className="text-red-500">*</strong>
        </label>
        <input
          value={engineNum}
          className={`w-full p-2 rounded border ${
            engineNumError ? "border-red-500" : ""
          }`}
          type="text"
          placeholder="Enter engine number (max 2 characters)"
          onChange={handleEngineNumChange}
          disabled={disabled}
        />
        {engineNumError && (
          <p className="text-red-500 text-tiny">{engineNumError}</p>
        )}
        {showAlert && !engineNum && (
          <p className="text-red-600 text-xs">
            {t("validation.engineNumberRequired")}
          </p>
        )}
      </div>

      {/* Operating Hours */}
      <div>
        <label>
          {t("qrScanner:operatingHours")}{" "}
          <strong className="text-red-500">*</strong>
        </label>
        <input
          className={`w-full p-2 rounded border ${
            opHoursError ? "border-red-500" : ""
          }`}
          type="number"
          value={opHours}
          placeholder="Enter operating hours"
          onChange={handleOpHoursChange}
          disabled={disabled}
          required
        />
        {showAlert && opHours === "" && (
          <p className="text-red-600 text-xs">
            {t("validation.opHoursRequired")}
          </p>
        )}
        {opHoursError && (
          <p className="text-red-500 text-tiny">{opHoursError}</p>
        )}
      </div>
    </div>
  );
};

export default EngineInfo;
