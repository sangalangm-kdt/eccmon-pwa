import React, { useState, useEffect } from "react";
import { inputContainerClass } from "../styles/components";

const DateField = ({ date, setDate, disabled }) => {
  // Initialize with current date and time in "yyyy-mm-ddTHH:mm" format
  const [dateTime, setDateTime] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`; // Return full dateTime
  });

  useEffect(() => {
    if (date) {
      setDateTime(date);
    }
  }, [date]);

  // Handle date change and append current time to the selected date
  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const newDateTime = `${selectedDate}T${hours}:${minutes}`;
    setDate(newDateTime);
    setDateTime(newDateTime);
  };

  return (
    <div>
      <div className="border rounded text-sm">
        <input
          className={inputContainerClass}
          type="date"
          value={dateTime.split("T")[0] || ""} // Extract the date part (yyyy-mm-dd) for display
          onChange={handleDateChange}
          required
          disabled={disabled}
        />
        {/* Hidden input for the full dateTime (date and time) */}
        <input type="hidden" value={dateTime} required />
      </div>
    </div>
  );
};

export default DateField;
