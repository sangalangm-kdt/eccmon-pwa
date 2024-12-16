/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ScanCodes from "./ScanCodes";
import SaveButton from "../../../constants/SaveButton";
import { CylinderInfo, QrHeader } from "./components";
import { useCylinderUpdate } from "../../../../hooks/cylinderUpdates";
import AddedOrUpdateSuccessfully from "../../../constants/addedOrUpdateSuccessfully";
import CycleModal from "../../../constants/CycleModal";

const ScannedResult = () => {
  const [selectedStatus, setSelectedStatus] = useState("None");
  const [data, setData] = useState({});
  const { addUpdate } = useCylinderUpdate();
  const [step, setStep] = useState("view");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("success"); // To control the modal type
  const [currentCycle, setCurrentCycle] = useState(0);

  const handleClick = (e) => {
    e.preventDefault();
    console.log(data, selectedStatus);

    if (step === "view") {
      setStep("review");
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
    console.log(data, selectedStatus);
  }, [data]);

  const isDataValid = Object.keys(data).length > 0 && selectedStatus !== "None"; // Check if data is not empty

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
          />
        </div>
        <SaveButton
          onClick={handleClick}
          text={step === "review" ? "Save" : "Continue"}
          disabled={!isDataValid}
        />
      </div>

      {modalOpen &&
        (isDataValid ? (
          modalType === "Storage" ? (
            <CycleModal
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
