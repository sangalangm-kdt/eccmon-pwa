import React, { useEffect, useMemo, useState } from "react";
import DateField from "../../../../constants/DateField";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { isDisposed, normalizeScannedCylinder } from "../../../../utils/cylinderStatus";
import {
  setFormDataIfChanged,
  setStateIfChanged,
} from "../../../../utils/syncFormState";

const DISPOSAL_DATA_KEYS = ["serialNumber", "location", "dateDone", "cycle"];

const hasCycle = (value) =>
  value !== undefined && value !== null && value !== "";

const formatInputDate = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getCurrentInputDate = () => formatInputDate(new Date());

const getRecordedDisposalDate = (cylinderData) =>
  formatInputDate(cylinderData?.disposalDate);

const buildDisposalData = ({ serialNumber, cycle, date }) => ({
  serialNumber,
  location: "None",
  dateDone: date,
  cycle,
});

const Disposal = ({
  setData,
  disabled,
  readOnly = false,
  setIsComplete,
  setContinueDisabledReason,
}) => {
  const { t } = useTranslation("qrScanner");
  const location = useLocation();

  const cylinderData = useMemo(
    () => normalizeScannedCylinder(location.state),
    [
      location.state?.data,
      location.state?.is_disposed,
      location.state?.isDisposed,
      location.state?.disposedReadOnly,
      location.state?.isNewCylinder,
    ],
  );

  const serialNumber = cylinderData?.serialNumber ?? "";
  const cycle = cylinderData?.cycle;
  const recordedDisposalDate = getRecordedDisposalDate(cylinderData);
  const disposed = readOnly || isDisposed(cylinderData);

  const [date, setDate] = useState(() =>
    disposed ? recordedDisposalDate : getCurrentInputDate(),
  );

  const dateRequiredMessage = t("validation.dateRequired");

  useEffect(() => {
    if (!disposed) return;
    setDate((prev) =>
      prev === recordedDisposalDate ? prev : recordedDisposalDate,
    );
  }, [disposed, recordedDisposalDate]);

  useEffect(() => {
    const nextData = buildDisposalData({ serialNumber, cycle, date });
    setFormDataIfChanged(setData, nextData, DISPOSAL_DATA_KEYS);

    const serialValid = Boolean(`${serialNumber ?? ""}`.trim());
    const cycleValid = hasCycle(cycle);
    const dateValid = Boolean(date);

    if (disposed) {
      setStateIfChanged(setIsComplete, false);
      setStateIfChanged(setContinueDisabledReason, null);
      return;
    }

    const isFormComplete = serialValid && cycleValid && dateValid;
    setStateIfChanged(setIsComplete, isFormComplete);
    setContinueDisabledReason?.((prev) => {
      let next = null;
      if (!serialValid) {
        next = t("errors.serialNumberRequired");
      } else if (!cycleValid) {
        next = t("validation.cycleRequired");
      } else if (!dateValid) {
        next = dateRequiredMessage;
      }
      return prev === next ? prev : next;
    });
  }, [
    date,
    serialNumber,
    cycle,
    disposed,
    dateRequiredMessage,
    setData,
    setIsComplete,
    setContinueDisabledReason,
  ]);

  return (
    <div className="flex flex-col rounded-lg bg-white pb-1 dark:bg-gray-500">
      <div className="w-full p-2">
        <h2 className="mb-6 font-semibold">{t("disposalStatus")}</h2>
        <div className="text-sm">
          <label>{t("disposalDate")}</label>
          <DateField
            date={date}
            setDate={setDate}
            disabled={disabled || disposed}
          />
          {disposed && !date && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-200 md:text-xs">
              {t("noDisposalDateRecorded")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Disposal;
