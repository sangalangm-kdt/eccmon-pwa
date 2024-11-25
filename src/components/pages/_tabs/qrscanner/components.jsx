import React from "react";
import Disposal from "./status/Disposal";
import Storage from "./status/Storage";
import Process from "./status/Process";
import Dismounting from "./status/Dismounting";
import Mounting from "./status/Mounting";
import { containerClass } from "../../../styles/components";
import { useDispatch } from "react-redux";
import { setPage } from "../../../../features/page/pageSlice";
import { useNavigate } from "react-router-dom";

export const QrHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleBack = () => {
    dispatch(setPage("/qrscanner")); // Update the page state to 'home'
    navigate("/qrscanner"); // Navigate to the home page
  };
  return (
    <div className="flex flex-col w-full py-8 px-6" onClick={handleBack}>
      <label>Back</label>
    </div>
  );
};

export const CylinderInfo = ({
  selectedStatus,
  setIsComplete,
  onDateChange,
  isNewScan,
  onDisposedChange,

  handleSaveStorageData,
}) => {
  // Common props to be passed to components
  const commonProps = {
    setIsComplete,
  };

  console.log("Current Selected Status:", selectedStatus);

  // Render content based on selectedStatus
  const renderContent = () => {
    console.log("Rendering content for status:", selectedStatus);

    switch (selectedStatus) {
      case "Disposal":
        return (
          <div className={containerClass}>
            <Disposal
              {...commonProps}
              onDateChange={onDateChange}
              onDisposedChange={onDisposedChange}
            />
          </div>
        );
      case "Storage":
        return (
          <div className={containerClass}>
            <Storage
              {...commonProps}
              isNewScan={isNewScan}
              onSaveData={handleSaveStorageData}
              onDateChange={onDateChange}
            />
          </div>
        );
      // Grouping Process-related statuses
      case "Material and Machining":
      case "Disassembly":
      case "Grooving":
      case "LMD":
      case "Assembly":
      case "Finishing":
        return (
          <div className={containerClass}>
            <Process
              {...commonProps}
              selectedProcessorStatus={selectedStatus}
            />
          </div>
        );
      case "Mounted":
        return (
          <div className={containerClass}>
            <Mounting {...commonProps} />
          </div>
        );
      case "Dismounted":
        return (
          <div className={containerClass}>
            <Dismounting {...commonProps} />
          </div>
        );
      default:
        return (
          <div className={containerClass}>
            <div className="border p-2">Please select a valid status</div>
          </div>
        );
    }
  };

  return <>{renderContent()}</>; // Return the rendered content
};
