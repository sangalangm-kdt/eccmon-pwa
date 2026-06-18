import React, { useEffect, useMemo, useState } from "react";
import DateField from "../../../../constants/DateField";
import ResponsiveSheet from "../../../../constants/ResponsiveSheet";
import AddedOrUpdateSuccessfully from "../../../../constants/AddedOrUpdateSuccessfully";
import Loader from "../../../../constants/Loader";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useAuthentication } from "../../../../../hooks/auth";
import {
  CYLINDER_COVER_DELETE_SUPPORTED,
  useCylinderCover,
} from "../../../../../hooks/cylinderCover";
import {
  isDisposalOperation,
  isDisposed,
  normalizeScannedCylinder,
} from "../../../../utils/cylinderStatus";
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

const REMOVE_BUTTON_CLASSNAME =
  "w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed";

export const useDisposalPermanentRemove = ({
  readOnly = false,
  selectedStatus,
  refreshCylinderLists,
}) => {
  const { t } = useTranslation("qrScanner");
  const location = useLocation();
  const { user } = useAuthentication();
  const { deleteCylinder } = useCylinderCover();

  const isAdmin = Number(user?.is_admin ?? user?.isAdmin) === 1;

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
  const cylinderId = cylinderData?.id;
  const disposed = readOnly || isDisposed(cylinderData);
  const inDisposalFlow =
    disposed || isDisposalOperation(selectedStatus ?? cylinderData?.status);
  const showPermanentRemove = isAdmin && inDisposalFlow;
  const canDelete =
    CYLINDER_COVER_DELETE_SUPPORTED && Boolean(cylinderId);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [removeError, setRemoveError] = useState(null);
  const [removeSuccess, setRemoveSuccess] = useState(false);

  const handleOpenConfirm = () => {
    if (!canDelete) return;
    setRemoveError(null);
    setConfirmOpen(true);
  };

  const handleCancelRemove = () => {
    if (removeLoading) return;
    setConfirmOpen(false);
    setRemoveError(null);
  };

  const handleConfirmRemove = async () => {
    if (!canDelete || removeLoading) return;

    setRemoveLoading(true);
    setRemoveError(null);

    try {
      await deleteCylinder(cylinderId);
      await refreshCylinderLists?.();
      setConfirmOpen(false);
      setRemoveSuccess(true);
    } catch (error) {
      setRemoveError(t("errors.saveFailed"));
    } finally {
      setRemoveLoading(false);
    }
  };

  const removeButton = showPermanentRemove ? (
    <div className="w-full">
      <button
        type="button"
        onClick={handleOpenConfirm}
        disabled={!canDelete || removeLoading}
        className={REMOVE_BUTTON_CLASSNAME}
      >
        {removeLoading ? (
          <Loader label={t("common:removing")} />
        ) : (
          t("removeCoverPermanently")
        )}
      </button>
      {!canDelete && (
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
          {t("permanentRemovalUnavailable")}
        </p>
      )}
    </div>
  ) : null;

  const removeOverlays = showPermanentRemove ? (
    <>
      {confirmOpen && (
        <ResponsiveSheet
          isOpen={confirmOpen}
          onClose={handleCancelRemove}
          title={t("removeCoverPermanentlyTitle")}
          size="sm"
          zIndex={60}
          closeLabel={t("cancel")}
          bodyClassName="p-4 sm:p-6"
        >
          <p className="text-sm text-gray-600 dark:text-gray-200">
            {t("removeCoverPermanentlyMessage")}
          </p>

          {removeError && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-300">
              {removeError}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3 text-sm">
            <button
              type="button"
              className="min-h-[44px] rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-600 transition-all duration-200 active:scale-95 dark:bg-gray-700 dark:text-gray-100"
              onClick={handleCancelRemove}
              disabled={removeLoading}
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              className="min-h-[44px] rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleConfirmRemove}
              disabled={removeLoading}
            >
              {removeLoading ? (
                <Loader label={t("common:removing")} />
              ) : (
                t("removeCoverPermanentlyConfirm")
              )}
            </button>
          </div>
        </ResponsiveSheet>
      )}

      {removeSuccess && (
        <AddedOrUpdateSuccessfully
          data={{ serialNumber }}
          selectedStatus="Disposal"
          action="delete"
        />
      )}
    </>
  ) : null;

  return {
    removeButton,
    removeOverlays,
    showPermanentRemove,
  };
};

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
    t,
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
