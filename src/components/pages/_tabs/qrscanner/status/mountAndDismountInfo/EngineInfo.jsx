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
      <div className="flex w-full flex-col">
        <label className="font-semibold">{t("qrScanner:engineInfo")}</label>
        <SiteNameOptions site={site} setSite={setSite} disabled={disabled} />
      </div>

      {showAlert && !site && (
        <p className="text-xs text-red-600">{t("validation.siteRequired")}</p>
      )}

      {/* Engine Number */}
      <div>
        <label>
          {t("qrScanner:engineNo")} <strong className="text-red-500">*</strong>
        </label>
        <input
          value={engineNum}
          className={`w-full rounded border bg-transparent p-2 focus:border focus:border-primary focus:outline-none dark:bg-gray-600 ${
            engineNumError ? "border-red-500" : ""
          }`}
          type="number"
          placeholder="Enter engine number (max 2 characters)"
          onChange={handleEngineNumChange}
          disabled={disabled}
        />
        {engineNumError && (
          <p className="text-tiny text-red-500">{engineNumError}</p>
        )}
        {showAlert && !engineNum && (
          <p className="text-xs text-red-600">
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
          className={`w-full rounded border bg-transparent p-2 focus:border focus:border-primary focus:outline-none dark:bg-gray-600 ${
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
          <p className="text-xs text-red-600">
            {t("validation.opHoursRequired")}
          </p>
        )}
        {opHoursError && (
          <p className="text-tiny text-red-500">{opHoursError}</p>
        )}
      </div>
    </div>
  );
};

export default EngineInfo;
