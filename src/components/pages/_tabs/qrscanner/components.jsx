/* eslint-disable no-unused-vars */
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
import { useTranslation } from "react-i18next";
import AddIcon from "../../../constants/AddIcon";
import { TiArrowBack } from "react-icons/ti";

export const QrHeader = ({ isNewScan, setIsNewScan }) => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleBack = () => {
    dispatch(setPage("/qrscanner")); // Update the page state to 'home'
    navigate("/qrscanner"); // Navigate to the home page
  };
  const handleEdit = () => {
    setIsNewScan(true); // Switch to edit mode
  };
  return (
    <div>
      <div className="flex flex-row w-full py-8 px-4 bg-white fixed rounded-b-3xl mb-3 z-20 shadow-sm">
        {/* Back arrow */}
        <div className="flex-shrink-0 " onClick={handleBack}>
          <TiArrowBack size={24} className="fill-primaryText" />
        </div>

        {/* Centered text */}
        <p className="flex-grow text-center text-base text-primaryText font-semibold">
          Scanned Result
        </p>
        {/* Edit Button */}
        {!isNewScan && (
          <button
            className="flex-shrink-0 bg-primaryText text-white px-4 py-2 rounded-lg ml-4"
            onClick={handleEdit}
          >
            Edit
          </button>
        )}
      </div>
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
            <div className="border p-2">
              <AddIcon />
            </div>
          </div>
        );
    }
  };

  return <div>{renderContent()}</div>; // Return the rendered content
};
