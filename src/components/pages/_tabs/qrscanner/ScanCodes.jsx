import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CylinderStatusSelect } from "../../../constants/CylinderStatusSelect";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const ScanCodes = ({
  setIsComplete,
  setSelectedStatus,
  onScannedCodeChange,
}) => {
  const location = useLocation();
  const { t } = useTranslation();
  const scannedCode = location.state?.data;
  // const loading = useSelector((state) => state.scannedCode.loading);
  const eccId = scannedCode?.serialNumber || "";
  // const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    console.log("Scanned Code:", scannedCode);

    const isComplete = !!eccId && !!scannedCode?.status;
    setIsComplete(isComplete);

    if (onScannedCodeChange) {
      onScannedCodeChange(eccId);
    }

    // Update the selectedStatus based on scannedCode
    if (scannedCode?.status) {
      setSelectedStatus(scannedCode.status);
    }
  }, [
    scannedCode,
    eccId,
    setIsComplete,
    onScannedCodeChange,
    setSelectedStatus,
  ]);

  return (
    <div className="flex flex-col py-0 px-4">
      <div className="border p-2 w-full">
        <h1 className="font-bold leading-loose">
          {t("qrScanner:cylinderInformation")}
        </h1>
        {!eccId && (
          <p className="text-red-500 text-sm mb-7">
            {t("qrScanner:noCylinderDataScanned")}
          </p>
        )}
        <div className="mt-4 text-lg w-full">
          <div className="mt-2 w-full">
            <label className="block text-sm text-primaryText font-semibold">
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
          onStatusChange={setSelectedStatus}
          scannedCode={scannedCode}
        />
      </div>
    </div>
  );
};

export default ScanCodes;
