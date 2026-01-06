/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import DateField from "../../../../constants/DateField";
import ButtonYesOrNo from "../../../../constants/ButtonYesOrNo";
import Cycle from "../../../../constants/Cycle";
import OrderNo from "../../../../constants/OrderNo";
import CaseButton from "../../../../constants/CaseButton";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProcessSkeleton from "../../../../constants/skeleton/Process";
import { IoInformationCircleOutline } from "react-icons/io5";
import { formatDate } from "../../../../utils/formatdate";
import { useAuthentication } from "../../../../../hooks/auth";
import LocationDropdown from "../../../../constants/LocationDropdown";
import { useLocationProcess } from "../../../../../hooks/locationProcess";

const Process = ({
  selectedProcessorStatus,
  setData,
  disabled,
  showAlert,
  setShowAlert,
}) => {
  const location = useLocation();
  const cylinderData = location.state?.data;
  const { user } = useAuthentication();

  const { t } = useTranslation("qrScanner");
  const selectedProcessor = useLocationProcess(
    selectedProcessorStatus.toLowerCase(),
  ).data;

  console.log(selectedProcessor);
  // Store the initial data and prevent changes unless the user modifies it
  const [initialData, setInitialData] = useState(cylinderData);

  const [selectedCase, setSelectedCase] = useState(initialData?.case);
  const [processor, setProcessor] = useState(initialData?.location);
  const [date, setDate] = useState(() => {
    const today = initialData?.updates?.dateDone
      ? new Date(initialData?.updates?.dateDone)
      : new Date();
    return formatDate(today);
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

  const [disabledProcessors, setDisabledProcessors] = useState([]);

  useEffect(() => {
    // Only update if selectedProcessorStatus changes and it's a new operation
    if (selectedProcessorStatus === cylinderData.status) {
      setSelectedCase(initialData?.case);
      setProcessor(initialData?.location);

      // Use formatDate for the new date
      const today = new Date();
      setDate(formatDate(today));

      setPassed(initialData?.updates?.otherDetails?.isPassed);
      setSelectedOrderNo(initialData?.updates?.otherDetails?.orderNumber);
    } else {
      // Reset states if selectedProcessorStatus changes to a different operation
      const today = new Date();
      setDate(formatDate(today));

      setPassed("0"); // Reset passed
      setProcessor(null); // Reset location
    }
  }, [selectedProcessorStatus]);

  useEffect(() => {
    // Whenever 'passed' changes, update the date to the current time
    const today = new Date();
    setDate(formatDate(today)); // Use formatDate function to set the new date
  }, [passed]); // This will run when 'passed' changes

  useEffect(() => {
    setData({
      serialNumber: initialData?.serialNumber,
      location: user.is_admin === 1 ? processor : user.affiliation,
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
      disassembly: selectedProcessor?.data,
      assembly: selectedProcessor?.data,
      finishing: selectedProcessor?.data,
      grooving: selectedProcessor?.data,
      lmd: selectedProcessor?.data,
    };

    const currentOptions = locationOptions[
      selectedProcessorStatus?.toLowerCase()
    ]?.filter((item) => item.status !== 2);

    return currentOptions ? (
      <div>
        <CaseButton
          handleInfoIconClick={handleInfoIconClick}
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
        <label className="mt-2 text-sm font-semibold text-primaryText dark:text-gray-100">
          {t("qrScanner:processor")}
        </label>
        {user.is_admin === 1 ? (
          <LocationDropdown
            options={selectedProcessor.data}
            // loading={isLoading}
            processor={processor}
            setProcessor={setProcessor}
            disabled={disabled}
          />
        ) : (
          <input
            type="text"
            value={user.affiliation}
            readOnly
            className="w-full rounded border bg-gray-100 p-2 text-sm dark:bg-gray-600"
            disabled
          />
        )}
        {showAlert && !processor && (
          <div className="p-1 text-red-600">
            <p className="text-xs">{t("validation.processorRequired")}</p>
          </div>
        )}
        <div>
          <label className="text-sm font-semibold text-primaryText dark:text-gray-100">
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
          <label className="text-sm font-semibold text-primaryText dark:text-gray-100">
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
    const caseDescriptions = {
      0: t("qrScanner:dialog.case0Description", {
        process: "LMD → Finishing → Assembly",
      }),
      1: t("qrScanner:dialog.case1Description", {
        process: "Disassembly → Grooving → LMD → Assembly",
      }),
      2: t("qrScanner:dialog.case2Description", {
        process: "Disassembly → Assembly",
      }),
    };

    const description = `
    <strong>${t("qrScanner:dialog.caseDescriptions")}</strong>
    <ul classname="mb-2">
      <li>${t("qrScanner:dialog.case0")} -<em> ${caseDescriptions[0]}</em></li>
      <li>${t("qrScanner:dialog.case1")} -<em> ${caseDescriptions[1]}</em></li>
      <li>${t("qrScanner:dialog.case2")} -<em> ${caseDescriptions[2]}</em></li>
    </ul>
  `;

    setShowInfoDialog(true);
    setInfoDialogContent(description);
    setTimeout(() => {
      setShowInfoDialog(false);
    }, 5000);
  };

  return (
    <div className="flex w-full flex-col rounded-lg bg-white p-2 dark:bg-gray-500">
      <h2 className="mt-2 flex flex-row items-center gap-2 text-md font-semibold leading-loose text-primaryText dark:text-gray-100">
        {t("qrScanner:processStatus")}
        {/* <IoInformationCircleOutline
          size={20}
          className="cursor-pointer"
          onClick={handleInfoIconClick} // Show dialog box on click
        /> */}
      </h2>

      {showInfoDialog && (
        <div className="absolute left-64 top-96 z-10 -translate-x-1/4 transform rounded-md border bg-white p-4 shadow-md dark:bg-gray-800">
          <p
            className="pointer-events-none text-xs"
            dangerouslySetInnerHTML={{ __html: infoDialogContent }}
          ></p>
        </div>
      )}

      {renderLocations()}
    </div>
  );
};

export default Process;
