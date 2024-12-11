/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import LocationDropdown from "../../../../constants/LocationDropdown";
import DateField from "../../../../constants/DateField";
import ButtonYesOrNo from "../../../../constants/ButtonYesOrNo";
import Cycle from "../../../../constants/Cycle";
import OrderNo from "../../../../constants/OrderNo";
import { useLocationProcess } from "../../../../../hooks/locationProcess";
import CaseButton from "../../../../constants/CaseButton";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation for translations

const Process = ({ selectedProcessorStatus, setData, disabled }) => {
  const { t } = useTranslation("qrScanner"); // Use the correct namespace
  const [selectedCase, setSelectedCase] = useState(""); // Initially null, means no case selected
  const [processor, setProcessor] = useState();
  const location = useLocation();
  const cylinderData = location.state?.data;
  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [passed, setPassed] = useState();
  const [cycle, setCycle] = useState(cylinderData?.cycle);
  const [selectedOrderNo, setSelectedOrderNo] = useState("");

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

  useEffect(() => {
    setData({
      serialNumber: cylinderData?.serialNumber,
      location: processor,
      dateDone: date,
      cycle: cycle,
      otherDetails: `{"case" : "${selectedCase}", "isPassed" : "${passed}", "orderNumber" : "${selectedOrderNo}"}`,
    });
  }, [processor, date, passed, cycle, selectedOrderNo, selectedCase]);

  // Function to render different locations based on selectedProcessorStatus
  const renderLocations = () => {
    switch (selectedProcessorStatus) {
      case t("qrScanner:disassembly"):
        return (
          <div>
            <CaseButton
              initialSelectedCase={selectedCase} // Pass selectedCase, initially null for no selection
              setSelectedCase={setSelectedCase}
              disabled={disabled}
            />
            <label className="text-sm text-primaryText font-semibold mt-2">
              {t("qrScanner:processor")}
            </label>
            <LocationDropdown
              options={disassembly?.data.filter((item) => item.status !== 2)}
              setProcessor={setProcessor}
              disabled={disabled}
            />
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:completionDate")}
              </label>
              <DateField date={date} setDate={setDate} disabled={disabled} />
            </div>
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:passed")}
              </label>
              <ButtonYesOrNo
                passed={passed}
                setPassed={setPassed}
                disabled={disabled}
              />
            </div>
            <Cycle cycle={cycle} setCycle={setCycle} disabled={disabled} />
            <OrderNo
              selectedOrderNo={selectedOrderNo}
              setSelectedOrderNo={setSelectedOrderNo}
              disabled={disabled}
            />
          </div>
        );
      case t("qrScanner:assembly"):
        return (
          <div>
            <CaseButton
              initialSelectedCase={selectedCase}
              setSelectedCase={setSelectedCase}
              disabled={disabled}
            />
            <label className="text-sm text-primaryText font-semibold mt-2">
              {t("qrScanner:processor")}
            </label>
            <LocationDropdown
              options={assembly?.data.filter((item) => item.status !== 2)}
              setProcessor={setProcessor}
              disabled={disabled}
            />
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:completionDate")}
              </label>
              <DateField date={date} setDate={setDate} disabled={disabled} />
            </div>
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:passed")}
              </label>
              <ButtonYesOrNo
                passed={passed}
                setPassed={setPassed}
                disabled={disabled}
              />
            </div>
            <Cycle cycle={cycle} setCycle={setCycle} disabled={disabled} />
            <OrderNo
              selectedOrderNo={selectedOrderNo}
              setSelectedOrderNo={setSelectedOrderNo}
              disabled={disabled}
            />
          </div>
        );
      case t("qrScanner:finishing"):
        return (
          <div>
            <CaseButton
              initialSelectedCase={selectedCase}
              setSelectedCase={setSelectedCase}
              disabled={disabled}
            />
            <label className="text-sm text-primaryText font-semibold mt-2">
              {t("qrScanner:processor")}
            </label>
            <LocationDropdown
              options={finishing?.data.filter((item) => item.status !== 2)}
              setProcessor={setProcessor}
              disabled={disabled}
            />
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:completionDate")}
              </label>
              <DateField date={date} setDate={setDate} disabled={disabled} />
            </div>
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:passed")}
              </label>
              <ButtonYesOrNo
                passed={passed}
                setPassed={setPassed}
                disabled={disabled}
              />
            </div>
            <Cycle cycle={cycle} setCycle={setCycle} disabled={disabled} />
            <OrderNo
              selectedOrderNo={selectedOrderNo}
              setSelectedOrderNo={setSelectedOrderNo}
              disabled={disabled}
            />
          </div>
        );
      case t("qrScanner:grooving"):
        return (
          <div>
            <CaseButton
              initialSelectedCase={selectedCase}
              setSelectedCase={setSelectedCase}
              disabled={disabled}
            />
            <label className="text-sm text-primaryText font-semibold mt-2">
              {t("qrScanner:processor")}
            </label>
            <LocationDropdown
              options={grooving?.data.filter((item) => item.status !== 2)}
              setProcessor={setProcessor}
              disabled={disabled}
            />
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:completionDate")}
              </label>
              <DateField date={date} setDate={setDate} disabled={disabled} />
            </div>
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:passed")}
              </label>
              <ButtonYesOrNo
                passed={passed}
                setPassed={setPassed}
                disabled={disabled}
              />
            </div>
            <Cycle cycle={cycle} setCycle={setCycle} disabled={disabled} />
            <OrderNo
              selectedOrderNo={selectedOrderNo}
              setSelectedOrderNo={setSelectedOrderNo}
              disabled={disabled}
            />
          </div>
        );
      case t("qrScanner:lmd"):
        return (
          <div>
            <CaseButton
              initialSelectedCase={selectedCase}
              setSelectedCase={setSelectedCase}
              disabled={disabled}
            />
            <label className="text-sm text-primaryText font-semibold mt-2">
              {t("qrScanner:processor")}
            </label>
            <LocationDropdown
              options={lmd?.data.filter((item) => item.status !== 2)}
              setProcessor={setProcessor}
              disabled={disabled}
            />
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:completionDate")}
              </label>
              <DateField date={date} setDate={setDate} disabled={disabled} />
            </div>
            <div>
              <label className="text-sm text-primaryText font-semibold">
                {t("qrScanner:passed")}
              </label>
              <ButtonYesOrNo
                passed={passed}
                setPassed={setPassed}
                disabled={disabled}
              />
            </div>
            <Cycle cycle={cycle} setCycle={setCycle} disabled={disabled} />
            <OrderNo
              selectedOrderNo={selectedOrderNo}
              setSelectedOrderNo={setSelectedOrderNo}
              disabled={disabled}
            />
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
