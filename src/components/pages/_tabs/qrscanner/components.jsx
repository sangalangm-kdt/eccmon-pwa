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

export const QrHeader = ({ step, handleEdit, disabled }) => {
  const { t } = useTranslation("qrScanner");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBack = () => {
    dispatch(setPage("/qrscanner")); // Update the page state to 'home'
    navigate("/qrscanner"); // Navigate to the home page
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
          {t("qrScanner:scannedResult")}
        </p>

        {step === "review" && (
          <button
            type="button"
            className="absolute bg-primary top-2 right-2 px-4 py-2 text-white rounded"
            onClick={handleEdit}
            disabled={disabled}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export const CylinderInfo = ({ selectedStatus, setData, disabled }) => {
  // Common props to be passed to components
  const { t } = useTranslation("qrScanner");

  const translatedStatus = t(`qrScanner:${selectedStatus.toLowerCase()}`);

  // Render content based on selectedStatus
  const renderContent = () => {
    console.log("Rendering content for status:", translatedStatus);

    switch (translatedStatus) {
      case t("qrScanner:disposal"):
        return (
          <div className={containerClass}>
            <Disposal setData={setData} disabled={disabled} />
          </div>
        );
      case t("qrScanner:storage"):
        return (
          <div className={containerClass}>
            <Storage setData={setData} disabled={disabled} />
          </div>
        );
      // Grouping Process-related statuses
      case t("qrScanner:materialAndMachining"):
      case t("qrScanner:disassembly"):
      case t("qrScanner:grooving"):
      case t("qrScanner:lmd"):
      case t("qrScanner:assembly"):
      case t("qrScanner:finishing"):
        return (
          <div className={containerClass}>
            <Process
              selectedProcessorStatus={selectedStatus}
              setData={setData}
              disabled={disabled}
            />
          </div>
        );
      case t("qrScanner:mounted"):
        return (
          <div className={containerClass}>
            <Mounting setData={setData} disabled={disabled} />
          </div>
        );
      case t("qrScanner:dismounted"):
        return (
          <div className={containerClass}>
            <Dismounting setData={setData} disabled={disabled} />
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
