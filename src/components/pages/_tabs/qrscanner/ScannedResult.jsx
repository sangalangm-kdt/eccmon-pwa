import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCylinderStatus } from "../../../../features/status/statusSlice"; // Adjust path as necessary
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
  const [isDisposalComplete, setIsDisposalComplete] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [eccId, setEccId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisposed, setIsDisposed] = useState(0);
  const [existingData, setExistingData] = useState(null);

  const isFormComplete =
    isScannedResultComplete && isDisposalComplete && selectedDate !== "";

  useEffect(() => {
    dispatch(fetchCylinderStatus());
  }, [dispatch]);

  useEffect(() => {
    if (cylinderStatus && cylinderStatus.currentStatus) {
      setSelectedStatus(cylinderStatus.currentStatus);
    }
  }, [cylinderStatus]);

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
      setExistingData(storageData);
      handleSave(storageData);
    }
  };

  const handleSave = (storageData) => {
    if (!eccId || !storageData) {
      console.log("ECC ID or Storage data is empty. Cannot save data.");
      return;
    }

    const actionHistory = {
      eccId,
      isDisposed: storageData.isDisposed,
      cylinderStatus: selectedStatus,
      startDate: storageData.startDate,
      action: "saved",
    };

    console.log("Action history to be saved:", actionHistory);
    try {
      localStorage.setItem("actionHistory", JSON.stringify(actionHistory));
      console.log("Action history saved to localStorage.");
      navigate("/index");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleConfirmDelete = () => {
    handleDeletion();
    setIsModalOpen(false);
  };

  const handleStatusChange = (status) => {
    console.log("New status selected", status);
    setSelectedStatus(status);
  };

  const handleScannedCodeChange = (code, eccId) => {
    setEccId(eccId);
    setIsScannedResultComplete(true);
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
      setExistingData(actionHistory);
      navigate("/qrscanner");
    } catch (error) {
      console.error("Error saving disposal data:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <QrHeader />
      <ScanCodes
        setIsComplete={setIsScannedResultComplete}
        setSelectedStatus={handleStatusChange}
        onScannedCodeChange={handleScannedCodeChange}
      />
      <div className="mt-2">
        <CylinderInfo
          selectedStatus={selectedStatus}
          setIsComplete={setIsDisposalComplete}
          onDateChange={setSelectedDate}
          selectedDate={selectedDate}
          handleSaveStorageData={handleSave}
          existingData={existingData} // Pass existing data to CylinderInfo
        />
      </div>

      <SaveButton disabled={!isFormComplete || !eccId} onClick={handleSubmit} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </form>
  );
};

export default ScannedResult;
