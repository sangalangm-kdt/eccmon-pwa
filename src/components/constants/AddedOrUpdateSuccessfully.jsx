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

  const renderData = (data) => {
    const seenKeys = new Set();
    const labels = {
      serialNumber: t("qrScanner:label.serialNo"),
      location: t("qrScanner:label.location"),
      dateDone: t("qrScanner:label.completionDate"),
      cycle: t("qrScanner:label.cycle"),
      case: t("qrScanner:label.case"),
      isPassed: t("qrScanner:label.status"),
      orderNumber: t("qrScanner:label.orderNo"),
      otherDetails: t("qrScanner:label.additionalInfo"),
      engineNumber: t("qrScanner:label.engineNo"),
      operationHours: t("qrScanner:label.operatingHours"),
      mountingPosition: t("qrScanner:label.mountingPosition"),
    };

    return Object.entries(data).map(([key, value]) => {
      if (seenKeys.has(key)) return null;
      seenKeys.add(key);

      const displayKey = labels[key] || key;

      if (key === "otherDetails") {
        try {
          const parsedDetails =
            typeof value === "string" ? JSON.parse(value) : value;

          if (
            !parsedDetails ||
            typeof parsedDetails !== "object" ||
            Array.isArray(parsedDetails)
          ) {
            return null;
          }

          return Object.entries(parsedDetails).map(([subKey, subValue]) => (
            <li key={subKey} className="flex justify-between">
              <span className="font-medium capitalize">
                {labels[subKey] || subKey}:
              </span>
              <span>{formatDetailValue(subKey, subValue)}</span>
            </li>
          ));
        } catch (error) {
          return (
            <p className="text-sm text-gray-500">
              {t("qrScanner:label.invalidDataFormat")}
            </p>
          );
        }
      }

      return (
        <li key={key} className="flex justify-between">
          <span className="font-medium capitalize">{displayKey}:</span>
          <span>{formatDetailValue(key, value)}</span>
        </li>
      );
    });
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-80 max-w-md transform rounded-lg bg-white p-4 shadow-lg transition-transform dark:bg-gray-600">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-bounce">
            <IoCheckmarkDone size={32} color="#41c88b" />
          </div>
          <p className="font-medium text-green-500">
            {isDelete
              ? t("qrScanner:label.deletedSuccessfully")
              : t("qrScanner:label.updatedSuccessfully")}
          </p>

          {selectedStatus && !isDelete && (
            <div
              className={`mt-2 rounded-full p-2 text-sm font-medium ${textColor} ${bgColor}`}
            >
              {selectedStatus}
            </div>
          )}

          <div className="mt-4 w-full rounded bg-gray-100 p-2 dark:bg-gray-500">
            <p className="flex items-center justify-center text-sm font-semibold">
              {t("qrScanner:label.details")}
            </p>
            {isDelete ? (
              renderDeleteData()
            ) : data ? (
              <ul className="text-sm text-gray-700 dark:text-gray-200">
                {renderData(data)}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                {t("qrScanner:label.noDataAvailable")}
              </p>
            )}
          </div>

          <div className="flex w-full flex-row items-center justify-between pt-8 text-sm">
            <button
              onClick={handleBackToQR}
              className="mr-3 flex w-full items-center rounded-lg bg-gray-100 p-4 transition hover:bg-gray-200 dark:bg-gray-500"
            >
              <IoReturnUpBackOutline className="size-4" />
              <p className="px-2">{t("qrScanner:label.backToQR")}</p>
            </button>
            <button
              onClick={handleGoToHome}
              className="flex w-full rounded-lg bg-primary p-4 text-white transition hover:bg-cyan-500"
            >
              <IoHome className="size-4" />
              <p className="px-1">{t("qrScanner:label.goToHome")}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddedOrUpdateSuccessfully;
