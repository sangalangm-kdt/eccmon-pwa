/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { CylinderStatusSelect } from "../../../constants/CylinderStatusSelect";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const ScanCodes = ({ selectedStatus, setSelectedStatus }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const cylinderData = location.state?.data;
  const eccId = cylinderData.serialNumber;

  useEffect(() => {
    setSelectedStatus(cylinderData.status);
  }, [cylinderData.status]);

  // Translate selectedStatus dynamically
  const translatedStatus = t(`qrScanner:${selectedStatus.toLowerCase()}`);
  console.log();

  return (
    <div className="flex flex-col py-0 px-4 mt-28">
      <div className=" px-2 py-8 w-full rounded-lg bg-white">
        <h1 className="font-semibold leading-loose color-primary">
          {t("qrScanner:cylinderInformation")}
        </h1>
        <label className="text-xs text-secondaryText">
          {t("qrScanner:cylinderDetailsInfo")}
        </label>
        <div className="mt-4 text-lg w-full">
          <div className="mt-2 w-full mb-2">
            <label className="block text-sm text-primaryText font-semibold mb-1">
              {t("qrScanner:serialNumber")}
            </label>
            <input
              type="text"
              value={eccId}
              readOnly
              className="p-2 border rounded w-full bg-gray-100 text-sm "
              disabled
            />
          </div>
          <CylinderStatusSelect
            selectedStatus={translatedStatus} // Use translated status here
            setSelectedStatus={setSelectedStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default ScanCodes;
