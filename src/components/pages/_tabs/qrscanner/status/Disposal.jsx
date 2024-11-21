import React, { useState, useEffect } from "react";
import DateField from "../../../../constants/DateField"; // Assuming DateField component is working as expected

const Disposal = ({ setIsComplete, onDateChange, onDisposedChange }) => {
  const [disposalDate, setDisposalDate] = useState(""); // Disposal date state
  const [isDisposed, setIsDisposed] = useState(0); // Automatically set to 0 (not disposed) or 1 (disposed)

  useEffect(() => {
    // Automatically mark as disposed when a disposal date is set
    if (disposalDate !== "") {
      setIsDisposed(1); // Set to 1 to indicate disposal
    }

    // Notify parent about disposal status change and disposal date
    if (typeof onDisposedChange === "function") {
      onDisposedChange(isDisposed); // Pass isDisposed to parent when it changes
    }

    // Notify parent about completion (date and disposal status)
    if (typeof setIsComplete === "function") {
      const isComplete = disposalDate !== "" && isDisposed === 1; // Complete if disposal date is set and disposed
      setIsComplete(isComplete); // Set completion status
    }
  }, [disposalDate, isDisposed, setIsComplete, onDisposedChange]);

  // Handle the disposal date change
  const handleDateChange = (date) => {
    setDisposalDate(date); // Update the disposal date
    if (onDateChange) {
      onDateChange(date); // Notify parent about the disposal date change
    }
  };

  return (
    <div className="flex flex-col">
      <div className="border p-2 w-full ">
        <h2 className="font-semibold mb-6">Disposal Status</h2>
        <div>
          <label>Disposal date</label>
          <DateField onChange={handleDateChange} />
        </div>
      </div>
    </div>
  );
};

export default Disposal;
