import React, { useState } from "react";
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
}) => {
  const { t } = useTranslation();

  // State to manage error messages
  const [engineNumError, setEngineNumError] = useState("");
  const [opHoursError, setOpHoursError] = useState("");

  // Handle engine number change
  const handleEngineNumChange = (e) => {
    const value = e.target.value;

    // Ensure the engine number is required and has a length <= 2
    if (value.length <= 2) {
      setEngineNum(value);
      setEngineNumError(""); // Clear error if valid
    } else {
      setEngineNumError(t("qrScanner:engineNumError")); // Set error if not valid
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
      setOpHoursError(t("qrScanner:opHoursError")); // Set error if not valid
    }
  };

  // Check if all required fields are filled in
  const isFormValid = () => {
    return engineNum && opHours >= 0 && site; // Ensure engineNum, opHours, and site are set
  };

  return (
    <div className="flex flex-col p-2">
      <div className="flex flex-col w-full">
        <label className="font-semibold">{t("qrScanner:engineInfo")}</label>
        <SiteNameOptions site={site} setSite={setSite} disabled={disabled} />
      </div>

      {/* Engine Number */}
      <div>
        <label>{t("qrScanner:engineNo")}</label>
        <input
          value={engineNum}
          className={`w-full p-2 rounded border ${
            engineNumError || !engineNum ? "border-red-500" : ""
          }`}
          type="text"
          placeholder={t("qrScanner:enterNumber")}
          onChange={handleEngineNumChange}
          disabled={disabled}
          required
        />
        {engineNumError && (
          <p className="flex text-red-500 text-tiny">{engineNumError}</p>
        )}
        {!engineNum && (
          <p className="flex text-red-500 text-tiny">
            {t("qrScanner:engineNumRequired")}
          </p>
        )}
      </div>

      {/* Operating Hours */}
      <div>
        <label>{t("qrScanner:operatingHours")}</label>
        <input
          className={`w-full p-2 rounded border ${
            opHoursError || opHours === "" ? "border-red-500" : ""
          }`}
          type="number"
          value={opHours}
          placeholder={t("qrScanner:enterOperatingHours")}
          onChange={handleOpHoursChange}
          disabled={disabled}
          required
        />
        {opHoursError && (
          <p className="flex text-red-500 text-tiny">{opHoursError}</p>
        )}
        {opHours === "" && (
          <p className="flex text-red-500 text-tiny">
            {t("qrScanner:opHoursRequired")}
          </p>
        )}
      </div>
    </div>
  );
};

export default EngineInfo;
