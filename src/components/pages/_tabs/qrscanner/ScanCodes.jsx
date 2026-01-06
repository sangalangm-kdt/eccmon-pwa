/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { CylinderStatusSelect } from "../../../constants/CylinderStatusSelect";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const ScanCodes = ({ selectedStatus, setSelectedStatus, disabled, step }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const cylinderData = location.state?.data;
  const eccId = cylinderData.serialNumber;

  // console.log("dattaa", location);
  useEffect(() => {
    setSelectedStatus(cylinderData.status);
  }, [cylinderData.status]);

  // Translate selectedStatus dynamically
  const translatedStatus = t(`qrScanner:${selectedStatus.toLowerCase()}`);

  const marginTop = step === "review" ? "mt-2" : "mt-28";

  return (
    <div className={`flex flex-col px-4 py-0 ${marginTop}`}>
      <div className="w-full rounded-lg bg-white px-2 py-8 dark:bg-gray-500">
        <h1 className="color-primary font-semibold leading-loose">
          {t("qrScanner:cylinderInformation")}
        </h1>
        <label className="text-xs text-secondaryText dark:text-gray-100">
          {t("qrScanner:cylinderDetailsInfo")}
        </label>
        <div className="mt-4 w-full text-lg">
          <div className="mb-2 mt-2 w-full">
            <label className="mb-1 block text-sm font-semibold text-primaryText dark:text-gray-100">
              {t("qrScanner:serialNumber")}
            </label>
            <input
              type="text"
              value={eccId}
              readOnly
              className="w-full rounded border bg-gray-100 p-2 text-sm dark:bg-gray-600"
              disabled
            />
          </div>
          <CylinderStatusSelect
            selectedStatus={selectedStatus} // Use translated status here
            setSelectedStatus={setSelectedStatus}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default ScanCodes;
