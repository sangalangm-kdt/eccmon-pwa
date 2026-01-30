import React, { useMemo, useState } from "react";
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
}) => {
  const { t } = useTranslation("qrScanner");
  const { user } = useAuthentication();

  // ✅ Make sure inputs are always CONTROLLED
  const engineNumValue = useMemo(
    () => (engineNum ?? "").toString(),
    [engineNum],
  );
  const opHoursValue = useMemo(() => (opHours ?? "").toString(), [opHours]);

  const [engineNumError, setEngineNumError] = useState("");
  const [opHoursError, setOpHoursError] = useState("");

  // ✅ Engine number: allow only digits, max 2 chars
  const handleEngineNumChange = (e) => {
    const raw = e.target.value ?? "";
    const digitsOnly = raw.replace(/\D/g, ""); // keep digits only
    const next = digitsOnly.slice(0, 2); // max 2

    setEngineNum(next);
    setEngineNumError("");

    // If user tried to type more than 2 digits, show a friendly message
    if (digitsOnly.length > 2) {
      setEngineNumError(
        t("validation.engineNoMax2", "Engine number cannot exceed 2 digits."),
      );
    }
  };

  // ✅ Operating hours: allow digits only, non-negative, allow empty
  const handleOpHoursChange = (e) => {
    const raw = e.target.value ?? "";
    const digitsOnly = raw.replace(/\D/g, ""); // remove '-' and other chars

    // allow empty
    setOpHours(digitsOnly);
    setOpHoursError("");

    // if raw had non-digit chars (like "-"), show message
    if (raw !== digitsOnly) {
      setOpHoursError(
        t(
          "validation.opHoursNonNegative",
          "Operating hours must be a non-negative number.",
        ),
      );
    }
  };

  const isAdmin = user?.is_admin === 1;

  return (
    <div className="flex flex-col gap-3 p-2">
      {/* Site Name */}
      {isAdmin ? (
        <SiteNameOptions
          site={site}
          setSite={setSite}
          disabled={disabled}
          showAlert={showAlert}
        />
      ) : (
        <div className="flex w-full flex-col gap-1">
          <label className="font-semibold">{t("engineInfo")}</label>
          <label className="text-sm text-gray-700 dark:text-gray-100">
            {t("siteName")}
          </label>
          <input
            className="w-full rounded border border-gray-300 bg-transparent px-2 py-2 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            type="text"
            value={(affiliation ?? "").toString()}
            readOnly
            disabled={disabled}
          />
        </div>
      )}

      {/* Engine Number */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-700 dark:text-gray-100">
          {t("engineNo")} <strong className="text-red-500">*</strong>
        </label>

        {/* ✅ use text + inputMode numeric (better than type=number for max length) */}
        <input
          className={`w-full rounded border bg-transparent p-2 text-sm text-gray-800 focus:border-primary focus:outline-none dark:bg-gray-700 dark:text-gray-100 ${
            engineNumError
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder={t("validation.engineNoPlaceholder", "e.g. 01")}
          value={engineNumValue}
          onChange={handleEngineNumChange}
          disabled={disabled}
        />

        {engineNumError && (
          <p className="text-xs text-red-500">{engineNumError}</p>
        )}

        {showAlert && !engineNumValue && (
          <p className="text-xs text-red-600">
            {t("validation.engineNumberRequired")}
          </p>
        )}
      </div>

      {/* Operating Hours */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-700 dark:text-gray-100">
          {t("operatingHours")} <strong className="text-red-500">*</strong>
        </label>

        <input
          className={`w-full rounded border bg-transparent p-2 text-sm text-gray-800 focus:border-primary focus:outline-none dark:bg-gray-700 dark:text-gray-100 ${
            opHoursError
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder={t("validation.opHoursPlaceholder", "e.g. 000")}
          value={opHoursValue}
          onChange={handleOpHoursChange}
          disabled={disabled}
        />

        {showAlert && opHoursValue === "" && (
          <p className="text-xs text-red-600">
            {t("validation.opHoursRequired")}
          </p>
        )}

        {opHoursError && <p className="text-xs text-red-500">{opHoursError}</p>}
      </div>
    </div>
  );
};

export default EngineInfo;
