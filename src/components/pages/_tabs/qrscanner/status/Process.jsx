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
import { useTranslation } from "react-i18next"; // Import useTranslation for translations

const Process = ({ selectedProcessorStatus, onDateChange }) => {
  const { t } = useTranslation("qrScanner"); // Use the correct namespace
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
      case t("qrScanner:disassembly"):
        return (
          <div>
            <CaseButton
              initialSelectedCase={selectedCase} // Pass selectedCase, initially null for no selection
              setSelectedCase={setSelectedCase}
            />
            <label className="text-sm text-primaryText font-semibold mt-2">
              {t("qrScanner:processor")}
            </label>
            <LocationDropdown
              options={disassembly?.data.filter((item) => item.status !== 2)}
            />
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:completionDate")}
              </label>
              <DateField />
            </div>
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:passed")}
              </label>
              <ButtonYesOrNo />
            </div>
            <Cycle />
            <OrderNo />
          </div>
        );
      case t("qrScanner:assembly"):
        return (
          <div>
            <CaseButton
              initialSelectedCase={selectedCase}
              setSelectedCase={setSelectedCase}
            />
            <label className="text-sm text-primaryText font-semibold mt-2">
              {t("qrScanner:processor")}
            </label>
            <LocationDropdown
              options={assembly?.data.filter((item) => item.status !== 2)}
            />
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:completionDate")}
              </label>
              <DateField />
            </div>
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:passed")}
              </label>
              <ButtonYesOrNo />
            </div>
            <Cycle />
            <OrderNo />
          </div>
        );
      case t("qrScanner:finishing"):
        return (
          <div>
            <CaseButton
              initialSelectedCase={selectedCase}
              setSelectedCase={setSelectedCase}
            />
            <label className="text-sm text-primaryText font-semibold mt-2">
              {t("qrScanner:processor")}
            </label>
            <LocationDropdown
              options={finishing?.data.filter((item) => item.status !== 2)}
            />
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:completionDate")}
              </label>
              <DateField />
            </div>
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:passed")}
              </label>
              <ButtonYesOrNo />
            </div>
            <Cycle />
            <OrderNo />
          </div>
        );
      case t("qrScanner:grooving"):
        return (
          <div>
            <CaseButton
              initialSelectedCase={selectedCase}
              setSelectedCase={setSelectedCase}
            />
            <label className="text-sm text-primaryText font-semibold mt-2">
              {t("qrScanner:processor")}
            </label>
            <LocationDropdown
              options={grooving?.data.filter((item) => item.status !== 2)}
            />
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:completionDate")}
              </label>
              <DateField />
            </div>
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:passed")}
              </label>
              <ButtonYesOrNo />
            </div>
            <Cycle />
            <OrderNo />
          </div>
        );
      case t("qrScanner:lmd"):
        return (
          <div>
            <CaseButton
              initialSelectedCase={selectedCase}
              setSelectedCase={setSelectedCase}
            />
            <label className="text-sm text-primaryText font-semibold mt-2">
              {t("qrScanner:processor")}
            </label>
            <LocationDropdown
              options={lmd?.data.filter((item) => item.status !== 2)}
            />
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:completionDate")}
              </label>
              <DateField />
            </div>
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:passed")}
              </label>
              <ButtonYesOrNo />
            </div>
            <Cycle />
            <OrderNo />
          </div>
        );
      default:
        return <div>{t("qrScanner:selectValidProcessorStatus")}</div>;
    }
  };

  return (
    <div className="flex flex-col w-full p-2 bg-white rounded-lg">
      <h2 className="font-semibold text-md leading-loose text-primaryText mt-2">
        {t("qrScanner:processStatus")}
      </h2>
      {renderLocations()}
    </div>
  );
};

export default Process;
