import React from "react";
import { useTranslation } from "react-i18next";
import ResponsiveDatePicker from "../../../../constants/ResponsiveDatePicker";

const CustomDateRange = ({ startDate, endDate, handleDateChange }) => {
  const { t } = useTranslation("date");

  return (
    <div className="item-center mb-2 flex justify-between gap-2 p-2">
      <div className="min-w-0 flex-1 lg:w-full">
        <ResponsiveDatePicker
          selected={startDate}
          onChange={(date) => handleDateChange(date, "startDate")}
          title={t("startDate")}
          maxDate={endDate ?? undefined}
        />
      </div>
      <div className="min-w-0 flex-1 xs:w-32 sm:w-48 md:w-56 lg:w-full">
        <ResponsiveDatePicker
          selected={endDate}
          onChange={(date) => handleDateChange(date, "endDate")}
          title={t("endDate")}
          minDate={startDate ?? undefined}
        />
      </div>
    </div>
  );
};

export default CustomDateRange;
