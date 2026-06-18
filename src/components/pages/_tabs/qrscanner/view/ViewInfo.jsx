import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthentication } from "../../../../../hooks/auth";
import {
  normalizeUpdateRecord,
  useCylinderUpdate,
} from "../../../../../hooks/cylinderUpdates";
import axiosLib from "../../../../../lib/axios";
import { IoArrowBack } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { getStatusColors } from "../../../../utils/statusColors";
import {
  getDisposalHistoryDetails,
  getDisplayUpdatedAt,
  getDisplayStatus,
  getCylinderSerialNumber,
  getHistoryEventDate,
  getLatestHistoryRecord,
  getLatestStatusHistoryRecord,
  isDisposed,
  normalizeApiCylinderResponse,
} from "../../../../utils/cylinderStatus";
import { buildDisplayDetails } from "../../../../utils/displayValueUtils";

const DISPOSED_STATUS_TOKENS = new Set(["disposal", "disposed"]);

const resolveSelectedData = (locationState) => {
  const raw = locationState?.data ?? locationState?.item ?? null;
  if (!raw || typeof raw !== "object") return null;

  const cylinder = raw.cylinder ?? raw;

  return {
    ...cylinder,
    serialNumber:
      cylinder.serialNumber ??
      cylinder.serial_number ??
      raw.serialNumber ??
      raw.serial_number ??
      "",
    status: cylinder.status ?? raw.status,
    process: cylinder.process ?? raw.process,
    location: cylinder.location ?? raw.location,
    cycle: cylinder.cycle ?? raw.cycle,
    user: cylinder.user ?? raw.user,
    updates:
      raw.updates ??
      raw.historyRecord ??
      cylinder.updates ??
      raw.latestUpdate ??
      cylinder.latestUpdate ??
      null,
  };
};

const resolveUpdatesList = (selectedData) => {
  if (!selectedData) return [];

  let list = [];

  if (Array.isArray(selectedData.updates)) {
    list = selectedData.updates;
  } else if (Array.isArray(selectedData.cylinderUpdates)) {
    list = selectedData.cylinderUpdates;
  } else if (Array.isArray(selectedData.cylinder_updates)) {
    list = selectedData.cylinder_updates;
  } else if (Array.isArray(selectedData.update)) {
    list = selectedData.update;
  } else if (selectedData.updates && typeof selectedData.updates === "object") {
    list = [selectedData.updates];
  } else if (selectedData.historyRecord) {
    list = [selectedData.historyRecord];
  } else if (selectedData.latestUpdate) {
    list = [selectedData.latestUpdate];
  }

  if (list.length > 0) {
    return list.map(normalizeUpdateRecord);
  }

  if (selectedData.process || selectedData.status) {
    return [normalizeUpdateRecord(selectedData)];
  }

  return [];
};

const getLatestLocalProcessRecord = (updates = []) => {
  const processUpdates = updates.filter((record) => {
    const token = `${record?.process ?? record?.status ?? ""}`
      .trim()
      .toLowerCase();
    return token && !DISPOSED_STATUS_TOKENS.has(token);
  });

  if (!processUpdates.length) return null;

  return [...processUpdates].sort((a, b) => {
    const dateA = new Date(
      a.dateDone ??
        a.date_done ??
        a.createdAt ??
        a.created_at ??
        a.updatedAt ??
        a.updated_at ??
        0,
    );
    const dateB = new Date(
      b.dateDone ??
        b.date_done ??
        b.createdAt ??
        b.created_at ??
        b.updatedAt ??
        b.updated_at ??
        0,
    );
    return dateB - dateA;
  })[0];
};

const attachPrimaryUpdate = (cylinder, updatesList) => {
  if (!cylinder) return null;
  if (!updatesList.length) return cylinder;

  return {
    ...cylinder,
    updates: updatesList.length === 1 ? updatesList[0] : updatesList,
  };
};

const buildUserDisplayName = (user) => {
  if (!user || typeof user !== "object") return "";

  const displayName = [
    user.firstName ?? user.first_name,
    user.lastName ?? user.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return displayName || user.name || user.fullName || "";
};

const resolveLastUpdateUser = (data, processHistoryRecord) => {
  const updates = data?.updates;
  const firstUpdateUser = Array.isArray(updates)
    ? updates[0]?.user
    : updates?.user;

  return (
    processHistoryRecord?.user ??
    firstUpdateUser ??
    data?.latestUpdate?.user ??
    data?.user ??
    null
  );
};

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
  const [fetchedCylinder, setFetchedCylinder] = useState(null);
  const [isFetchingCylinder, setIsFetchingCylinder] = useState(false);
  const totalOperationHours = location.state?.totalOperationHours;
  const { t } = useTranslation("common");

  const selectedData = useMemo(
    () => resolveSelectedData(location.state),
    [location.state],
  );

  const localUpdates = useMemo(
    () => resolveUpdatesList(selectedData),
    [selectedData],
  );

  const serialNumber = useMemo(
    () => getCylinderSerialNumber({ data: selectedData }) || "",
    [selectedData],
  );

  const shouldFetchCylinder = Boolean(
    serialNumber && selectedData && localUpdates.length === 0,
  );

  useEffect(() => {
    if (!shouldFetchCylinder) {
      setFetchedCylinder(null);
      return undefined;
    }

    let cancelled = false;
    setIsFetchingCylinder(true);

    axiosLib
      .get(`/api/cylinder/${encodeURIComponent(serialNumber)}`)
      .then((response) => {
        if (!cancelled) {
          setFetchedCylinder(normalizeApiCylinderResponse(response.data));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFetchedCylinder(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsFetchingCylinder(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [shouldFetchCylinder, serialNumber]);

  const data = useMemo(() => {
    const base = selectedData ?? fetchedCylinder;
    if (!base) return null;

    const fetchedUpdates = resolveUpdatesList(fetchedCylinder);
    const mergedUpdates =
      localUpdates.length > 0 ? localUpdates : fetchedUpdates;

    return attachPrimaryUpdate(
      {
        ...(fetchedCylinder ?? {}),
        ...base,
        serialNumber:
          serialNumber || getCylinderSerialNumber({ data: fetchedCylinder }),
        user: base.user ?? fetchedCylinder?.user,
      },
      mergedUpdates,
    );
  }, [selectedData, fetchedCylinder, localUpdates, serialNumber]);

  const historyUserId = user?.is_admin === 1 ? null : user?.id;

  const normalizedUpdates = useMemo(() => resolveUpdatesList(data), [data]);

  const disposed = data ? isDisposed(data) : false;
  const disposalHistory = data ? getDisposalHistoryDetails(data) : null;
  const latestUpdateRecord = data
    ? getLatestHistoryRecord(data.serialNumber, cylinderUpdates, historyUserId)
    : null;
  const rawDisplayUpdatedAt = data
    ? getDisplayUpdatedAt(data, latestUpdateRecord)
    : null;

  const processHistoryRecord = useMemo(() => {
    if (!data || disposed) return null;

    const fromGlobalList = getLatestStatusHistoryRecord(
      data.serialNumber,
      cylinderUpdates,
      historyUserId,
    );
    if (fromGlobalList) return fromGlobalList;

    return getLatestLocalProcessRecord(normalizedUpdates);
  }, [data, disposed, cylinderUpdates, historyUserId, normalizedUpdates]);

  const modifiedBy = useMemo(() => {
    if (disposed && disposalHistory?.disposedBy) {
      return disposalHistory.disposedBy;
    }

    const updateUser = resolveLastUpdateUser(data, processHistoryRecord);
    const displayName = buildUserDisplayName(updateUser);

    return displayName || t("unknownUser");
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

  if (isFetchingCylinder) {
    return (
      <div className="rounded-md bg-gray-100 p-4 dark:bg-gray-700">
        <p className="text-lg text-gray-600 dark:text-gray-200">{t("loading")}</p>
      </div>
    );
  }

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
