import React, { useEffect } from "react";
import { CylinderStatusSelect } from "../../../constants/CylinderStatusSelect";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const ScanCodes = ({
  selectedStatus,
  setSelectedStatus
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const cylinderData = location.state?.data;
  const eccId = cylinderData.serialNumber;
  useEffect(() => {
    setSelectedStatus(cylinderData.status)
  }, [])


  return (
    <div className="flex flex-col py-0 px-4">
      <div className="border p-2 w-full">
        <h1 className="font-bold leading-loose">
          Cylinder Information
        </h1>
        {/* {!eccId && (
          <p className="text-red-500 text-sm mb-7">
            {t("qrScanner:noCylinderDataScanned")}
          </p>
        )} */}
        <div className="mt-4 text-lg w-full">
          <div className="mt-2 w-full">
            <label className="block text-sm text-primaryText font-semibold">
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
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
      </div>
    </div>
  );
};

export default ScanCodes;
