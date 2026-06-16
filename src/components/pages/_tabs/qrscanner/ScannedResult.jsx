import React, { useEffect, useState } from "react";
import ScanCodes from "./ScanCodes";
import ScannedResultActions from "../../../constants/ScannedResultActions";
import { CylinderInfo, QrHeader } from "./components";
import { useCylinderUpdate } from "../../../../hooks/cylinderUpdates";
import { useCylinderCover } from "../../../../hooks/cylinderCover";
import AddedOrUpdateSuccessfully from "../../../constants/AddedOrUpdateSuccessfully";
import CycleModal from "../../../constants/CycleModal";
import Loader from "../../../constants/Loader";
import { t } from "i18next";
import { useLocation } from "react-router-dom";
import { useAuthentication } from "../../../../hooks/auth";

const ScannedResult = () => {
  const { addUpdate } = useCylinderUpdate();
  const { deleteCylinder } = useCylinderCover();
  const { user } = useAuthentication();
  const location = useLocation();
  const cylinderId = location.state?.data?.id;
  const serialNumber = location.state?.data?.serialNumber ?? "";
  const isAdmin = user?.is_admin === 1;

  const [selectedStatus, setSelectedStatus] = useState("None");
  const [data, setData] = useState({});
  const [step, setStep] = useState("view");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [currentCycle, setCurrentCycle] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Manage alert state
  const [loading, setLoading] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [removeConfirmation, setRemoveConfirmation] = useState("");

  const handleClick = (e) => {
    e.preventDefault();

    let otherDetails = {};
    try {
      if (
        typeof data.otherDetails === "string" &&
        data.otherDetails.trim() !== ""
      ) {
        otherDetails = JSON.parse(data.otherDetails);
      } else {
        otherDetails = {};
      }
    } catch (error) {
      otherDetails = {};
    }

    // Validate for 'Disposal' status (check if dateDone exists)
    if (
      selectedStatus === "Disposal" &&
      (!data.serialNumber || !data.cycle || !data.dateDone)
    ) {
      setShowAlert(true); // Show alert if dateDone is missing for Disposal
      return;
    }

    // Show alert when required fields for Storage are missing
    if (
      selectedStatus === "Storage" &&
      (!data.serialNumber || !data.cycle || !data.dateDone)
    ) {
      setShowAlert(true); // Show alert if required fields for Storage are missing
      return;
    }

    // Validate fields for other statuses (Disposal and general fields)
    if (
      !data.serialNumber ||
      !data.cycle ||
      otherDetails.case === null ||
      otherDetails.isPassed === "" ||
      otherDetails.orderNumber === "" ||
      otherDetails.engineNumber === "" ||
      otherDetails.operationHours === "" ||
      otherDetails.mountingPosition === ""
    ) {
      setShowAlert(true); // Show the alert if any required field is missing
      return;
    } else {
      setShowAlert(false); // Hide the alert if all required fields are filled
    }

    // Proceed with further logic based on step and status
    if (step === "view") {
      if (isComplete) {
        setStep("review");
      }
    } else if (step === "review") {
      const updatedCycle = data.cycle;
      setCurrentCycle(updatedCycle);

      if (selectedStatus === "Storage") {
        setModalType("Storage");
      } else {
        setModalType("success");
      }

      addUpdate(data, selectedStatus, setModalOpen, setLoading);
    } else if (step === "edit") {
      setStep("review");
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setStep("edit");
  };

  const handleRemoveClick = () => {
    if (!isAdmin) {
      return;
    }

    setRemoveConfirmation("");
    setRemoveDialogOpen(true);
  };

  const handleRemoveConfirm = async () => {
    if (!cylinderId || removeConfirmation !== serialNumber) {
      return;
    }

    setLoading(true);

    try {
      await deleteCylinder(cylinderId);
      setRemoveDialogOpen(false);
      setModalType("delete");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // For "Storage" status, validate serialNumber, cycle, and dateDone
    const isSerialNumberValid = data.serialNumber && data.serialNumber !== "";
    const isDateDoneValid = data.dateDone && data.dateDone !== "";
    const isCycleValid = data.cycle && data.cycle !== undefined;

    // For "Storage" status, validate required fields only for Storage
    const isStorageValid =
      isSerialNumberValid && isCycleValid && isDateDoneValid;

    // For "Disposal" status, validate that dateDone exists
    const isDisposalValid = selectedStatus === "Disposal" && data.dateDone;

    // Combine validation logic: the form is complete if either Storage or Disposal is valid
    const isValid = isStorageValid || isDisposalValid;

    setIsComplete(isValid); // Set `isComplete` based on the combined validation logic
  }, [data, selectedStatus]); // Re-run whenever `data` or `selectedStatus` changes

  return (
    <div>
      <div className="flex w-full flex-col bg-gray-100 dark:bg-gray-700">
        <QrHeader step={step} handleEdit={handleEdit} />
        {step === "review" && (
          <div className="mt-20 flex w-full flex-col rounded-lg">
            <div className="px-3 py-6">
              <p className="flex px-2 text-base font-semibold">
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
          step={step}
        />
        <div className="my-4">
          <CylinderInfo
            selectedStatus={selectedStatus}
            setData={setData}
            disabled={step === "review"}
            step={step}
            setIsComplete={setIsComplete}
            showAlert={showAlert}
            setShowAlert={setShowAlert} // Pass the alert handler to CylinderInfo
          />
        </div>

        <ScannedResultActions
          onPrimaryClick={handleClick}
          onRemoveClick={handleRemoveClick}
          showRemoveButton={isAdmin}
          text={
            step === "review"
              ? t("common:saveButton")
              : t("common:continueButton")
          }
          disabled={!isComplete}
          loading={loading}
        />
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
              data={modalType === "delete" ? location.state?.data : data}
              selectedStatus={selectedStatus}
              action={modalType === "delete" ? "delete" : "update"}
            />
          )
        ) : (
          <AddedOrUpdateSuccessfully
            data={modalType === "delete" ? location.state?.data : data}
            selectedStatus={selectedStatus}
            action={modalType === "delete" ? "delete" : "update"}
          />
        ))}

      {isAdmin && removeDialogOpen && (
        <div className="fixed inset-0 z-60 flex items-end justify-center bg-black bg-opacity-50">
          <div className="w-full rounded-t-lg bg-white p-6 shadow-lg dark:bg-gray-600 dark:text-gray-50">
            <p className="text-center text-base font-semibold text-red-600 dark:text-red-400">
              {t("common:removeThisCover")}
            </p>
            <p className="mt-3 text-center text-sm text-gray-500 dark:text-gray-200">
              {t("common:confirmRemoveThisCover")}
            </p>
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
              <p className="font-semibold">
                {t("common:removeThisCoverWarningTitle")}
              </p>
              <p className="mt-1">{t("common:removeThisCoverWarningBody")}</p>
            </div>
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-primaryText dark:text-gray-100">
                {t("common:typeSerialToConfirm")}
              </label>
              <div className="mb-2 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-semibold tracking-wide text-primaryText dark:border-gray-500 dark:bg-gray-700 dark:text-gray-50">
                {serialNumber || "--"}
              </div>
              <input
                type="text"
                value={removeConfirmation}
                onChange={(e) => setRemoveConfirmation(e.target.value)}
                placeholder={t("common:enterSerialNumber")}
                className="w-full rounded-md border border-gray-300 px-3 py-3 text-sm text-primaryText focus:border-red-500 focus:outline-none dark:border-gray-500 dark:bg-gray-700 dark:text-gray-50"
                disabled={loading}
              />
              {removeConfirmation !== "" &&
                removeConfirmation !== serialNumber && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {t("common:serialNumberDoesNotMatch")}
                  </p>
                )}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setRemoveDialogOpen(false);
                  setRemoveConfirmation("");
                }}
                className="w-full rounded-full bg-gray-200 px-4 py-3 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-400 dark:text-gray-100"
                disabled={loading}
              >
                {t("common:no")}
              </button>
              <button
                type="button"
                onClick={handleRemoveConfirm}
                className="w-full rounded-full bg-red-500 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                disabled={
                  loading ||
                  !serialNumber ||
                  removeConfirmation !== serialNumber
                }
              >
                {loading ? <Loader label={t("common:removing")} /> : t("common:yes")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannedResult;
