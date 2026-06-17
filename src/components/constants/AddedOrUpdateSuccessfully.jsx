import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IoCheckmarkDone,
  IoReturnUpBackOutline,
  IoHome,
} from "react-icons/io5";
import { getStatusColors } from "../utils/statusColors";
import { useHistory } from "../utils/HistoryContext";
import { useTranslation } from "react-i18next";
import ResponsiveSheet from "./ResponsiveSheet";

const AddedOrUpdateSuccessfully = ({
  data,
  selectedStatus,
  action = "update",
}) => {
  const navigate = useNavigate();
  const { updateHistory } = useHistory();
  const { t } = useTranslation();
  const isDelete = action === "delete";

  const formatDetailValue = (key, value) => {
    if (key === "case") {
      const caseMap = {
        0: t("qrScanner:case0"),
        1: t("qrScanner:case1"),
        2: t("qrScanner:case2"),
      };

      return caseMap[Number(value)] || String(value);
    }

    if (key === "isPassed") {
      const statusMap = {
        0: t("qrScanner:label.ongoing"),
        1: t("qrScanner:label.passed"),
        2: t("qrScanner:label.failed"),
      };

      if (value === undefined || value === null || value === "") {
        return statusMap[0];
      }

      return statusMap[Number(value)] || String(value);
    }

    if (key === "dateDone" && typeof value === "string") {
      return value.replace("T", ", ");
    }

    return String(value ?? "--");
  };

  const handleBackToQR = () => {
    navigate("/qrscanner");
  };

  const handleGoToHome = () => {
    if (!isDelete) {
      updateHistory(data);
    }
    navigate("/");
  };

  const { bgColor, textColor } = getStatusColors(selectedStatus);

  const getFirstValue = (...values) =>
    values.find(
      (value) =>
        value !== undefined && value !== null && `${value}`.trim() !== "",
    );

  const formatCompletionDate = (value) => {
    if (!value) return null;
    if (typeof value === "string") {
      const [date, time] = value.split("T");
      if (date && time) return `${date}, ${time.slice(0, 5)}`;
      return value;
    }
    return String(value);
  };

  const formatDateOnly = (value) => {
    if (!value) return null;
    return String(value).split("T")[0];
  };

  const buildDisplayRows = (source = {}) => {
    const rows = [
      {
        key: "serialNumber",
        label: t("qrScanner:label.serialNo"),
        value: getFirstValue(source.serialNumber, source.serial_number),
      },
      {
        key: "location",
        label: t("qrScanner:label.location"),
        value: source.location,
      },
      {
        key: "status",
        label: t("qrScanner:label.status"),
        value: source.status,
      },
      {
        key: "process",
        label: t("qrScanner:process"),
        value: source.process,
      },
      {
        key: "completionDate",
        label: t("qrScanner:label.completionDate"),
        value: formatCompletionDate(
          getFirstValue(source.dateDone, source.completionDate, source.created_at),
        ),
      },
      {
        key: "disposalDate",
        label: t("qrScanner:disposalDate"),
        value: formatDateOnly(
          getFirstValue(source.disposalDate, source.disposal_date),
        ),
      },
      {
        key: "cycle",
        label: t("qrScanner:label.cycle"),
        value: source.cycle,
      },
    ];

    return rows.filter(
      ({ value }) =>
        value !== undefined && value !== null && `${value}`.trim() !== "",
    );
  };

  const renderDeleteData = () => (
    <div className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
      <div className="flex justify-between gap-4">
        <span className="font-medium">{t("qrScanner:label.serialNo")}:</span>
        <span>{data?.serialNumber ?? "--"}</span>
      </div>
      <p className="text-center text-sm">
        {t("qrScanner:label.deletedWithRelatedUpdates")}
      </p>
    </div>
  );

  const displayRows = buildDisplayRows(data);

  return (
    <ResponsiveSheet
      isOpen
      onClose={handleGoToHome}
      title={
        isDelete
          ? t("qrScanner:label.deletedSuccessfully")
          : t("qrScanner:label.updatedSuccessfully")
      }
      size="sm"
      zIndex={50}
      closeLabel={t("common:close")}
      bodyClassName="p-4 sm:p-6"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="animate-bounce">
          <IoCheckmarkDone size={32} color="#41c88b" />
        </div>

        {selectedStatus && !isDelete ? (
          <div
            className={`mt-2 rounded-full p-2 text-sm font-medium ${textColor} ${bgColor}`}
          >
            {selectedStatus}
          </div>
        ) : null}

        <div className="mt-4 w-full rounded bg-gray-100 p-2 dark:bg-gray-500">
          <p className="flex items-center justify-center text-sm font-semibold">
            {t("qrScanner:label.details")}
          </p>
          {isDelete ? (
            renderDeleteData()
          ) : data ? (
            <ul className="text-sm text-gray-700 dark:text-gray-200">
              {displayRows.map(({ key, label, value }) => (
                <li key={key} className="flex justify-between gap-4">
                  <span className="font-medium">{label}:</span>
                  <span className="text-right">
                    {formatDetailValue(key, value)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              {t("qrScanner:label.noDataAvailable")}
            </p>
          )}
        </div>

        <div className="flex w-full flex-row items-center justify-between gap-2 pt-8 text-sm">
          <button
            type="button"
            onClick={handleBackToQR}
            className="flex min-h-[44px] w-full items-center rounded-lg bg-gray-100 p-4 transition-all duration-200 active:scale-95 dark:bg-gray-500"
          >
            <IoReturnUpBackOutline className="size-4" />
            <p className="px-2">{t("qrScanner:label.backToQR")}</p>
          </button>
          <button
            type="button"
            onClick={handleGoToHome}
            className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-primary p-4 text-white transition-all duration-200 active:scale-95"
          >
            <IoHome className="size-4" />
            <p className="px-1">{t("qrScanner:label.goToHome")}</p>
          </button>
        </div>
      </div>
    </ResponsiveSheet>
  );
};

export default AddedOrUpdateSuccessfully;
