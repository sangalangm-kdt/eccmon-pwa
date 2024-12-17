/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import DateField from "../../../../constants/DateField";
import LocationDropdown from "../../../../constants/LocationDropdown";
import { useLocationProcess } from "../../../../../hooks/locationProcess";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Storage = ({ selectedStatus, setData, disabled, setIsComplete }) => {
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

  const [showAlert, setShowAlert] = useState(false); // State for showing alert

  // Update processor and date when selectedStatus changes
  useEffect(() => {
    setProcessor(
      selectedStatus === cylinderData?.status
        ? cylinderData?.updates?.location
        : ""
    );
    setDate(() => {
      const today =
        selectedStatus === cylinderData?.status &&
        cylinderData?.updates?.dateDone
          ? new Date(cylinderData?.updates?.dateDone)
          : new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const hours = String(today.getHours()).padStart(2, "0");
      const minutes = String(today.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`; // Return full dateTime
    });
  }, [selectedStatus]);

  useEffect(() => {
    setData({
      serialNumber: cylinderData?.serialNumber,
      location: processor,
      cycle: cylinderData?.cycle,
      dateDone: date,
    });

    // Trigger setIsComplete only if both date and processor are set
    if (setIsComplete) {
      setIsComplete(date !== "" && processor !== "");
    }
  }, [processor, date, setData, setIsComplete]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    // Update completion state based on both date and processor (location)
    if (setIsComplete) {
      setIsComplete(newDate !== "" && processor !== "");
    }
  };

  const handleLocationChange = (newLocation) => {
    setProcessor(newLocation);
    // Update completion state based on both date and processor (location)
    if (setIsComplete) {
      setIsComplete(date !== "" && newLocation !== "");
    }
  };

  useEffect(() => {
    // Show alert if either date or processor is empty ("")
    setShowAlert(date === "" || processor === "");
  }, [date, processor]);

  return (
    <div className="flex flex-col rounded-lg bg-white">
      <div className="p-2 w-full">
        <h2 className="font-semibold text-base leading-loose text-primaryText mb-6 mt-2">
          {t("qrScanner:storageStatus")}
        </h2>
        <div>
          <label className="text-sm font-semibold text-primaryText">
            {t("qrScanner:locationSite")}
          </label>
          <LocationDropdown
            options={storage?.data.filter((item) => item.status !== 2)}
            processor={processor}
            setProcessor={handleLocationChange} // Use the handler to update location
            disabled={disabled}
          />
        </div>
        <div className="mt-2 mb-4">
          <label className="text-sm font-semibold text-primaryText">
            {t("qrScanner:startDate")}
          </label>
          <DateField
            date={date}
            setDate={handleDateChange} // Use the handler to update date
            disabled={disabled}
          />
        </div>

        {showAlert && (
          <div className="bg-red-100 text-red-600 p-2 rounded-md mt-2">
            <p className="text-sm">
              {"All the required fields should be filled"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Storage;
