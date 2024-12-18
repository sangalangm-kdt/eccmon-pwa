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
  const [showAlert, setShowAlert] = useState(false); // State to control the alert visibility

  const handleClick = (e) => {
    e.preventDefault();
    console.log(data, selectedStatus);

    // Check if location is valid before proceeding
    if (!data.location || data.location === "") {
      setShowAlert(true); // Show the alert if location is empty or undefined
      return; // Stop the further execution
    } else {
      setShowAlert(false); // Hide the alert if location is valid
    }

    if (step === "view") {
      // Check if the input fields are complete before moving to review
      if (isComplete) {
        setStep("review");
      }
    } else if (step === "review") {
      const updatedCycle = data.cycle;
      // if (selectedStatus === "Storage" && data?.process === "Dismounted") {
      //   // updatedCycle += 1;
      // }
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
    console.log(data, selectedStatus);
    // Update isComplete state whenever data changes or the selected status changes
    setIsComplete(
      Object.keys(data).length > 0 &&
        selectedStatus !== "None" &&
        data.location && // Ensure location is not null or empty
        data.location !== ""
    );
  }, [data, selectedStatus]);

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
          />
        </div>

        {showAlert && (
          <div className="bg-red-100 text-red-600 p-2 rounded-md mt-2">
            <p className="text-sm">Location is required. Please fill it out.</p>
          </div>
        )}

        <SaveButton
          onClick={handleClick}
          text={step === "review" ? "Save" : "Continue"}
          disabled={!isComplete} // Button should be disabled if isComplete is false
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
