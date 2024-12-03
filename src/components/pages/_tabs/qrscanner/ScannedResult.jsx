import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { fetchCylinderStatus } from "../../../../features/status/statusSlice";
import ScanCodes from "./ScanCodes";
import SaveButton from "../../../constants/SaveButton";
import { CylinderInfo, QrHeader } from "./components";
import Modal from "../../../constants/Modal";
import { useNavigate } from "react-router-dom";

const ScannedResult = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cylinderStatus = useSelector((state) => state.status.cylinderStatus);

  const [isScannedResultComplete, setIsScannedResultComplete] = useState(false);
  const [isStatusComplete, setIsStatusComplete] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [eccId, setEccId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisposed, setIsDisposed] = useState(0);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true); // Default to true

  const isFormComplete =
    isScannedResultComplete &&
    isStatusComplete &&
    eccId !== "" &&
    selectedStatus !== "";

  // useEffect(() => {
  //   dispatch(fetchCylinderStatus());
  // }, [dispatch]);

  useEffect(() => {
    if (cylinderStatus && cylinderStatus.currentStatus) {
      setSelectedStatus(cylinderStatus.currentStatus);
    }
  }, [cylinderStatus]);

  useEffect(() => {
    setIsSaveButtonDisabled(!isFormComplete); // Update button state based on form completion
  }, [isFormComplete]); // Depend on form completion state

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!eccId) {
      console.log("ECC ID is empty. Cannot submit form.");
      return;
    }

    if (!isFormComplete) {
      console.log("Form is incomplete. Cannot submit.");
      return;
    }

    if (selectedStatus === "Disposal") {
      setIsDisposed(1);
      setIsModalOpen(true);
    } else if (selectedStatus === "Storage") {
      const storageData = { eccId, startDate: selectedDate, isDisposed };
      // handleSave(storageData);
    }
  };

  // const handleSave = (storageData) => {
  //   // const actionHistory = {
  //   //   eccId,
  //   //   isDisposed: storageData.isDisposed,
  //   //   cylinderStatus: selectedStatus,
  //   //   startDate: storageData.startDate,
  //   //   action: "saved",
  //   // };

  //   console.log("Action history to be saved:", actionHistory);
  //   try {
  //     // localStorage.setItem("actionHistory", JSON.stringify(actionHistory));
  //     console.log("Action history saved to localStorage.", actionHistory);
  //     navigate("/"); // Navigate to home or relevant page after saving
  //   } catch (error) {
  //     console.error("Error saving data:", error);
  //   }
  // };

  const handleConfirmDelete = () => {
    handleDeletion();
    setIsModalOpen(false);
  };

  const handleDeletion = () => {
    if (!eccId) {
      console.log("ECC ID is required for deletion.");
      return;
    }

    setIsDisposed(1);
    const actionHistory = {
      eccId,
      isDisposed: 1,
      cylinderStatus: "Disposal",
      date: selectedDate,
      action: "disposed",
    };

    console.log("Disposal action to be saved:", actionHistory);
    try {
      localStorage.setItem(
        "disposalActionHistory",
        JSON.stringify(actionHistory),
      );
      console.log("Disposal action saved.");
      navigate("/qrscanner"); // Navigate to relevant page after deletion
    } catch (error) {
      console.error("Error saving disposal data:", error);
    }
  };

  const handleStatusChange = (status) => {
    console.log("New status selected", status);
    setSelectedStatus(status);
  };

  const handleScannedCodeChange = (eccId) => {
    setEccId(eccId);
    setIsScannedResultComplete(true);
  };

  const handleStatusCompletion = (isComplete) => {
    setIsStatusComplete(isComplete);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <QrHeader />
      <ScanCodes
        setIsComplete={setIsScannedResultComplete}
        setSelectedStatus={handleStatusChange}
        selectedStatus={selectedStatus}
        onScannedCodeChange={handleScannedCodeChange}
      />
      <div className="mt-4">
        <CylinderInfo
          selectedStatus={selectedStatus}
          setIsComplete={handleStatusCompletion}
          onDateChange={setSelectedDate}
          selectedDate={selectedDate}
          // handleSaveStorageData={handleSave}
        />
      </div>

      <SaveButton disabled={isSaveButtonDisabled} onClick={handleSubmit} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </form>
  );
};

export default ScannedResult;
