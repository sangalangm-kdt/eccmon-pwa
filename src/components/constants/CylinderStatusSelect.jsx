import React, { useMemo } from "react";
import StatusDropdown from "./StatusDropdown";
import { useTranslation } from "react-i18next";
import { useAuthentication } from "../../hooks/auth";
import { useLocation } from "../../hooks/location";
import { IoLockClosed } from "react-icons/io5";

export const CylinderStatusSelect = ({
  selectedStatus,
  setSelectedStatus,
  disabled,
}) => {
  const { t } = useTranslation();
  const { user } = useAuthentication();

  // ✅ safer: hooks always return something, but guard anyway
  const locationRes = useLocation(user?.id);
  const process = locationRes?.process ?? [];

  // ✅ build options safely
  const cylinderStatusOptions = useMemo(() => {
    const opts =
      process?.flatMap((p, idx) => {
        if (String(p).toLowerCase() === "site") {
          return [
            { id: idx, status: "Mounted", labelKey: "mounted" },
            { id: idx + 1, status: "Dismounted", labelKey: "dismounted" },
          ];
        }
        return [{ id: idx, status: p, labelKey: String(p).toLowerCase() }];
      }) ?? [];

    // add Disposal last
    opts.push({
      id: opts.length,
      status: "Disposal",
      labelKey: "disposal",
    });

    return opts;
  }, [process]);

  const hasOptions = cylinderStatusOptions.length > 0;

  // ✅ wrapper setter: block changes if disabled
  const safeSetSelectedStatus = (next) => {
    if (disabled) return;
    setSelectedStatus(next);
  };

  return (
    <div className="flex w-full flex-col">
      <label
        htmlFor="status-select"
        className="mb-1 mt-2 text-sm font-semibold text-primaryText dark:text-gray-100"
      >
        {t("qrScanner:status")}
      </label>

      {/* ✅ LOCKED UI WRAPPER */}
      <div
        className={["relative", disabled ? "opacity-60" : "opacity-100"].join(
          " ",
        )}
      >
        <StatusDropdown
          options={cylinderStatusOptions}
          selectedStatus={selectedStatus}
          setSelectedStatus={safeSetSelectedStatus}
          disabled={disabled}
          t={t}
        />

        {/* ✅ overlay lock hint */}
        {disabled && (
          <div className="pointer-events-none mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-200">
            <IoLockClosed className="text-sm" />
            <span>{t("qrScanner:backend.alreadyDisposed")}</span>
          </div>
        )}
      </div>

      {!hasOptions && (
        <p className="text-xs text-gray-500 dark:text-gray-100">
          {t("qrScanner:noOptionsAvailable")}
        </p>
      )}
    </div>
  );
};
