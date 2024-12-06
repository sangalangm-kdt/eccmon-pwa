/* eslint-disable no-unused-vars */
import React, { useState } from "react";
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
import CaseButton from "../../../../constants/CaseButton";

const Process = ({ selectedProcessorStatus, onDateChange }) => {
  const [selectedCase, setSelectedCase] = useState(""); // Initially null, means no case selected

  const {
    grooving,
    groovingMutate,
    disassembly,
    disassemblyMutate,
    lmd,
    lmdMutate,
    finishing,
    finishingMutate,
    assembly,
    assemblyMutate,
  } = useLocationProcess();

  // Function to render different locations based on selectedProcessorStatus
  const renderLocations = () => {
    switch (selectedProcessorStatus) {
      case "Disassembly":
        return (
          <div>
            <CaseButton
              initialSelectedCase={selectedCase} // Pass selectedCase, initially null for no selection
              setSelectedCase={setSelectedCase}
            />
            <LocationDropdown
              options={disassembly?.data.filter((item) => item.status !== 2)}
            />
            <div>
              <label className="text-sm text-primaryText font-semibold">
                Completion Date
              </label>
              <DateField />
            </div>
            <div>
              <label className="text-sm text-primaryText font-semibold">
                Passed?
              </label>
              <ButtonYesOrNo />
            </div>
            <Cycle />
            <OrderNo />
          </div>
        );
      case "Assembly":
        return (
          <div>
            <CaseButton
              initialSelectedCase={selectedCase}
              setSelectedCase={setSelectedCase}
            />
            <LocationDropdown
              options={assembly?.data.filter((item) => item.status !== 2)}
            />
            <div>
              <label className="text-sm text-primaryText font-semibold">
                Completion Date
              </label>
              <DateField />
            </div>
            <div>
              <label className="text-sm text-primaryText font-semibold">
                Passed?
              </label>
              <ButtonYesOrNo />
            </div>
            <Cycle />
            <OrderNo />
          </div>
        );
      case "Finishing":
        return (
          <div>
            <CaseButton
              initialSelectedCase={selectedCase}
              setSelectedCase={setSelectedCase}
            />
            <LocationDropdown
              options={finishing?.data.filter((item) => item.status !== 2)}
            />
            <div>
              <label className="text-sm text-primaryText font-semibold">
                Completion Date
              </label>
              <DateField />
            </div>
            <div>
              <label className="text-sm text-primaryText font-semibold">
                Passed?
              </label>
              <ButtonYesOrNo />
            </div>
            <Cycle />
            <OrderNo />
          </div>
        );
      case "Grooving":
        return (
          <div>
            <CaseButton
              initialSelectedCase={selectedCase}
              setSelectedCase={setSelectedCase}
            />
            <LocationDropdown
              options={grooving?.data.filter((item) => item.status !== 2)}
            />
            <div>
              <label className="text-sm text-primaryText font-semibold">
                Completion Date
              </label>
              <DateField />
            </div>
            <div>
              <label className="text-sm text-primaryText font-semibold">
                Passed?
              </label>
              <ButtonYesOrNo />
            </div>
            <Cycle />
            <OrderNo />
          </div>
        );
      case "LMD":
        return (
          <div>
            <CaseButton
              initialSelectedCase={selectedCase}
              setSelectedCase={setSelectedCase}
            />
            <LocationDropdown
              options={lmd?.data.filter((item) => item.status !== 2)}
            />
            <div>
              <label className="text-sm text-primaryText font-semibold">
                Completion Date
              </label>
              <DateField />
            </div>
            <div>
              <label className="text-sm text-primaryText font-semibold">
                Passed?
              </label>
              <ButtonYesOrNo />
            </div>
            <Cycle />
            <OrderNo />
          </div>
        );
      default:
        return <div>Please select a valid processor status.</div>;
    }
  };

  return (
    <div className="flex flex-col w-full p-2 bg-white rounded-lg">
      <h2 className="font-semibold text-md leading-loose text-primaryText mt-2">
        Process Status
      </h2>
      {renderLocations()}
    </div>
  );
};

export default Process;
