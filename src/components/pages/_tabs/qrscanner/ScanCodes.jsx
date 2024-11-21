import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { CylinderStatusSelect } from "../../../constants/CylinderStatusSelect";

const ScanCodes = ({
  setIsComplete,
  setSelectedStatus,
  onScannedCodeChange,
}) => {
  const scannedCode = useSelector((state) => state.scannedCode.data);
  const loading = useSelector((state) => state.scannedCode.loading);
  const eccId = scannedCode?.eccId || "";

  useEffect(() => {
    console.log("Scanned Code:", scannedCode);
    const isComplete = eccId && scannedCode?.cylinderStatus;
    setIsComplete(isComplete);

    if (onScannedCodeChange) {
      onScannedCodeChange(scannedCode, eccId);
    }
  }, [scannedCode, setIsComplete, onScannedCodeChange, eccId]);

  return (
    <div className="flex flex-col py-0 px-4">
      <div className="border p-2 w-full">
        <h1 className="font-bold leading-loose">Cylinder Information</h1>
        {loading && <p>Loading...</p>}
        {!loading && !eccId && (
          <p className="text-red-500">No cylinder data scanned.</p>
        )}
        <div className="mt-4 text-lg w-full">
          <div className="mt-2 w-full">
            <label className="block text-sm font-medium text-gray-700">
              Serial Number
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
          onStatusChange={setSelectedStatus}
          scannedCode={scannedCode}
        />
      </div>
    </div>
  );
};

export default ScanCodes;
