/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import DateField from "../../../../constants/DateField";

import LocationDropdown from "../../../../constants/LocationDropdown";

import { useLocationProcess } from "../../../../../hooks/locationProcess";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Storage = ({ setData }) => {
  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const location = useLocation();
  const cylinderData = location.state?.data;

  // const handleDateChange = (date) => {
  //   setDate(date);

  //   // Update completion state
  //   if (setIsComplete) {
  //     setIsComplete(date !== "");
  //   }
  // };
const Storage = ({ setIsComplete, onDateChange }) => {
  const [startDate, setStartDate] = useState("");
  const { t } = useTranslation();

  const handleDateChange = (date) => {
    setStartDate(date);
    onDateChange(date);

    // Update completion state
    if (setIsComplete) {
      setIsComplete(date !== "");
    }
  };

  const { storage, storageMutate } = useLocationProcess();
  const [processor, setProcessor] = useState();

  useEffect(() => {
    setData({
      "serialNumber" : cylinderData?.serialNumber,
      "location" : processor,
      "cycle" : cylinderData?.cycle,
      "dateDone" : date,
    })
  }, [processor, date])

  return (
    <div className="flex flex-col rounded-lg bg-white">
      <div className="p-2 w-full">
        <h2 className="font-semibold text-base leading-loose text-primaryText mb-6 mt-2">
          {t("qrScanner:storageStatus")}
        </h2>
        <div>
          <label className="text-sm font-semibold text-primaryText">
            {t("qrScanner:locationSite")}
          </label>{" "}
          <LocationDropdown
            options={storage?.data.filter((item) => {
              return item.status !== 2;
            })}
            setProcessor={setProcessor}
          />
        </div>
        <div className="mt-2 mb-4">
          <label className="text-sm font-semibold text-primaryText">
            {t("qrScanner:startDate")}
          </label>
          <DateField date={date} setDate={setDate} />
        </div>
      </div>
    </div>
  );
};

export default Storage;
