import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProcessDisassemblyLocation,
  fetchProcessAssemblyLocation,
  fetchProcessFinishingLocation,
  fetchProcessGroovingLocation,
  fetchProcessLMDLocation,
} from "../../../../../features/process/processLocationSlice";
import LocationDropdown from "../../../../constants/LocationDropdown";
import DateField from "../../../../constants/DateField";
import ButtonYesOrNo from "../../../../constants/ButtonYesOrNo";
import Cycle from "../../../../constants/Cycle";
import OrderNo from "../../../../constants/OrderNo";
import { useLocationProcess } from "../../../../../hooks/locationProcess";

const Process = ({ selectedProcessorStatus, onDateChange }) => {
  const [selectedProcessor, setSelectedProcessor] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const {grooving, groovingMutate, disassembly, disassemblyMutate, lmd, lmdMutate, finishing, finishingMutate, assembly, assemblyMutate} = useLocationProcess();
  const dispatch = useDispatch();

  // Accessing process location options and loading state from Redux
  // const { disassembly, assembly, finishing, grooving, lmd, loading, error } =
  //   useSelector((state) => state.process);

  // Fetch process locations on component mount
  useEffect(() => {
    dispatch(fetchProcessDisassemblyLocation());
    dispatch(fetchProcessAssemblyLocation());
    dispatch(fetchProcessFinishingLocation());
    dispatch(fetchProcessGroovingLocation());
    dispatch(fetchProcessLMDLocation());
  }, [dispatch]);

  // Handle loading and error states
  // if (loading) {
  //   return <div>Loading process locations...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  // Render locations based on selectedProcessorStatus
  const renderLocations = () => {
    switch (selectedProcessorStatus) {
      case "Disassembly":
        return (
          <div>
            <div>
              <label>Processor</label>
              <LocationDropdown
                options={disassembly?.data.filter((item) => {return item.status !== 2})}
                // onLocationChange={setSelectedProcessor}
                // loading={loading}
                // error={error}
              />
            </div>
            <div>
              <label>Completion Date</label>
              <DateField />
            </div>
            <div>
              <label>Passed?</label>
              <ButtonYesOrNo />
            </div>
            <div>
              <Cycle />
            </div>
            <div>
              <OrderNo />
            </div>
          </div>
        );
      case "Assembly":
        return (
          <div>
            <div>
              <label>Processor</label>
              <LocationDropdown
                options={assembly?.data.filter((item) => {return item.status !== 2})}
                // onLocationChange={setSelectedProcessor}
                // loading={loading}
                // error={error}
              />
            </div>
            <div>
              <label>Completion Date</label>
              <DateField />
            </div>
            <div>
              <label>Passed?</label>
              <ButtonYesOrNo />
            </div>
            <div>
              <Cycle />
            </div>
            <div>
              <OrderNo />
            </div>
          </div>
        );
      case "Finishing":
        return (
          <div>
            <div>
              <label>Processor</label>
              <LocationDropdown
                options={finishing?.data.filter((item) => {return item.status !== 2})}
                // onLocationChange={setSelectedProcessor}
                // loading={loading}
                // error={error}
              />
            </div>
            <div>
              <label>Completion Date</label>
              <DateField />
            </div>
            <div>
              <label>Passed?</label>
              <ButtonYesOrNo />
            </div>
            <div>
              <Cycle />
            </div>
            <div>
              <OrderNo />
            </div>
          </div>
        );
      case "Grooving":
        return (
          <div>
            <div>
              <label>Processor</label>
              <LocationDropdown
                options={grooving?.data.filter((item) => {return item.status !== 2})}
                // onLocationChange={setSelectedProcessor}
                // loading={loading}
                // error={error}
              />
            </div>
            <div>
              <label>Completion Date</label>
              <DateField />
            </div>
            <div>
              <label>Passed?</label>
              <ButtonYesOrNo />
            </div>
            <div>
              <Cycle />
            </div>
            <div>
              <OrderNo />
            </div>
          </div>
        );
      case "LMD":
        return (
          <div>
            <div>
              <label>Processor</label>
              <LocationDropdown
                options={lmd?.data.filter((item) => {return item.status !== 2})}
                // onLocationChange={setSelectedProcessor}
                // loading={loading}
                // error={error}
              />
            </div>
            <div>
              <label>Completion Date</label>
              <DateField />
            </div>
            <div>
              <label>Passed?</label>
              <ButtonYesOrNo />
            </div>
            <div>
              <Cycle />
            </div>
            <div>
              <OrderNo />
            </div>
          </div>
        );
      default:
        return <div>Please select a valid processor status.</div>;
    }
  };

  return (
    <div className="flex flex-col w-full border p-2">
      <label className="font-semibold mb-4">Process status</label>
      {renderLocations()}
    </div>
  );
};

export default Process;
