/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import LocationDropdown from "../../../../constants/LocationDropdown";
import DateField from "../../../../constants/DateField";
import ButtonYesOrNo from "../../../../constants/ButtonYesOrNo";
import Cycle from "../../../../constants/Cycle";
import OrderNo from "../../../../constants/OrderNo";
import { useLocationProcess } from "../../../../../hooks/locationProcess";
import CaseButton from "../../../../constants/CaseButton";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProcessSkeleton from "../../../../constants/skeleton/Process";
import { IoInformationCircleOutline } from "react-icons/io5";

const Process = ({
  selectedProcessorStatus,
  setData,
  disabled,
  showAlert,
  setShowAlert,
}) => {
  const location = useLocation();
  const cylinderData = location.state?.data;
  const { t } = useTranslation("qrScanner");

  // Store the initial data and prevent changes unless the user modifies it
  const [initialData, setInitialData] = useState(cylinderData);

  const [selectedCase, setSelectedCase] = useState(initialData?.case);
  const [processor, setProcessor] = useState(initialData?.location);
  const [date, setDate] = useState(() => {
    const today = initialData?.updates?.dateDone
      ? new Date(initialData?.updates?.dateDone)
      : new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  });
  const [passed, setPassed] = useState(
    initialData?.updates?.otherDetails?.isPassed,
  );
  const [cycle, setCycle] = useState(initialData?.cycle);
  const [selectedOrderNo, setSelectedOrderNo] = useState(
    initialData?.updates?.otherDetails?.orderNumber,
  );

  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [infoDialogContent, setInfoDialogContent] = useState("");

  const {
    disassembly,
    isDisassemblyLoading,
    disassemblyMutate,
    grooving,
    isGroovingLoading,
    groovingMutate,
    lmd,
    isLmdLoading,
    lmdMutate,
    finishing,
    isFinishingLoading,
    finishingMutate,
    assembly,
    isAssemblyLoading,
    assemblyMutate,
  } = useLocationProcess();

  const [disabledProcessors, setDisabledProcessors] = useState([]);

  useEffect(() => {
    // Only update if selectedProcessorStatus changes and it's a new operation
    if (selectedProcessorStatus === cylinderData.status) {
      setSelectedCase(initialData?.case);
      setProcessor(initialData?.location);

      // Update the date to the current time
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const hours = String(today.getHours()).padStart(2, "0");
      const minutes = String(today.getMinutes()).padStart(2, "0");
      setDate(`${year}-${month}-${day}T${hours}:${minutes}`);

      setPassed(initialData?.updates?.otherDetails?.isPassed);
      setSelectedOrderNo(initialData?.updates?.otherDetails?.orderNumber);
    } else {
      // Reset states if selectedProcessorStatus changes to a different operation
      setPassed(null); // Reset passed
      setDate(initialData?.updates?.dateDone); // Reset date
      setProcessor(null); // Reset location
    }
  }, [selectedProcessorStatus]);

  useEffect(() => {
    setData({
      serialNumber: initialData?.serialNumber,
      location: processor,
      dateDone: date,
      cycle: cycle,
      otherDetails: `{"case" : "${selectedCase}", "isPassed" : "${passed}", "orderNumber" : "${selectedOrderNo}"}`,
    });
    if (selectedCase && processor && date && selectedOrderNo) {
      setShowAlert(false);
    }
  }, [
    processor,
    date,
    passed,
    cycle,
    selectedOrderNo,
    selectedCase,
    initialData,
    setData,
  ]);

  const renderLocations = () => {
    const locationOptions = {
      disassembly: disassembly?.data,
      assembly: assembly?.data,
      finishing: finishing?.data,
      grooving: grooving?.data,
      lmd: lmd?.data,
    };

    const currentOptions = locationOptions[
      selectedProcessorStatus?.toLowerCase()
    ]?.filter((item) => item.status !== 2);

    return currentOptions ? (
      <div>
        <CaseButton
          selectedCase={selectedCase}
          setSelectedCase={setSelectedCase}
          disabled={disabled}
          setDisabledProcessors={setDisabledProcessors}
        />
        {showAlert && selectedCase === null && (
          <div className="p-1 text-red-600">
            <p className="text-xs">{t("validation.caseRequired")}</p>
          </div>
        )}
        <label className="mt-2 text-sm font-semibold text-primaryText">
          {t("qrScanner:processor")} <strong className="text-red-500">*</strong>
        </label>
        <LocationDropdown
          options={currentOptions}
          processor={processor}
          setProcessor={setProcessor}
          disabled={disabled || disabledProcessors.includes(processor)}
        />
        {showAlert && !processor && (
          <div className="p-1 text-red-600">
            <p className="text-xs">{t("validation.processorRequired")}</p>
          </div>
        )}
        <div>
          <label className="text-sm font-semibold text-primaryText">
            {t("qrScanner:completionDate")}{" "}
            <strong className="text-red-500">*</strong>
          </label>
          <DateField date={date} setDate={setDate} disabled={disabled} />
          {showAlert && !date && (
            <div className="p-1 text-red-600">
              <p className="text-xs">{t("validation.dateRequired")}</p>
            </div>
          )}
        </div>
        <div>
          <label className="text-sm font-semibold text-primaryText">
            {t("qrScanner:passed")}
          </label>
          <ButtonYesOrNo
            passed={passed}
            setPassed={setPassed}
            disabled={disabled}
          />
        </div>
        <Cycle cycle={cycle} setCycle={setCycle} disabled={true} />
        <div>
          <OrderNo
            selectedOrderNo={selectedOrderNo}
            setSelectedOrderNo={setSelectedOrderNo}
            disabled={disabled}
          />
          {showAlert && !selectedOrderNo && (
            <div className="p-1 text-red-600">
              <p className="text-xs">{t("validation.orderNumberRequired")}</p>
            </div>
          )}
        </div>
      </div>
    ) : (
      <ProcessSkeleton />
    );
  };

  const handleInfoIconClick = () => {
    setShowInfoDialog(true);
    setInfoDialogContent("This is sample dialog content.");
  };

  const handleInfoIconClose = () => {
    setShowInfoDialog(false);
  };

  return (
    <div className="flex w-full flex-col rounded-lg bg-white p-2 dark:bg-gray-500">
      <h2 className="mt-2 flex flex-row items-center gap-2 text-md font-semibold leading-loose text-primaryText dark:text-gray-100">
        {t("qrScanner:processStatus")}
        <IoInformationCircleOutline
          size={20}
          className="cursor-pointer"
          onClick={handleInfoIconClick} // Show dialog box on click
        />
      </h2>

      {showInfoDialog && (
        <div className="absolute left-64 top-96 z-10 -translate-x-1/2 transform rounded-md border bg-white p-4 shadow-md">
          <div className="absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
          <p className="pointer-events-none">{infoDialogContent}</p>
        </div>
      )}

      {renderLocations()}
    </div>
  );
};

export default Process;
