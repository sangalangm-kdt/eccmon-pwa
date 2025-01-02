import React, { useEffect, useState } from "react";
import ScanCodes from "./ScanCodes";
import SaveButton from "../../../constants/SaveButton";
import { CylinderInfo, QrHeader } from "./components";
import { useCylinderUpdate } from "../../../../hooks/cylinderUpdates";
import AddedOrUpdateSuccessfully from "../../../constants/AddedOrUpdateSuccessfully";
import CycleModal from "../../../constants/CycleModal";

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

    // Only show alert when Save button is clicked and location is invalid
    if (
      !data.location ||
      data.location === "" ||
      !data.serialNumber ||
      !data.cycle
    ) {
      console.log("Location is empty, show alert");
      setShowAlert(true); // Show the alert if location is empty or undefined
      return;
    } else {
      setShowAlert(false); // Hide the alert if location is valid
    }

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
    console.log("Data in useEffect:", data); // Debugging the data in useEffect

    // Check if the required fields are filled before updating `isComplete`
    const isLocationValid = data.location && data.location !== "";
    const isSerialNumberValid = data.serialNumber && data.serialNumber !== "";
    const isDateDoneValid = data.dateDone && data.dateDone !== "";
    const isCycleValid = data.cycle && data.cycle !== undefined;

    setIsComplete(
      isSerialNumberValid && isLocationValid && isDateDoneValid && isCycleValid
    );
  }, [data, selectedStatus]); // Re-run whenever `data` or `selectedStatus` changes

  return (
    <div>
      <div className="flex flex-col w-full bg-gray-100">
        <QrHeader step={step} handleEdit={handleEdit} />
        {step === "review" && (
          <div className="flex flex-col w-full mt-20 rounded-lg">
            <div className="bg-white py-6 px-3">
              <p className="flex font-semibold text-base px-2">
                Review information
              </p>
              <p className="flex text-xs text-gray-500 px-2">
                Is the information you submitted correct?
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
          text={step === "review" ? "Save" : "Continue"}
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
