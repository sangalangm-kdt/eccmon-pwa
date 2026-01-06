import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthentication } from "../../../../../hooks/auth";
import { IoArrowBack } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { getStatusColors } from "../../../../utils/statusColors";

export const ProcessStatus = ({ status }) => {
  const { textColor, bgColor } = getStatusColors(status);
  const { t } = useTranslation("qrScanner");

  const lowerStatus = status.toLowerCase();
  const translatedStatus = t(`${lowerStatus}`) || lowerStatus;

  return (
    <p className={`rounded-full p-2 text-tiny ${textColor} ${bgColor}`}>
      {translatedStatus || "--"}
    </p>
  );
};

const ViewInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthentication();
  const [modifiedBy, setModifiedBy] = useState(null);
  const data = location.state?.data;
  const totalOperationHours = location.state?.totalOperationHours;
  const updates = data?.updates;
  const { t } = useTranslation("common");

  const labels = {
    serialNumber: t("viewInfo.serialNo"),
    location: t("location"),
    dateDone: t("viewInfo.dateDone"),
    cycle: t("viewInfo.cycle"),
    case: t("viewInfo.addDetails.case"),
    isPassed: t("viewInfo.addDetails.isPassed"),
    orderNumber: t("viewInfo.addDetails.orderNo"),
    otherDetails: t("viewInfo.additionalDetails"),
    engineNumber: t("viewInfo.addDetails.engineNo"),
    operationHours: t("viewInfo.addDetails.operatingHours"),
    totalHours: t("viewInfo.addDetails.totalHours"),
    mountingPosition: t("viewInfo.addDetails.mountingPosition"),
    userId: t("viewInfo.addDetails.userId"),
    process: t("viewInfo.addDetails.process"),
  };

  useEffect(() => {
    if (updates?.userId === data?.user.id) {
      setModifiedBy(
        `${data?.user.firstName} ${data?.user.lastName}` || t("unknownUser"),
      );
    } else {
      setModifiedBy(t("unknownUser"));
    }
  }, [data?.user, updates, t]);

  if (!data || !updates) {
    return (
      <div className="rounded-md bg-red-100 p-4">
        <p className="text-lg text-red-600">{t("noUpdatesAvailable")}</p>
      </div>
    );
  }

  const renderUpdateDetails = (update) => {
    return (
      <div className="space-y-4">
        {Object.entries(update).map(([key, value]) => {
          if (
            [
              "id",
              "serialNumber",
              "process",
              "location",
              "dateDone",
              "createdAt",
              "userId",
              "cycle",
            ].includes(key)
          )
            return null;

          const label = labels[key] || key;

          if (
            key === "otherDetails" &&
            value &&
            typeof value === "object" &&
            Object.keys(value).length
          ) {
            const shouldShowTotalHours =
              data?.status?.toLowerCase() === "mounted" ||
              data?.status?.toLowerCase() === "dismounted";

            const details = Object.entries(value);

            return (
              <div key={key} className="space-y-2">
                <label className="flex text-center text-md font-semibold text-gray-700 dark:text-gray-100">
                  {labels[key]}
                </label>
                <ul className="text-c space-y-1 text-sm">
                  {details.map(([detailKey, detailValue], index) => {
                    if (
                      [
                        "id",
                        "serialNumber",
                        "process",
                        "location",
                        "dateDone",
                        "createdAt",
                        "userId",
                        "cycle",
                      ].includes(detailKey)
                    )
                      return null;

                    // ✅ Translate `case` values
                    if (detailKey === "case") {
                      const caseMap = {
                        0: t("viewInfo.addDetails.caseValues.newBuild"),
                        1: t("viewInfo.addDetails.caseValues.regeneration"),
                        2: t("viewInfo.addDetails.caseValues.maintenance"),
                      };

                      return (
                        <li
                          key={detailKey}
                          className={`flex justify-between px-2 py-2 ${
                            index !== details.length - 1
                              ? "border-b-0.5 border-gray-300"
                              : ""
                          }`}
                        >
                          <label className="text-md font-medium text-gray-700 dark:text-gray-100">
                            {labels[detailKey] || detailKey}
                          </label>
                          <p className="text-sm text-gray-600 dark:text-gray-200">
                            {caseMap[parseInt(detailValue)] || "--"}
                          </p>
                        </li>
                      );
                    }

                    if (detailKey === "isPassed") {
                      const statusMap = ["Ongoing", "Passed", "Failed"];
                      detailValue =
                        statusMap[parseInt(detailValue, 10)] || "--";

                      let colorClasses = "";
                      if (detailValue === "Passed") {
                        colorClasses =
                          "bg-green-100 text-green-500 font-medium";
                      } else if (detailValue === "Ongoing") {
                        colorClasses =
                          "bg-sky-100 text-sky-500 font-medium dark:border dark:border-sky-500 dark:bg-sky-300";
                      } else if (detailValue === "Failed") {
                        colorClasses = "bg-red-100 text-red-500 font-medium";
                      }

                      return (
                        <li
                          key={detailKey}
                          className={`flex justify-between px-2 py-2 text-tiny ${
                            index !== details.length - 1
                              ? "border-b-0.5 border-gray-300"
                              : ""
                          }`}
                        >
                          <label className="text-md font-medium text-gray-700 dark:text-gray-100">
                            {labels[detailKey] || detailKey}
                          </label>
                          <p
                            className={`rounded-full p-2 text-xs ${colorClasses}`}
                          >
                            {String(detailValue || "--")}
                          </p>
                        </li>
                      );
                    }

                    return (
                      <React.Fragment key={detailKey}>
                        <li
                          className={`flex justify-between px-2 py-2 ${
                            index !== details.length - 1
                              ? "border-b-0.5 border-gray-300"
                              : ""
                          }`}
                        >
                          <label className="text-md font-medium text-gray-700 dark:text-gray-100">
                            {labels[detailKey] || detailKey}
                          </label>
                          <p className="border-gray-300 text-sm text-gray-600 dark:text-gray-200">
                            {String(detailValue || "--")}
                          </p>
                        </li>

                        {detailKey === "operationHours" &&
                          shouldShowTotalHours && (
                            <li className="flex justify-between border-b-0.5 border-gray-300 px-2 py-2">
                              <label className="text-md font-medium text-gray-700 dark:text-gray-100">
                                {labels.totalHours}
                              </label>
                              <p className="text-sm text-gray-600 dark:text-gray-200">
                                {totalOperationHours || 0}
                              </p>
                            </li>
                          )}
                      </React.Fragment>
                    );
                  })}
                </ul>
              </div>
            );
          }

          return (
            <div key={key}>
              <label className="text-md font-medium">{label}</label>
              <p className="text-center text-gray-500">
                {String(value || t("viewInfo.noDataToDisplay"))}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="dark:bg- flex min-h-screen flex-col bg-gray-100 dark:bg-gray-800">
      <div className="flex h-20 w-full items-center justify-between rounded-b-lg bg-white p-4 shadow-sm dark:bg-gray-700">
        <button
          onClick={() => navigate("/")}
          className="flex flex-row items-center gap-0.5 text-cyan-400 hover:bg-gray-50"
        >
          <IoArrowBack size={20} /> <p>{t("viewInfo.back")}</p>
        </button>
        <div className="flex-1 text-center">
          <p className="mr-14 text-lg font-medium text-primaryText dark:text-gray-200">
            {t("viewInfo.details")}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col p-6">
        <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-4 dark:bg-gray-600">
          <p className="text-2xl font-medium text-gray-700 dark:text-gray-100">
            {updates.serialNumber}
          </p>
          <label className="pt-2 text-xs text-gray-500 dark:text-gray-200">
            {t("viewInfo.serialNo")}
          </label>
        </div>

        <div className="mt-2 flex w-full flex-col rounded-lg bg-white p-4 dark:bg-gray-600">
          {[
            { label: t("viewInfo.lastModifiedBy"), value: modifiedBy },
            {
              label: t("viewInfo.process"),
              value: updates.process,
              isProcess: true,
            },
            { label: t("viewInfo.completionDate"), value: updates.dateDone },
            { label: t("viewInfo.location"), value: updates.location },
            { label: t("viewInfo.cycle"), value: updates.cycle },
            { label: t("viewInfo.disposal"), value: data.disposal },
            { label: t("viewInfo.disposalDate"), value: data.disposalDate },
          ].map(({ label, value, isProcess }) => (
            <div
              key={label}
              className="flex items-center justify-between border-b-0.5 border-gray-300 px-2 py-2"
            >
              <label className="text-md font-medium text-primaryText dark:text-gray-50">
                {label}
              </label>
              {isProcess ? (
                <ProcessStatus status={value || updates.process} />
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-100">
                  {value || "--"}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-2 flex w-full flex-col rounded-lg bg-white p-4 dark:bg-gray-600">
          {renderUpdateDetails(updates)}
        </div>
      </div>
    </div>
  );
};

export default ViewInfo;
