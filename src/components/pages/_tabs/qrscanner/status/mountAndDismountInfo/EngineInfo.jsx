import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SiteNameOptions from "../../../../../constants/SiteNameOptions";
import { useAuthentication } from "../../../../../../hooks/auth";

const EngineInfo = ({
  affiliation,
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
  const { user } = useAuthentication();
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
  console.log(site);
  return (
    <div className="flex flex-col p-2">
      {/* Site Name */}
      {user.is_admin === 1 ? (
        <SiteNameOptions
          site={site}
          setSite={setSite}
          disabled={disabled}
          showAlert={showAlert}
        />
      ) : (
        <div className="flex w-full flex-col">
          <label className="font-semibold">{t("qrScanner:engineInfo")}</label>
          <label>{t("qrScanner:siteName")}</label>
          <input
            className="w-full rounded border bg-transparent px-2 py-2 dark:bg-gray-600"
            type="text"
            value={affiliation}
            readOnly
            disabled={disabled}
          />
        </div>
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
          placeholder="e.g. 000"
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
