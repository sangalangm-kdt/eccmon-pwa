import React, { useState, useEffect } from "react";

const DateField = ({ onChange }) => {
  // Initialize with current date in "yyyy-mm-dd" format
  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  const [dateTime, setDateTime] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  });

  // Effect to call the onChange when the dateTime changes
  useEffect(() => {
    if (onChange) {
      onChange(dateTime);
    }
  }, [dateTime, onChange]);

  // Handle date change
  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    // Update the date and time in the proper format
    const newDateTime = `${selectedDate}T${hours}:${minutes}`;
    setDate(selectedDate); // Update date state
    setDateTime(newDateTime); // Update dateTime state
  };

  return (
    <div>
      <div className="p-2 border rounded">
        <input
          className="w-full mb-0"
          type="date"
          value={date || ""}
          onChange={handleDateChange}
          required
        />
        <input type="hidden" value={dateTime} required />
      </div>
    </div>
  );
};

export default DateField;
