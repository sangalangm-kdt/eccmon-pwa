/* eslint-disable react-hooks/exhaustive-deps */
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
  }, []);

  return (
    <div className="flex flex-col py-0 px-4 mt-28">
      <div className=" px-2 py-8 w-full rounded-lg bg-white">
        <h1 className="font-semibold leading-loose color-primary">
          Cylinder Information
        </h1>
        <label className="text-xs text-secondaryText">
          Kindly fill out the needed information below
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
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default ScanCodes;
