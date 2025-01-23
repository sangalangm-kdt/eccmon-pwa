/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import DateField from "../../../../constants/DateField";
import LocationDropdown from "../../../../constants/LocationDropdown";
import { useLocationProcess } from "../../../../../hooks/locationProcess";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Storage = ({
  showAlert,
  setShowAlert,
  selectedStatus,
  setData,
  setIsComplete,
  disabled,
}) => {
  const location = useLocation();
  const cylinderData = location.state?.data;

  const [date, setDate] = useState(() => {
    const today = cylinderData?.updates?.dateDone
      ? new Date(cylinderData?.updates?.dateDone)
      : new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`; // Return full dateTime
  });

  const { t } = useTranslation();
  const { storage } = useLocationProcess();
  const [processor, setProcessor] = useState(cylinderData?.updates?.location);

  useEffect(() => {
    setData({
      serialNumber: cylinderData?.serialNumber,
      location: processor,
      cycle: cylinderData?.cycle,
      dateDone: date,
    });

    if (setIsComplete) {
      setIsComplete(date !== undefined && processor !== "");
    }
  }, [processor, date, setData, setIsComplete]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    if (setIsComplete) {
      setIsComplete(newDate !== "" && processor !== "");
    }
  };

  const handleLocationChange = (newLocation) => {
    setProcessor(newLocation);
    if (setIsComplete) {
      setIsComplete(date !== "" && newLocation !== undefined);
    }
  };

  return (
    <div className="flex flex-col rounded-lg bg-white dark:bg-gray-500">
      <div className="w-full p-2">
        <h2 className="mb-2 mt-2 text-base font-semibold leading-loose text-primaryText dark:text-gray-100">
          {t("qrScanner:storageStatus")}
        </h2>
        {/* Show alert if some fields are missing */}
        <div>
          <label className="text-sm font-semibold text-primaryText dark:text-gray-200">
            {t("qrScanner:locationSite")}{" "}
            <strong className="text-red-500">*</strong>
          </label>
          <LocationDropdown
            options={storage?.data.filter((item) => item.status !== 2)}
            processor={processor}
            setProcessor={handleLocationChange}
            disabled={disabled}
          />
          {showAlert && !processor && (
            <div className="mb-2 rounded p-1 text-red-600">
              <p className="text-xs">Processor is required.</p>
            </div>
          )}
        </div>
        <div className="mb-4 mt-2">
          <label className="text-sm font-semibold text-primaryText dark:text-gray-200">
            {t("qrScanner:startDate")}{" "}
            <strong className="text-red-500">*</strong>
          </label>

          <DateField
            date={date}
            setDate={handleDateChange}
            disabled={disabled}
          />
          {showAlert && !date && (
            <div className="mb-2 rounded p-1 text-red-600">
              <p className="text-xs">Processor is required.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Storage;
