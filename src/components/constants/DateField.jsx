import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import default styles
import { FaRegCalendar } from "react-icons/fa6"; // Import date icon from react-icons

const DateField = ({ date, setDate, disabled }) => {
  // Initialize with current date in "yyyy-mm-dd" format
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format as "yyyy-mm-dd"
  });

  // Ref to the DatePicker component
  const datePickerRef = useRef(null);

  useEffect(() => {
    if (date) {
      setSelectedDate(date.split("T")[0]); // Ensure only the date part is used
    }
  }, [date]);

  // Handle date change
  const handleDateChange = (date) => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const newDateTime = `${
      date.toISOString().split("T")[0]
    }T${hours}:${minutes}`;
    setDate(newDateTime);
    setSelectedDate(date.toISOString().split("T")[0]); // Update date display
  };

  // Handle icon click to open the date picker
  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setFocus();
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex w-full flex-row items-center rounded border text-sm dark:bg-gray-600">
        {/* DatePicker with responsive width */}
        <DatePicker
          ref={datePickerRef} // Attach the ref to the DatePicker
          className="w-full rounded bg-transparent px-2 py-2 text-gray-800 focus:outline-none dark:text-gray-100 sm:w-72 md:w-80 lg:w-96"
          selected={new Date(selectedDate)} // Convert string back to Date object
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd" // Keep the same date format
          disabled={disabled}
          required
        />

        {/* Calendar icon positioned at the right */}
        <FaRegCalendar
          className="absolute right-2 cursor-pointer text-gray-500 dark:text-gray-300"
          size={18}
          onClick={handleIconClick} // Trigger the DatePicker focus on click
        />

        {/* Hidden input for the full dateTime (date and time) */}
        {/* <input type="hidden" value={selectedDate} required /> */}
      </div>
    </div>
  );
};

export default DateField;
