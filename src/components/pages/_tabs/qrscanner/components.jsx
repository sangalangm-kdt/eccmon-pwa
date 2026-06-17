/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
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
import { IoArrowBack } from "react-icons/io5";
import { setStateIfChanged } from "../../../utils/syncFormState";

const normalizeOperation = (selectedOperation) =>
  selectedOperation?.toLowerCase?.().trim?.() ?? "";

const statusComponentMap = {
  storage: Storage,
  process: Process,
  disassembly: Process,
  grooving: Process,
  lmd: Process,
  assembly: Process,
  finishing: Process,
  mounted: Mounting,
  mounting: Mounting,
  dismounted: Dismounting,
  dismounting: Dismounting,
  disposal: Disposal,
};

export const QrHeader = ({ step, handleEdit, disabled, onBack }) => {
  const { t } = useTranslation("qrScanner");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    navigate("/qrscanner"); // Navigate to the home page
  };

  return (
    <div>
      <div className="fixed z-20 mb-3 flex w-full flex-row rounded-b-3xl bg-white px-4 py-8 shadow-sm dark:bg-gray-600">
        {/* Back arrow */}
        <div className="flex" onClick={handleBack}>
          <IoArrowBack
            size={24}
            className="text-primaryText dark:text-gray-100"
          />
        </div>
        {/* Centered text */}
        <p className="flex-grow text-center text-base font-semibold text-primaryText dark:text-gray-100">
          {t("qrScanner:scannedResult")}
        </p>

        {step === "review" && (
          <button
            type="button"
            className={`absolute right-4 top-6 rounded px-4 py-2 text-white ${
              disabled
                ? "cursor-not-allowed bg-gray-300"
                : "bg-primary"
            }`}
            onClick={handleEdit}
            disabled={disabled}
          >
            {t("common:editButton")}
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
  readOnly,
  setIsComplete,
  setContinueDisabledReason,
  showAlert,
  setShowAlert,
}) => {
  const { t } = useTranslation("qrScanner");
  const normalizedOperation = normalizeOperation(selectedStatus);
  const Component = statusComponentMap[normalizedOperation];

  const selectStatusMessage = t("selectAStatus");

  useEffect(() => {
    if (!Component) {
      setStateIfChanged(setIsComplete, false);
      setContinueDisabledReason?.((prev) =>
        prev === selectStatusMessage ? prev : selectStatusMessage,
      );
    }
  }, [Component, selectStatusMessage, setContinueDisabledReason, setIsComplete]);

  return (
    <div className={containerClass}>
      {Component ? (
        <Component
          key={normalizedOperation}
          selectedStatus={selectedStatus}
          selectedProcessorStatus={selectedStatus}
          setData={setData}
          disabled={disabled || readOnly}
          readOnly={readOnly}
          setIsComplete={setIsComplete}
          setContinueDisabledReason={setContinueDisabledReason}
          showAlert={showAlert}
          setShowAlert={setShowAlert}
        />
      ) : (
        <div className="rounded-lg bg-white p-4 text-sm text-gray-500 dark:bg-gray-500 dark:text-gray-100">
          {t("selectAStatus")}
        </div>
      )}
    </div>
  );
};
