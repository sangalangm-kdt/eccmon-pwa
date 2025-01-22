import React, { useEffect, useState } from "react";
import ScanCodes from "./ScanCodes";
import SaveButton from "../../../constants/SaveButton";
import { CylinderInfo, QrHeader } from "./components";
import { useCylinderUpdate } from "../../../../hooks/cylinderUpdates";
import AddedOrUpdateSuccessfully from "../../../constants/AddedOrUpdateSuccessfully";
import CycleModal from "../../../constants/CycleModal";
import { t } from "i18next";

const ScannedResult = () => {
  const [selectedStatus, setSelectedStatus] = useState("None");
  const [data, setData] = useState({});
  const { addUpdate } = useCylinderUpdate();
  const [step, setStep] = useState("view");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [currentCycle, setCurrentCycle] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Manage alert state

  const handleClick = (e) => {
    e.preventDefault();
    console.log("Data on Click:", data); // Debugging the data

    let otherDetails = {};
    try {
      if (
        typeof data.otherDetails === "string" &&
        data.otherDetails.trim() !== ""
      ) {
        otherDetails = JSON.parse(data.otherDetails);
      } else {
        console.log("otherDetails is invalid or empty.");
        otherDetails = {};
      }
    } catch (error) {
      console.log("Error parsing otherDetails:", error);
      otherDetails = {};
    }

    // Validate for 'Disposal' status (check if dateDone exists)
    if (
      selectedStatus === "Disposal" &&
      (!data.serialNumber ||
        data.location === "" ||
        !data.cycle ||
        !data.dateDone)
    ) {
      setShowAlert(true); // Show alert if dateDone is missing for Disposal
      return;
    }

    // Show alert when required fields for Storage are missing
    if (
      selectedStatus === "Storage" &&
      (!data.location || !data.serialNumber || !data.cycle || !data.dateDone)
    ) {
      setShowAlert(true); // Show alert if required fields for Storage are missing
      return;
    }

    // Validate fields for other statuses (Disposal and general fields)
    if (
      !data.location ||
      data.location === "" ||
      !data.serialNumber ||
      !data.cycle ||
      otherDetails.case === null ||
      otherDetails.isPassed === "" ||
      otherDetails.orderNumber === "" ||
      otherDetails.engineNumber === "" ||
      otherDetails.operationHours === "" ||
      otherDetails.mountingPosition === ""
    ) {
      console.log("Location or other fields are empty, show alert");
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
      addUpdate(data, selectedStatus);

      if (selectedStatus === "Storage") {
        setModalType("Storage");
      } else {
        setModalType("success");
      }

      setModalOpen(true);
    } else if (step === "edit") {
      setStep("review");
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setStep("edit");
  };

  useEffect(() => {
    console.log("Data in useEffect:", data); // Debugging the data

    // For "Storage" status, validate location, serialNumber, cycle, and dateDone
    const isLocationValid = data.location && data.location !== "";
    const isSerialNumberValid = data.serialNumber && data.serialNumber !== "";
    const isDateDoneValid = data.dateDone && data.dateDone !== "";
    const isCycleValid = data.cycle && data.cycle !== undefined;

    // For "Storage" status, validate required fields only for Storage
    const isStorageValid =
      isLocationValid && isSerialNumberValid && isCycleValid && isDateDoneValid;

    // For "Disposal" status, validate that dateDone exists
    const isDisposalValid = selectedStatus === "Disposal" && data.dateDone;

    // Combine validation logic: the form is complete if either Storage or Disposal is valid
    const isValid = isStorageValid || isDisposalValid;

    console.log("isComplete value:", isValid); // Debugging the isComplete value for validation

    setIsComplete(isValid); // Set `isComplete` based on the combined validation logic
  }, [data, selectedStatus]); // Re-run whenever `data` or `selectedStatus` changes

  return (
    <div>
      <div className="flex w-full flex-col bg-gray-100 dark:bg-gray-700">
        <QrHeader step={step} handleEdit={handleEdit} />
        {step === "review" && (
          <div className="mt-20 flex w-full flex-col rounded-lg">
            <div className="bg-white px-3 py-6">
              <p className="flex px-2 text-base font-semibold">
                {t("common:reviewInfo")}
              </p>
              <p className="flex px-2 text-xs text-gray-500">
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
        <div className="mt-2">
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

        <SaveButton
          onClick={handleClick}
          text={
            step === "review"
              ? t("common:saveButton")
              : t("common:continueButton")
          }
          disabled={!isComplete}
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
    </div>
  );
};

export default ScannedResult;
