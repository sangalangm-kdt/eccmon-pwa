/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useMemo, useRef } from "react";
import { CylinderStatusSelect } from "../../../constants/CylinderStatusSelect";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { normalizeScannedCylinder } from "../../../utils/cylinderStatus";

const getInitialOperationStatus = (cylinderData) => {
  const candidates = [
    cylinderData?.updates?.process,
    cylinderData?.updates?.status,
    cylinderData?.process,
    cylinderData?.status,
  ];

  for (const candidate of candidates) {
    if (
      candidate !== undefined &&
      candidate !== null &&
      `${candidate}`.trim() !== "" &&
      `${candidate}`.trim() !== "--"
    ) {
      return `${candidate}`.trim();
    }
  }

  return "None";
};

const ScanCodes = ({
  selectedStatus,
  setSelectedStatus,
  disabled,
  readOnly,
  step,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const initializedRef = useRef(false);

  const cylinderData = useMemo(
    () => normalizeScannedCylinder(location.state),
    [
      location.state?.data,
      location.state?.is_disposed,
      location.state?.isDisposed,
      location.state?.disposedReadOnly,
      location.state?.isNewCylinder,
    ],
  );
  const eccId = cylinderData?.serialNumber ?? "";

  useEffect(() => {
    if (!cylinderData || initializedRef.current) return;

    const isNewCylinder = location.state?.isNewCylinder === true;

    if (isNewCylinder) {
      setSelectedStatus("Storage");
    } else {
      setSelectedStatus(getInitialOperationStatus(cylinderData));
    }

    initializedRef.current = true;
  }, [cylinderData, location.state?.isNewCylinder, setSelectedStatus]);

  const marginTop = readOnly || step === "review" ? "mt-2" : "mt-28";

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
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            disabled={disabled || readOnly}
          />
        </div>
      </div>
    </div>
  );
};

export default ScanCodes;
