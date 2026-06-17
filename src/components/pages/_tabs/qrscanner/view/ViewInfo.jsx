import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthentication } from "../../../../../hooks/auth";
import { useCylinderUpdate } from "../../../../../hooks/cylinderUpdates";
import { IoArrowBack } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { getStatusColors } from "../../../../utils/statusColors";
import {
  getDisposalHistoryDetails,
  getDisplayUpdatedAt,
  getDisplayStatus,
  getHistoryEventDate,
  getLatestHistoryRecord,
  getLatestStatusHistoryRecord,
  isDisposed,
} from "../../../../utils/cylinderStatus";
import { buildDisplayDetails } from "../../../../utils/displayValueUtils";

export const ProcessStatus = ({ status, size = "md" }) => {
  const { textColor, bgColor } = getStatusColors(status);
  const { t } = useTranslation("qrScanner");

  const lowerStatus = `${status ?? ""}`.toLowerCase();
  const translatedStatus = t(`${lowerStatus}`) || lowerStatus;

  const sizeClasses =
    size === "lg"
      ? "px-3 py-1.5 text-sm font-semibold"
      : "px-2.5 py-1 text-xs font-medium";

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full ${sizeClasses} ${textColor} ${bgColor}`}
    >
      {translatedStatus || "--"}
    </span>
  );
};

const BADGE_TONE_CLASSES = {
  pass: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  fail: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  ongoing:
    "bg-sky-100 text-sky-700 dark:border dark:border-sky-500 dark:bg-sky-900/40 dark:text-sky-300",
};

const InfoCard = ({ title, children, className = "" }) => (
  <section
    className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 sm:p-5 ${className}`}
  >
    {title ? (
      <h2 className="ecc-section-title mb-4 text-gray-800 dark:text-gray-100">
        {title}
      </h2>
    ) : null}
    {children}
  </section>
);

const DetailField = ({ label, value, type, badgeTone }) => (
  <div className="min-w-0">
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {label}
    </p>
    <div className="mt-1">
      {type === "process" ? (
        <ProcessStatus status={value} size="lg" />
      ) : badgeTone ? (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${BADGE_TONE_CLASSES[badgeTone] ?? ""}`}
        >
          {value}
        </span>
      ) : (
        <p className="break-words text-base font-medium leading-snug text-gray-900 dark:text-gray-50">
          {value}
        </p>
      )}
    </div>
  </div>
);

const DetailFieldGrid = ({ rows }) => {
  if (!rows?.length) return null;

  return (
    <div className="flex flex-col gap-5">
      {rows.map((row) => (
        <DetailField key={row.key} {...row} />
      ))}
    </div>
  );
};

const AdditionalDetailCard = ({ label, value, badgeTone }) => (
  <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800/60">
    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
      {label}
    </p>
    <div className="mt-1.5">
      {badgeTone ? (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${BADGE_TONE_CLASSES[badgeTone] ?? ""}`}
        >
          {value}
        </span>
      ) : (
        <p className="break-words text-base font-medium leading-snug text-gray-900 dark:text-gray-50">
          {value}
        </p>
      )}
    </div>
  </div>
);

const ViewInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthentication();
  const cylinderUpdates = useCylinderUpdate().records ?? [];
  const [modifiedBy, setModifiedBy] = useState(null);
  const data = location.state?.data;
  const totalOperationHours = location.state?.totalOperationHours;
  const updates = data?.updates;
  const { t } = useTranslation("common");

  const disposed = data ? isDisposed(data) : false;
  const disposalHistory = data ? getDisposalHistoryDetails(data) : null;
  const latestUpdateRecord = data
    ? getLatestHistoryRecord(data.serialNumber, cylinderUpdates, user?.id)
    : null;
  const rawDisplayUpdatedAt = data
    ? getDisplayUpdatedAt(data, latestUpdateRecord)
    : null;

  const processHistoryRecord =
    data && !disposed
      ? getLatestStatusHistoryRecord(
          data.serialNumber,
          cylinderUpdates,
          user?.id,
        ) ??
        (updates &&
        !["disposal", "disposed"].includes(
          `${updates.process ?? ""}`.trim().toLowerCase(),
        )
          ? updates
          : null)
      : null;

  useEffect(() => {
    if (!data || disposed || !processHistoryRecord) {
      if (disposed && disposalHistory?.disposedBy) {
        setModifiedBy(disposalHistory.disposedBy);
      } else {
        setModifiedBy(t("unknownUser"));
      }
      return;
    }

    if (processHistoryRecord.userId === data?.user?.id) {
      setModifiedBy(
        `${data?.user.firstName} ${data?.user.lastName}` || t("unknownUser"),
      );
    } else {
      setModifiedBy(t("unknownUser"));
    }
  }, [data, disposed, disposalHistory, processHistoryRecord, t]);

  const displayStatus = data ? getDisplayStatus(data) : null;
  const completionDate =
    data && processHistoryRecord
      ? getHistoryEventDate({
          eventType: "process",
          cylinder: data,
          historyRecord: processHistoryRecord,
        })
      : null;

  const displayDetails = useMemo(() => {
    if (!data) return null;

    return buildDisplayDetails(data, {
      t,
      historyRecord: processHistoryRecord,
      modifiedBy,
      displayUpdatedAt: rawDisplayUpdatedAt,
      displayStatus,
      completionDate,
      totalOperationHours,
      disposed,
      disposalHistory,
    });
  }, [
    data,
    t,
    processHistoryRecord,
    modifiedBy,
    rawDisplayUpdatedAt,
    displayStatus,
    completionDate,
    totalOperationHours,
    disposed,
    disposalHistory,
  ]);

  const summaryRows = useMemo(
    () =>
      displayDetails?.commonRows?.filter((row) => row.key !== "process") ?? [],
    [displayDetails],
  );

  const hasSummaryContent =
    summaryRows.length > 0 ||
    (disposed && (displayDetails?.disposalHistoryRows?.length ?? 0) > 0);

  if (!data) {
    return (
      <div className="rounded-md bg-red-100 p-4">
        <p className="text-lg text-red-600">{t("noUpdatesAvailable")}</p>
      </div>
    );
  }

  if (!disposed && !processHistoryRecord) {
    return (
      <div className="rounded-md bg-red-100 p-4">
        <p className="text-lg text-red-600">{t("noUpdatesAvailable")}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-24 dark:bg-gray-800 md:pb-6">
      <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-600 dark:bg-gray-700">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="ecc-touch-btn flex items-center gap-1 rounded-lg px-2 text-cyan-500 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <IoArrowBack size={20} />
          <span className="text-sm font-medium">{t("viewInfo.back")}</span>
        </button>
        <p className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-primaryText dark:text-gray-200">
          {t("viewInfo.details")}
        </p>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4 sm:gap-5 sm:p-5">
        {disposed && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700 dark:border-red-400/40 dark:bg-red-900/30 dark:text-red-100">
            <p className="font-semibold">{t("viewInfo.readOnlyDisposed")}</p>
          </div>
        )}

        <InfoCard>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {t("viewInfo.serialNo")}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="ecc-serial break-all text-2xl text-gray-900 dark:text-gray-50 sm:text-xl">
              {displayDetails?.serialNumber}
            </p>
            {displayStatus ? (
              <ProcessStatus status={displayStatus} size="lg" />
            ) : null}
          </div>
        </InfoCard>

        {hasSummaryContent && (
          <InfoCard title={t("viewInfo.summary")}>
            {summaryRows.length > 0 && <DetailFieldGrid rows={summaryRows} />}

            {disposed && displayDetails?.disposalHistoryRows?.length > 0 && (
              <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-600">
                <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {t("viewInfo.disposalHistory.title")}
                </h3>
                <DetailFieldGrid rows={displayDetails.disposalHistoryRows} />
              </div>
            )}
          </InfoCard>
        )}

        <InfoCard title={t("viewInfo.additionalDetails")}>
          {!displayDetails?.additionalRows?.length ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("viewInfo.noAdditionalInfoAvailable")}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {displayDetails.additionalRows.map((row) => (
                <AdditionalDetailCard key={row.key} {...row} />
              ))}
            </div>
          )}
        </InfoCard>
      </main>
    </div>
  );
};

export default ViewInfo;
