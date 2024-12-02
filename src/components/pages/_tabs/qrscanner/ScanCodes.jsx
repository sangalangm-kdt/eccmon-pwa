/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { CylinderStatusSelect } from "../../../constants/CylinderStatusSelect";
import { useLocation } from "react-router-dom";
import { CylinderInfo } from "./components";
import { useTranslation } from "react-i18next";

const ScanCodes = ({ setIsComplete, onScannedCodeChange }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const scannedCode = location.state?.data;
  const loading = useSelector((state) => state.scannedCode.loading);
  const eccId = scannedCode?.eccId || "";

  useEffect(() => {
    console.log("Scanned Code:", scannedCode);

    const isComplete = !!eccId && !!scannedCode?.cylinderStatus;
    setIsComplete(isComplete);

    if (onScannedCodeChange) {
      onScannedCodeChange(scannedCode, eccId);
    }

    // Update the selectedStatus based on scannedCode
    if (scannedCode?.cylinderStatus) {
      setSelectedStatus(scannedCode.cylinderStatus);
    }
  }, [scannedCode, eccId, setIsComplete, onScannedCodeChange]);

  console.log("Current Status:", selectedStatus);

  return (
    <div className="flex flex-col py-0 px-4">
      <div className="border p-2 w-full">
        <h1 className="font-bold leading-loose ">
          {t("qrScanner:cylinderInformation")}
        </h1>
        {loading && <p>Loading...</p>}
        {!loading && !eccId && (
          <p className="text-red-500 text-sm mb-7">
            {t("qrScanner:noCylinderDataScanned")}
          </p>
        )}
        <div className="mt-4 text-lg w-full">
          <div className="mt-2 w-full">
            <label className="block text-sm  text-primaryText font-semibold">
              {t("qrScanner:serialNumber")}
            </label>
            <input
              type="text"
              value={eccId}
              readOnly
              className="p-2 border rounded w-full bg-gray-100"
              disabled
            />
          </div>
        </div>
        <CylinderStatusSelect
          onStatusChange={setSelectedStatus} // Update selectedStatus on change
          scannedCode={scannedCode}
        />
      </div>

      {/* Pass selectedStatus to CylinderInfo */}
      {/* <div className="mt-4">
        <CylinderInfo
          selectedStatus={selectedStatus}
          setIsComplete={setIsComplete}
          // isNewScan={!scannedCode?.cylinderStatus}
          onDateChange={(date) => console.log("Date changed:", date)}
          onDisposedChange={(disposed) => console.log("Disposed:", disposed)}
          handleSaveStorageData={(data) => console.log("Save data:", data)}
        />
      </div> */}
    </div>
  );
};

export default ScanCodes;
