import React, { useEffect, useState } from "react";
import DateField from "../../../../constants/DateField";
import { useDispatch, useSelector } from "react-redux";
import LocationDropdown from "../../../../constants/LocationDropdown";
import { fetchProcessStorageLocation } from "../../../../../features/process/processLocationSlice";
import { useLocationProcess } from "../../../../../hooks/locationProcess";

const Storage = ({ setIsComplete, onDateChange }) => {
  // const dispatch = useDispatch();
  // const [disposedStatus, setDisposedStatus] = useState(0);
  const [startDate, setStartDate] = useState("");
  // const [location, setLocation] = useState("");

  // // Accessing scanned code and storage options from Redux state
  // const scannedCode = useSelector((state) => state.scannedCode.data);
  // const { storage, loading, error } = useSelector((state) => state.process);

  // useEffect(() => {
  //   dispatch(fetchProcessStorageLocation());
  // }, [dispatch]);

  const handleDateChange = (date) => {
    setStartDate(date);
    onDateChange(date);

    // Update completion state
    if (setIsComplete) {
      setIsComplete(date !== ""); // Check if both date and location are filled
    }
  };

  // const handleLocationChange = (newLocation) => {
  //   setLocation(newLocation);
  //   console.log("Selected Location:", newLocation);

  //   // Update completion state
  //   if (setIsComplete) {
  //     setIsComplete(startDate !== "" && newLocation !== ""); // Check if both date and location are filled
  //   }
  // };
  const {storage, storageMutate} = useLocationProcess();

  return (
    <div className="flex flex-col">
      <div className="border p-2 w-full">
        <h2 className="font-semibold mb-6">Storage Status</h2>
        {/* <div className="flex flex-col mb-4">
          <label>Disposed Status:</label>
          <span
            className={
              st === 0 ? "text-red-500 font-bold" : "text-green-500"
            }
          >
            {disposedStatus === 0 ? "No" : "Yes"}
          </span>
        </div> */}
        <div>
          <label>Location site</label>
          <div className="border rounded">
            <LocationDropdown
              options={storage?.data.filter((item) => {return item.status !== 2})}
            />
          </div>
          <div>
            <label>Start Date</label>
            <DateField onChange={handleDateChange} value={startDate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storage;
