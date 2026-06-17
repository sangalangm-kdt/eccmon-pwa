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
import {
  getContinueDisabledMessage,
  getMissingRequiredFieldKeys,
  isCaseSelected,
  hasAvailableOptions,
  validateSelectionField,
} from "../../../../utils/formFieldValidation";
import {
  setFormDataIfChanged,
  setStateIfChanged,
} from "../../../../utils/syncFormState";

const PROCESS_DATA_KEYS = [
  "serialNumber",
  "location",
  "dateDone",
  "cycle",
  "otherDetails",
];

const Process = ({
  selectedProcessorStatus,
  setData,
  disabled,
  showAlert,
  setShowAlert,
  setIsComplete,
  setContinueDisabledReason,
}) => {
  const location = useLocation();
  const cylinderData = location.state?.data;
  const serialNumber = cylinderData?.serialNumber ?? "";
  const { user } = useAuthentication();

  const { t } = useTranslation("qrScanner");
  const normalizedProcessorStatus =
    selectedProcessorStatus?.toLowerCase?.().trim?.() ?? "";
  const processLookupKey =
    normalizedProcessorStatus === "process" ? null : normalizedProcessorStatus;
  const { data: selectedProcessor, isLoading } =
    useLocationProcess(processLookupKey);

  const [initialData] = useState(cylinderData);

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
  const [selectedOrderNo, setSelectedOrderNo] = useState(() => {
    const saved = initialData?.updates?.otherDetails?.orderNumber;
    return saved === null || saved === undefined ? "" : `${saved}`;
  });

  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [infoDialogContent, setInfoDialogContent] = useState("");

  const [disabledProcessors, setDisabledProcessors] = useState([]);
  const [orderOptionsAvailable, setOrderOptionsAvailable] = useState(true);

  useEffect(() => {
    // Only update if selectedProcessorStatus changes and it's a new operation
    if (selectedProcessorStatus === cylinderData.status) {
      setSelectedCase(initialData?.case);
      setProcessor(initialData?.location);

      // Use formatDate for the new date
      const today = new Date();
      setDate(formatDate(today));

      setPassed(initialData?.updates?.otherDetails?.isPassed ?? "0");
      const savedOrder = initialData?.updates?.otherDetails?.orderNumber;
      setSelectedOrderNo(
        savedOrder === null || savedOrder === undefined ? "" : `${savedOrder}`,
      );
    } else {
      const today = new Date();
      setDate(formatDate(today));

      setPassed("0");
      setProcessor(null);
      setSelectedCase(null);
      setSelectedOrderNo("");
    }
  }, [selectedProcessorStatus]);

  useEffect(() => {
    const today = new Date();
    setDate(formatDate(today));
  }, [passed]);

  const locationOptions = {
    disassembly: selectedProcessor?.data,
    assembly: selectedProcessor?.data,
    finishing: selectedProcessor?.data,
    grooving: selectedProcessor?.data,
    lmd: selectedProcessor?.data,
  };

  const currentOptions = (
    locationOptions[normalizedProcessorStatus] ??
    selectedProcessor?.data ??
    []
  ).filter((item) => item.status !== 2);

  const hasProcessorOptions = hasAvailableOptions(currentOptions);
  const processorRequired = user.is_admin === 1;
  const resolvedLocation =
    user.is_admin === 1
      ? processor || user.affiliation || "None"
      : user.affiliation;

  useEffect(() => {
    const processorCheck = validateSelectionField({
      required: processorRequired,
      hasOptions: hasProcessorOptions,
      value: processor,
      missingSelectionMessageKey: "validation.processorRequired",
    });

    const orderRequired = true;
    const orderCheck = validateSelectionField({
      required: orderRequired,
      hasOptions: orderOptionsAvailable,
      value: selectedOrderNo,
      missingSelectionMessageKey: "orderNoRequired",
    });

    const caseValid = isCaseSelected(selectedCase);
    const dateValid = Boolean(date);
    const passedValid =
      passed !== null && passed !== undefined && `${passed}`.trim() !== "";

    const fieldEntries = [
      ["validation.caseRequired", caseValid],
      ["validation.dateRequired", dateValid],
      ["validation.processorRequired", processorCheck.valid],
      ["orderNoRequired", orderCheck.valid],
    ];

    const missingKeys = getMissingRequiredFieldKeys(fieldEntries);
    const isFormComplete = missingKeys.length === 0;

    const otherDetails = JSON.stringify({
      case: selectedCase,
      isPassed: passed ?? "",
      orderNumber: selectedOrderNo ?? "",
    });

    setFormDataIfChanged(
      setData,
      {
        serialNumber,
        location: resolvedLocation,
        dateDone: date,
        cycle,
        otherDetails,
      },
      PROCESS_DATA_KEYS,
    );

    if (isFormComplete) {
      setShowAlert(false);
    }

    setStateIfChanged(setIsComplete, isFormComplete);
    setContinueDisabledReason?.((prev) => {
      const next = getContinueDisabledMessage(missingKeys, t);
      return prev === next ? prev : next;
    });
  }, [
    processor,
    date,
    passed,
    cycle,
    selectedOrderNo,
    selectedCase,
    serialNumber,
    resolvedLocation,
    hasProcessorOptions,
    processorRequired,
    orderOptionsAvailable,
    setData,
    setIsComplete,
    setContinueDisabledReason,
    setShowAlert,
    t,
  ]);

  const renderLocations = () => {
    if (isLoading) {
      return <ProcessSkeleton />;
    }

    return (
      <div>
        <CaseButton
          handleInfoIconClick={handleInfoIconClick}
          selectedCase={selectedCase}
          setSelectedCase={setSelectedCase}
          disabled={disabled}
          setDisabledProcessors={setDisabledProcessors}
        />
        {showAlert && !isCaseSelected(selectedCase) && (
          <div className="p-1 text-red-600">
            <p className="text-xs">{t("validation.caseRequired")}</p>
          </div>
        )}
        <label className="mt-2 text-sm font-semibold text-primaryText dark:text-gray-100">
          {t("processor")}
          {processorRequired && hasProcessorOptions && (
            <strong className="text-red-500"> *</strong>
          )}
        </label>
        {user.is_admin === 1 ? (
          <LocationDropdown
            options={currentOptions ?? []}
            processor={processor}
            setProcessor={setProcessor}
            disabled={disabled || !(currentOptions ?? []).length}
            emptyHelperKey="noOptionsForProcess"
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
        {showAlert && processorRequired && hasProcessorOptions && !processor && (
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
            required
            onOptionsAvailabilityChange={setOrderOptionsAvailable}
          />
          {showAlert && orderOptionsAvailable && !selectedOrderNo && (
            <div className="p-1 text-red-600">
              <p className="text-xs">{t("orderNoRequired")}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleInfoIconClick = () => {
    const caseDescriptions = {
      0: t("qrScanner:dialog.case0Description", {
        process: "LMD ΓåÆ Finishing ΓåÆ Assembly",
      }),
      1: t("qrScanner:dialog.case1Description", {
        process: "Disassembly ΓåÆ Grooving ΓåÆ LMD ΓåÆ Assembly",
      }),
      2: t("qrScanner:dialog.case2Description", {
        process: "Disassembly ΓåÆ Assembly",
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
