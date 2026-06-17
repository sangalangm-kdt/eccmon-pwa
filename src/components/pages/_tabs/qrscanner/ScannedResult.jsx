import React, { useEffect, useMemo, useRef, useState } from "react";

import ScanCodes from "./ScanCodes";

import SaveButton from "../../../constants/SaveButton";

import { CylinderInfo, QrHeader } from "./components";

import { useCylinderUpdate } from "../../../../hooks/cylinderUpdates";

import { useCylinderCover } from "../../../../hooks/cylinderCover";

import AddedOrUpdateSuccessfully from "../../../constants/AddedOrUpdateSuccessfully";

import CycleModal from "../../../constants/CycleModal";
import ResponsiveSheet from "../../../constants/ResponsiveSheet";

import { t } from "i18next";

import { useLocation, useNavigate } from "react-router-dom";

import {
  buildOperationSavePayload,
  getCylinderSerialNumber,
  isDisposed,
  isDisposalOperation,
  normalizeScannedCylinder,
} from "../../../utils/cylinderStatus";
import { getLaravelValidationMessage } from "../../../utils/apiValidationErrors";

const ScannedResult = () => {
  const { addUpdate, mutate: mutateUpdates } = useCylinderUpdate();

  const {
    createCylinder,
    mutate: mutateCylinders,
  } = useCylinderCover();

  const location = useLocation();

  const navigate = useNavigate();

  const isNewCylinder = location.state?.isNewCylinder === true;

  const cylinderData = useMemo(
    () => normalizeScannedCylinder(location.state),

    [location.state],
  );

  const [savedAsDisposed, setSavedAsDisposed] = useState(false);

  const isReadOnly =
    savedAsDisposed ||
    location.state?.disposedReadOnly === true ||
    Number(cylinderData?.isDisposed) === 2 ||
    Number(cylinderData?.is_disposed) === 2 ||
    cylinderData?.status === "Disposal" ||
    cylinderData?.process === "Disposal" ||
    isDisposed(cylinderData);

  const [selectedStatus, setSelectedStatus] = useState(() =>
    location.state?.isNewCylinder === true ? "Storage" : "None",
  );

  const [data, setData] = useState({});

  const [step, setStep] = useState("view");

  const [modalOpen, setModalOpen] = useState(false);

  const [modalType, setModalType] = useState("success");

  const [currentCycle, setCurrentCycle] = useState(0);

  const [isComplete, setIsComplete] = useState(false);

  const [continueDisabledReason, setContinueDisabledReason] = useState(null);

  const [showAlert, setShowAlert] = useState(false);

  const [loading, setLoading] = useState(false);

  const [saveError, setSaveError] = useState(null);

  const [isSaved, setIsSaved] = useState(false);

  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);

  const skipStatusResetRef = useRef(true);

  const lastSavedSignatureRef = useRef(null);

  const savingRef = useRef(false);

  const scannedSerialNumber = useMemo(
    () =>
      getCylinderSerialNumber(cylinderData) ||
      getCylinderSerialNumber(location.state),
    [cylinderData, location.state],
  );

  const getExistingCase = () => {
    const parseDetails = (value) => {
      if (!value) return {};
      if (typeof value === "object") return value;

      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    };

    const otherDetails = parseDetails(cylinderData?.otherDetails);
    const updateOtherDetails = parseDetails(
      cylinderData?.updates?.otherDetails,
    );

    const candidates = [
      cylinderData?.case,
      otherDetails.case,
      updateOtherDetails.case,
    ];

    return (
      candidates.find(
        (candidate) =>
          candidate !== undefined &&
          candidate !== null &&
          `${candidate}`.trim() !== "",
      ) ?? null
    );
  };

  const getFormSignature = (status = selectedStatus, formData = data) =>
    JSON.stringify({
      selectedStatus: status,
      data: formData,
    });

  const hasMeaningfulFormData = useMemo(
    () =>
      Object.values(data).some(
        (value) =>
          value !== undefined &&
          value !== null &&
          `${value}`.trim() !== "",
      ),
    [data],
  );

  const hasUnsavedChanges =
    !isSaved &&
    !isReadOnly &&
    (selectedStatus !== "None" || hasMeaningfulFormData || step !== "view");

  useEffect(() => {
    if (!isSaved) return;

    if (lastSavedSignatureRef.current !== getFormSignature()) {
      setIsSaved(false);
    }
  }, [data, isSaved, selectedStatus]);

  const navigateToQrScanner = () => {
    navigate("/qrscanner");
  };

  const handleBackToQr = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedConfirm(true);
      return;
    }

    navigateToQrScanner();
  };

  const handleConfirmLeave = () => {
    setShowUnsavedConfirm(false);
    navigateToQrScanner();
  };

  useEffect(() => {
    if (isReadOnly) {
      setIsComplete(false);

      setContinueDisabledReason(null);
    }
  }, [isReadOnly]);

  useEffect(() => {
    if (isReadOnly) return;

    if (skipStatusResetRef.current) {
      skipStatusResetRef.current = false;
      return;
    }

    setData({});

    setIsComplete(false);

    setContinueDisabledReason(null);

    setShowAlert(false);

    setStep("view");
  }, [selectedStatus, isReadOnly]);

  const handleClick = (e) => {
    e.preventDefault();

    if (loading || savingRef.current) {
      return;
    }

    if (isReadOnly) {
      setShowAlert(true);

      return;
    }

    if (!isComplete) {
      setShowAlert(true);

      return;
    }

    setShowAlert(false);
    setSaveError(null);

    if (step === "view") {
      setStep("review");

      return;
    }

    if (step === "review") {
      const payload = buildOperationSavePayload(
        { ...data, serialNumber: data.serialNumber || scannedSerialNumber },
        selectedStatus,
        cylinderData,
      );

      if (import.meta.env.DEV) {
        console.log("[ScannedResult] Form data:", data);
        console.log("[ScannedResult] Resolved serial:", scannedSerialNumber);
        console.log("[ScannedResult] Save payload:", payload);
      }

      const isDisposal = isDisposalOperation(selectedStatus);

      setCurrentCycle(payload.cycle);

      if (selectedStatus === "Storage") {
        setModalType("Storage");
      } else {
        setModalType("success");
      }

      const saveCylinder = async () => {
        savingRef.current = true;
        setLoading(true);
        setSaveError(null);

        try {
          const shouldCreate = isNewCylinder && !cylinderData?.id;

          if (shouldCreate) {
            await createCylinder({
              serialNumber: payload.serialNumber || scannedSerialNumber,

              location: payload.location,

              process: selectedStatus,

              disposalDate: payload.disposalDate,

              cycle: payload.cycle,

              otherDetails: payload.otherDetails,
            });
          }

          await addUpdate(
            {
              ...payload,

              serialNumber: payload.serialNumber || scannedSerialNumber,

              isAlreadyDisposed: !isNewCylinder && isDisposed(cylinderData),
            },

            selectedStatus,

            setModalOpen,

            setLoading,
          );

          lastSavedSignatureRef.current = getFormSignature(
            selectedStatus,
            data,
          );

          setIsSaved(true);

          Promise.all([mutateCylinders(), mutateUpdates()]).catch((error) => {
            console.error("Failed to refresh cylinder data after save", error);
          });

          if (isDisposal) {
            setSavedAsDisposed(true);

            setSelectedStatus("Disposal");

            setStep("view");

            setIsComplete(false);

            setContinueDisabledReason(null);

            navigate(location.pathname, {
              replace: true,

              state: {
                ...location.state,

                data: {
                  ...cylinderData,

                  ...payload,

                  status: "Disposal",

                  process: "Disposal",

                  is_disposed: 2,

                  isDisposed: 2,
                },

                disposedReadOnly: true,
              },
            });
          }
        } catch (error) {
          if (error.message === "disposed_read_only") {
            setShowAlert(true);
            return;
          }

          if (error.response?.status === 422) {
            setSaveError(getLaravelValidationMessage(error, t));
            setStep("review");
            return;
          }

          setSaveError(t("qrScanner:errors.saveFailed"));
          console.error("Failed to save scanned cylinder result", error);
        } finally {
          savingRef.current = false;
          setLoading(false);
        }
      };

      saveCylinder();

      return;
    }

    if (step === "edit") {
      setStep("review");
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();

    setStep("edit");
  };

  return (
    <div>
      <div className="flex w-full flex-col bg-gray-100 dark:bg-gray-700">
        <QrHeader
          step={step}
          handleEdit={handleEdit}
          disabled={isReadOnly}
          onBack={handleBackToQr}
        />

        {isReadOnly && (
          <div className="mt-24 px-4">
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600 dark:border-red-300 dark:bg-red-900/30 dark:text-red-100">
              <p className="font-semibold">{t("qrScanner:disposedReadOnly")}</p>

              <p className="mt-1 text-xs">
                {t("qrScanner:errors.disposedReadOnly")}
              </p>
            </div>
          </div>
        )}

        {saveError && !isReadOnly && (
          <div className="mt-24 px-4">
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600 dark:border-red-300 dark:bg-red-900/30 dark:text-red-100">
              <p className="font-semibold">
                {t("qrScanner:errors.saveFailedTitle")}
              </p>
              <p className="mt-1 text-xs">{saveError}</p>
            </div>
          </div>
        )}

        {step === "review" && (
          <div
            className={`${isReadOnly ? "mt-2" : "mt-20"} flex w-full flex-col rounded-lg`}
          >
            <div className="px-3 py-6">
              <p className="flex px-2 text-base font-semibold md:text-base">
                {t("common:reviewInfo")}
              </p>

              <p className="flex px-2 text-xs text-gray-500 dark:text-gray-300">
                {t("common:reviewDetails")}
              </p>
            </div>
          </div>
        )}

        <ScanCodes
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          disabled={step === "review"}
          readOnly={isReadOnly}
          step={step}
        />

        <div className="mt-2">
          <CylinderInfo
            selectedStatus={selectedStatus}
            setData={setData}
            disabled={step === "review" || isReadOnly}
            readOnly={isReadOnly}
            step={step}
            setIsComplete={setIsComplete}
            setContinueDisabledReason={setContinueDisabledReason}
            showAlert={showAlert}
            setShowAlert={setShowAlert}
          />
        </div>

        {!isReadOnly && (
          <SaveButton
            onClick={handleClick}
            text={
              step === "review"
                ? t("common:saveButton")
                : t("common:continueButton")
            }
            disabled={!isComplete || loading}
            helperText={!isComplete ? continueDisabledReason : null}
            loading={loading}
          />
        )}
      </div>

      {modalOpen &&
        (isComplete ? (
          modalType === "Storage" ? (
            <CycleModal
              selectedStatus={selectedStatus}
              cycle={currentCycle}
              data={data}
              onClose={() => setModalOpen(false)}
            />
          ) : (
            <AddedOrUpdateSuccessfully
              data={data}
              selectedStatus={selectedStatus}
              onClose={() => setModalOpen(false)}
            />
          )
        ) : (
          <AddedOrUpdateSuccessfully
            data={data}
            selectedStatus={selectedStatus}
            onClose={() => setModalOpen(false)}
          />
        ))}

      {showUnsavedConfirm ? (
        <ResponsiveSheet
          isOpen={showUnsavedConfirm}
          onClose={() => setShowUnsavedConfirm(false)}
          title={t("qrScanner:unsavedChanges.title")}
          size="sm"
          zIndex={50}
          closeLabel={t("common:close")}
          bodyClassName="p-4 sm:p-6"
        >
          <p className="text-sm leading-6 text-gray-600 dark:text-gray-100">
            {t("qrScanner:unsavedChanges.message")}
          </p>

          <div className="mt-6 flex justify-end gap-3 text-sm">
            <button
              type="button"
              className="min-h-[44px] rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-600 transition-all duration-200 active:scale-95 dark:bg-gray-700 dark:text-gray-100"
              onClick={() => setShowUnsavedConfirm(false)}
            >
              {t("qrScanner:unsavedChanges.cancel")}
            </button>

            <button
              type="button"
              className="min-h-[44px] rounded-lg bg-primary px-4 py-2 font-medium text-white transition-all duration-200 active:scale-95"
              onClick={handleConfirmLeave}
            >
              {t("qrScanner:unsavedChanges.leave")}
            </button>
          </div>
        </ResponsiveSheet>
      ) : null}
    </div>
  );
};

export default ScannedResult;
