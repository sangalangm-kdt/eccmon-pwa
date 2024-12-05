/* eslint-disable no-unused-vars */
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
import CaseButton from "../../../../constants/CaseButton";

const Process = ({ selectedProcessorStatus, onDateChange }) => {
  const [selectedProcessor, setSelectedProcessor] = useState("");
  const [completionDate, setCompletionDate] = useState("");
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

  const renderLocations = () => {
    switch (selectedProcessorStatus) {
      case "Disassembly":
        return (
          <div>
            <div>
              <CaseButton />
              <LocationDropdown
                options={disassembly?.data.filter((item) => {
                  return item.status !== 2;
                })}
              />
            </div>
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
              <div>
                <CaseButton />
              </div>
              <LocationDropdown
                options={assembly?.data.filter((item) => {
                  return item.status !== 2;
                })}
              />
            </div>
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
              <div>
                <CaseButton />
              </div>
              <LocationDropdown
                options={finishing?.data.filter((item) => {
                  return item.status !== 2;
                })}
              />
            </div>
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
              <div>
                <CaseButton />
              </div>
              <LocationDropdown
                options={grooving?.data.filter((item) => {
                  return item.status !== 2;
                })}
              />
            </div>
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
              <div>
                <CaseButton />
              </div>
              <LocationDropdown
                options={lmd?.data.filter((item) => {
                  return item.status !== 2;
                })}
              />
            </div>
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
    <div className="flex flex-col  w-full p-2 bg-white rounded-lg">
      <h2 className="font-semibold text-md leading-loose text-primaryText  mt-2">
        Process Status
      </h2>
      {renderLocations()}
    </div>
  );
};

export default Process;
