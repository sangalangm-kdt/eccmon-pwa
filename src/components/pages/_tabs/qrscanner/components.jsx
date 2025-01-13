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
            className="absolute bg-primary top-6 right-4 px-4 py-2 text-white rounded"
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

export const CylinderInfo = ({
  selectedStatus,
  setData,
  disabled,
  setIsComplete,
  showAlert,
  setShowAlert,
}) => {
  const components = {
    disposal: Disposal,
    storage: Storage,
    mounted: Mounting,
    dismounted: Dismounting,
    disassembly: Process,
    grooving: Process,
    lmd: Process,
    assembly: Process,
    finishing: Process,
  };

  const Component = components[selectedStatus?.toLowerCase()];

  return (
    <div className={containerClass}>
      {Component ? (
        <Component
          selectedStatus={selectedStatus}
          selectedProcessorStatus={selectedStatus}
          setData={setData}
          disabled={disabled}
          setIsComplete={setIsComplete}
          showAlert={showAlert}
          setShowAlert={setShowAlert}
        />
      ) : (
        <div className="border p-2">{/* Default placeholder */}</div>
      )}
    </div>
  );
};
