import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ScanCodes from "./ScanCodes";
import SaveButton from "../../../constants/SaveButton";
import { CylinderInfo, QrHeader } from "./components";
import Modal from "../../../constants/Modal";

const ScannedResult = () => {
  const navigate = useNavigate();

  const [isScannedResultComplete, setIsScannedResultComplete] = useState(false);
  const [isStatusComplete, setIsStatusComplete] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [eccId, setEccId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

  const isFormComplete =
    isScannedResultComplete && isStatusComplete && eccId && selectedStatus;

  useEffect(() => {
    setIsSaveButtonDisabled(!isFormComplete);
  }, [isFormComplete]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isFormComplete) {
      console.log("Form is incomplete. Cannot submit.");
      return;
    }

    if (selectedStatus === "Disposal") {
      setIsModalOpen(true);
    } else {
      console.log("Storage data to save:", { eccId, selectedDate });
      navigate("/");
    }
  };

  const handleConfirmDelete = () => {
    console.log("Disposal action confirmed:", { eccId, selectedDate });
    navigate("/qrscanner");
    setIsModalOpen(false);
  };

  const handleScannedCodeChange = (id) => {
    setEccId(id);
    setIsScannedResultComplete(true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <QrHeader />
      <ScanCodes
        setIsComplete={setIsScannedResultComplete}
        setSelectedStatus={setSelectedStatus}
        onScannedCodeChange={handleScannedCodeChange}
      />
      <div className="mt-4">
        <CylinderInfo
          selectedStatus={selectedStatus}
          setIsComplete={setIsStatusComplete}
          onDateChange={setSelectedDate}
          selectedDate={selectedDate}
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
