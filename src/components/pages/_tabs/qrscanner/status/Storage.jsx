/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useMemo, useState } from "react";
import DateField from "../../../../constants/DateField";
import { useLocationProcess } from "../../../../../hooks/locationProcess";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StorageSkeleton from "../../../../constants/skeleton/Storage";
import { useAuthentication } from "../../../../../hooks/auth";
import LocationDropdown from "../../../../constants/LocationDropdown";
import {
  getContinueDisabledMessage,
  getMissingRequiredFieldKeys,
  hasAvailableOptions,
  validateSelectionField,
} from "../../../../utils/formFieldValidation";
import {
  setFormDataIfChanged,
  setStateIfChanged,
} from "../../../../utils/syncFormState";
import { getCylinderSerialNumber } from "../../../../utils/cylinderStatus";

const STORAGE_DATA_KEYS = [
  "serialNumber",
  "location",
  "cycle",
  "dateDone",
];

const hasCycle = (value) =>
  value !== undefined && value !== null && value !== "";

const Storage = ({
  showAlert,
  selectedStatus,
  setData,
  setIsComplete,
  setContinueDisabledReason,
  disabled,
}) => {
  const { t } = useTranslation("qrScanner");
  const location = useLocation();
  const { user } = useAuthentication();

  const serialNumber = getCylinderSerialNumber(location.state);
  const cycle = location.state?.data?.cycle;
  const savedDateDone = location.state?.data?.updates?.dateDone;

  const { data, isLoading } = useLocationProcess("storage");
  const storageData = data?.data ?? [];
  const hasProcessorOptions = hasAvailableOptions(storageData);
  const isAdmin = user?.is_admin == 1;
  const locationRequired = isAdmin && hasProcessorOptions && !isLoading;

  const [date, setDate] = useState(() => {
    const today = savedDateDone ? new Date(savedDateDone) : new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  });

  const [processor, setProcessor] = useState(
    location.state?.data?.location ?? "",
  );

  const resolvedLocation = useMemo(() => {
    const trimmed = String(processor ?? "").trim();
    return trimmed || null;
  }, [processor]);

  useEffect(() => {
    if (!user) return;

    const locationCheck = hasProcessorOptions
      ? validateSelectionField({
          required: locationRequired,
          hasOptions: true,
          value: processor,
          missingSelectionMessageKey: "validation.locationRequired",
        })
      : { valid: true, blockReasonKey: null };

    const serialValid = Boolean(`${serialNumber ?? ""}`.trim());
    const cycleValid = hasCycle(cycle);
    const dateValid = Boolean(date);
    const fieldEntries = [
      ["validation.serialNumberRequired", serialValid],
      ["validation.cycleRequired", cycleValid],
      ["validation.dateRequired", dateValid],
      ...(hasProcessorOptions
        ? [["validation.locationRequired", locationCheck.valid]]
        : []),
    ];
    const missingKeys = getMissingRequiredFieldKeys(fieldEntries);
    const isFormComplete = missingKeys.length === 0;

    const nextFormData = {
      serialNumber,
      location: resolvedLocation,
      cycle,
      dateDone: date,
    };

    const applyFormData = () => {
      setFormDataIfChanged(setData, nextFormData, STORAGE_DATA_KEYS);
    };

    queueMicrotask(applyFormData);

    const applyCompletionState = () => {
      setStateIfChanged(setIsComplete, isFormComplete);
      setContinueDisabledReason?.((prev) => {
        const next = isFormComplete
          ? null
          : getContinueDisabledMessage(missingKeys, t);
        return prev === next ? prev : next;
      });
    };

    if (isFormComplete) {
      queueMicrotask(applyCompletionState);
    } else {
      applyCompletionState();
    }
  }, [
    processor,
    date,
    resolvedLocation,
    hasProcessorOptions,
    locationRequired,
    isLoading,
    isAdmin,
    user,
    serialNumber,
    cycle,
    setData,
    setIsComplete,
    setContinueDisabledReason,
    t,
  ]);

  return (
    <div className="flex flex-col rounded-lg bg-white dark:bg-gray-500">
      <div className="w-full p-2">
        <h2 className="mb-2 mt-2 text-base font-semibold leading-loose text-primaryText dark:text-gray-100">
          {t("storageStatus")}
        </h2>
        {!isLoading ? (
          <>
            <div>
              <label className="text-sm font-semibold text-primaryText dark:text-gray-200">
                {t("locationSite")}
                {locationRequired && (
                  <strong className="text-red-500"> *</strong>
                )}
              </label>
              {isAdmin ? (
                <LocationDropdown
                  options={storageData}
                  loading={isLoading}
                  processor={processor}
                  setProcessor={setProcessor}
                  disabled={disabled || !hasProcessorOptions}
                  emptyHelperKey="noStorageLocationOptions"
                />
              ) : (
                <input
                  type="text"
                  value="None"
                  readOnly
                  className="w-full rounded border bg-gray-100 p-2 text-sm dark:bg-gray-600"
                  disabled
                />
              )}

              {showAlert && locationRequired && !processor && (
                <div className="mb-2 rounded p-1 text-red-600">
            <p className="text-xs">{t("validation.locationRequired")}</p>
                </div>
              )}
            </div>
            <div className="mb-4 mt-2">
              <label className="text-sm font-semibold text-primaryText dark:text-gray-200">
                {t("startDate")} <strong className="text-red-500">*</strong>
              </label>

              <DateField date={date} setDate={setDate} disabled={disabled} />
              {showAlert && !date && (
                <div className="mb-2 rounded p-1 text-red-600">
                  <p className="text-xs">{t("validation.dateRequired")}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <StorageSkeleton />
        )}
      </div>
    </div>
  );
};

export default Storage;
