import React, { useEffect, useState } from "react";
import DateField from "../../../../constants/DateField";
import { useSelector } from "react-redux";

const Storage = ({
  setIsComplete,
  // existingData,
  onDateChange,
}) => {
  const [disposedStatus, setDisposedStatus] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [location, setLocation] = useState("Unknown");
  const scannedCode = useSelector((state) => state.scannedCode.data);

  // Handle date change from DateField component
  const handleDateChange = (date) => {
    setStartDate(date);
    if (onDateChange) {
      onDateChange(date);
    }

    if (setIsComplete) {
      setIsComplete(date !== "" && disposedStatus === 0);
    }
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  return (
    <div className="flex flex-col">
      <div className="border p-2 w-full">
        <h2 className="font-semibold mb-6">Storage Status</h2>
        <div className="flex flex-col mb-4">
          <label>Disposed Status:</label>
          <span
            className={
              disposedStatus === 0 ? "text-red-500 font-bold" : "text-green-500"
            }
          >
            {disposedStatus === 0 ? "No" : "Yes"}
          </span>
        </div>
        <div>
          <label>Start Date</label>
          <DateField onChange={handleDateChange} value={startDate} />
        </div>
        <div>
          <label>Location</label>
          <div className="w-full border rounded ">
            <input
              className="w-full mb-0 p-2 rounded"
              type="text"
              value={location}
              onChange={handleLocationChange}
              placeholder="Enter location"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storage;
