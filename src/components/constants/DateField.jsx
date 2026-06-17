import React, { useEffect, useState } from "react";
import ResponsiveDatePicker from "./ResponsiveDatePicker";
import { parseDatePickerValue } from "../utils/datePickerConfig";

const DateField = ({ date, setDate, disabled }) => {
  const [selectedDate, setSelectedDate] = useState(() => parseDatePickerValue(date));

  useEffect(() => {
    setSelectedDate(parseDatePickerValue(date));
  }, [date]);

  const handleDateChange = (nextDate) => {
    if (!nextDate) {
      setDate("");
      setSelectedDate(null);
      return;
    }

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const datePart = `${nextDate.getFullYear()}-${String(
      nextDate.getMonth() + 1,
    ).padStart(2, "0")}-${String(nextDate.getDate()).padStart(2, "0")}`;

    setDate(`${datePart}T${hours}:${minutes}`);
    setSelectedDate(nextDate);
  };

  return (
    <ResponsiveDatePicker
      selected={selectedDate}
      onChange={handleDateChange}
      disabled={disabled}
      className="w-full"
    />
  );
};

export default DateField;
