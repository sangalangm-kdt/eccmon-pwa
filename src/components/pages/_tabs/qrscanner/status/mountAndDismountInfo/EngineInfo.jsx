import React, { useState } from "react";
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
  siteRequired = false,
  siteOptionsAvailable = true,
  onSiteOptionsAvailabilityChange,
}) => {
  const { t } = useTranslation("qrScanner");
  const { user } = useAuthentication();
  const [engineNumError, setEngineNumError] = useState("");
  const [opHoursError, setOpHoursError] = useState("");

  const handleEngineNumChange = (e) => {
    const value = e.target.value;

    if (value.length <= 2) {
      setEngineNum(value);
      setEngineNumError("");
    } else {
      setEngineNumError(t("engineNumError"));
    }
  };

  const handleOpHoursChange = (e) => {
    const value = e.target.value;

    if (value >= 0 || value === "") {
      setOpHours(value);
      setOpHoursError("");
    } else {
      setOpHoursError(t("opHoursError"));
    }
  };

  return (
    <div className="flex flex-col p-2">
      {user.is_admin === 1 ? (
        <SiteNameOptions
          site={site}
          setSite={setSite}
          disabled={disabled}
          showAlert={showAlert && siteRequired && siteOptionsAvailable}
          onOptionsAvailabilityChange={onSiteOptionsAvailabilityChange}
          showUnconfiguredMessage={siteRequired && !siteOptionsAvailable}
        />
      ) : (
        <div className="flex w-full flex-col">
          <label className="font-semibold">{t("engineInfo")}</label>
          <label>{t("siteName")}</label>
          <input
            className="w-full rounded border bg-transparent px-2 py-2 dark:bg-gray-600"
            type="text"
            value={affiliation}
            readOnly
            disabled={disabled}
          />
        </div>
      )}

      <div>
        <label>
          {t("engineNo")} <strong className="text-red-500">*</strong>
        </label>
        <input
          value={engineNum}
          className={`w-full rounded border bg-transparent p-2 focus:border focus:border-primary focus:outline-none dark:bg-gray-600 ${
            engineNumError ? "border-red-500" : ""
          }`}
          type="number"
          placeholder={t("enterNumber")}
          onChange={handleEngineNumChange}
          disabled={disabled}
        />
        {engineNumError && (
          <p className="text-sm text-red-500 md:text-tiny">{engineNumError}</p>
        )}
        {showAlert && !engineNum && (
          <p className="text-sm text-red-600 md:text-xs">
            {t("validation.engineNumberRequired")}
          </p>
        )}
      </div>

      <div>
        <label>
          {t("operatingHours")}{" "}
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
          <p className="text-sm text-red-600 md:text-xs">
            {t("validation.opHoursRequired")}
          </p>
        )}
        {opHoursError && (
          <p className="text-sm text-red-500 md:text-tiny">{opHoursError}</p>
        )}
      </div>
    </div>
  );
};

export default EngineInfo;
