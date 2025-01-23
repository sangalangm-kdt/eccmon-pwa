import React from "react";
import DatePicker from "react-datepicker";
import { FaRegCalendar } from "react-icons/fa";

const CustomDateRange = ({ startDate, endDate, handleDateChange }) => {
  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="relative w-full cursor-pointer" onClick={onClick} ref={ref}>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full border p-2 text-sm"
        placeholder="mm/dd/yy"
      />
      <FaRegCalendar className="absolute right-2 top-3 text-gray-500" />
    </div>
  ));

  CustomDateInput.displayName = "CustomDateInput";

  return (
    <div className="item-center mb-2 flex justify-between gap-1 p-2">
      <div className="flex-1 lg:w-full">
        <DatePicker
          selected={startDate}
          onChange={(date) => handleDateChange(date, "startDate")}
          className="custom-datepicker w-full border px-4 py-2"
          dateFormat="MM/dd/yy"
          customInput={<CustomDateInput />}
          popperClassName="custom-datepicker-popper"
        />
      </div>
      <div className="flex-1 xs:w-32 sm:w-48 md:w-56 lg:w-full">
        <DatePicker
          selected={endDate}
          onChange={(date) => handleDateChange(date, "endDate")}
          className="custom-datepicker w-full border px-4 py-2"
          dateFormat="MM/dd/yy"
          customInput={<CustomDateInput />}
          popperClassName="custom-datepicker-popper"
        />
      </div>
    </div>
  );
};

export default CustomDateRange;
