/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import DateField from "../../../../constants/DateField";

import LocationDropdown from "../../../../constants/LocationDropdown";

import { useLocationProcess } from "../../../../../hooks/locationProcess";
import { useTranslation } from "react-i18next";

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
          />
        </div>
        <div className="mt-2 mb-4">
          <label className="text-sm font-semibold text-primaryText">
            {t("qrScanner:startDate")}
          </label>
          <DateField onChange={handleDateChange} value={startDate} />
        </div>
      </div>
    </div>
  );
};

export default Storage;
