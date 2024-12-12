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

  // State to manage error message
  const [error, setError] = useState("");

  // Handle engine number change
  const handleEngineNumChange = (e) => {
    const value = e.target.value;

    if (value.length <= 2) {
      setEngineNum(value);
      setError(""); // Clear error if the length is valid
    } else {
      setError(t("qrScanner:engineNumError")); // Set error message if length exceeds 2
    }
  };

  return (
    <div className="flex flex-col p-2">
      <div className="flex flex-col w-full">
        <label className="font-semibold">{t("qrScanner:engineInfo")}</label>
        <SiteNameOptions site={site} setSite={setSite} disabled={disabled} />
      </div>
      <div>
        <label>{t("qrScanner:engineNo")}</label>{" "}
        <input
          value={engineNum}
          className={`w-full p-2 rounded border ${
            error ? "border-red-500" : ""
          }`}
          type="text"
          placeholder={t("qrScanner:enterNumber")}
          onChange={handleEngineNumChange}
          disabled={disabled}
        />{" "}
        {error && <p className="flex text-red-500 text-tiny">{error}</p>}
        {/* Show error message if there is an error */}
      </div>
      <div>
        <label>{t("qrScanner:operatingHours")}</label>
        <input
          className="w-full p-2 rounded border"
          type="number"
          value={opHours}
          placeholder="Enter operating hours"
          onChange={(e) => setOpHours(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default EngineInfo;
