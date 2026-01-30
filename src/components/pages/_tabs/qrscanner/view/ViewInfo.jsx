import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { getStatusColors } from "../../../../utils/statusColors";

/**
 * Small, safe status pill with translation support.
 */
export const ProcessStatus = ({ status }) => {
  const { t } = useTranslation("qrScanner");
  const safeStatus = String(status ?? "").trim();
  const lower = safeStatus.toLowerCase();

  const translated = t(`qrScanner:${lower}`, {
    defaultValue: safeStatus || "--",
  });

  // If your getStatusColors expects raw keys like "Storage", "Disposal", etc.
  const { textColor, bgColor } = getStatusColors(safeStatus);

  return (
    <span
      className={`rounded-full px-3 py-1 text-tiny font-medium ${textColor} ${bgColor}`}
    >
      {translated}
    </span>
  );
};

const ViewInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * ✅ Robust state shape handling:
   * - sometimes you pass { state: res.data }
   * - sometimes { state: { data: res.data } }
   */
  const payload = location.state;

  // supports BOTH: {data: {...}} OR {...}
  const data = payload?.data ?? payload;

  // sometimes totalOperationHours is stored separately, sometimes inside data
  const totalOperationHours =
    payload?.totalOperationHours ?? data?.totalOperationHours ?? 0;

  const updates = data?.updates;
  const { t } = useTranslation("common");

  const [modifiedBy, setModifiedBy] = useState(t("unknownUser"));

  // ✅ Labels: memoized so re-render doesn't rebuild
  const labels = useMemo(
    () => ({
      serialNumber: t("viewInfo.serialNo"),
      location: t("viewInfo.location"),
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
    }),
    [t],
  );

  // ✅ Null-safe + correct name building
  useEffect(() => {
    const updatedById = updates?.userId;
    const userId = data?.user?.id;

    if (updatedById && userId && updatedById === userId) {
      const first = data?.user?.firstName ?? "";
      const last = data?.user?.lastName ?? "";
      const full = `${first} ${last}`.trim();
      setModifiedBy(full || t("unknownUser"));
    } else {
      setModifiedBy(t("unknownUser"));
    }
  }, [data?.user, updates?.userId, t]);

  // ✅ Early guard for refresh/direct-open
  if (!data || !updates) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6 dark:bg-gray-800">
        <div className="w-full max-w-md rounded-xl bg-white p-5 text-center shadow dark:bg-gray-700">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-50">
            {t("noUpdatesAvailable")}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-200">
            Please go back and select a record again.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-4 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white"
          >
            {t("viewInfo.back")}
          </button>
        </div>
      </div>
    );
  }

  // ✅ helper: format datetime like "2026-01-30T12:34" -> "2026-01-30 12:34"
  const formatDateTime = (v) => {
    if (!v) return "--";
    const s = String(v);
    return s.includes("T") ? s.replace("T", " ") : s;
  };

  const mapCaseValue = (v) => {
    const n = Number(v);
    const map = {
      0: t("viewInfo.addDetails.caseValues.newBuild"),
      1: t("viewInfo.addDetails.caseValues.regeneration"),
      2: t("viewInfo.addDetails.caseValues.maintenance"),
    };
    return map[n] ?? "--";
  };

  const mapPassedValue = (v) => {
    const n = Number(v);
    // your existing mapping: 0 ongoing, 1 passed, 2 failed
    if (n === 1) return { text: t("qrScanner:label.passed"), tone: "passed" };
    if (n === 2) return { text: t("qrScanner:label.failed"), tone: "failed" };
    return { text: t("qrScanner:label.ongoing"), tone: "ongoing" };
  };

  const passedPillClass = (tone) => {
    if (tone === "passed")
      return "bg-green-100 text-green-600 dark:bg-green-200";
    if (tone === "failed") return "bg-red-100 text-red-600 dark:bg-red-200";
    return "bg-sky-100 text-sky-600 dark:border dark:border-sky-400 dark:bg-sky-300";
  };

  const HIDDEN_KEYS = new Set([
    "id",
    "serialNumber",
    "process",
    "location",
    "dateDone",
    "createdAt",
    "userId",
    "cycle",
  ]);

  const shouldShowTotalHours = (() => {
    const st = String(data?.status ?? "").toLowerCase();
    return st === "mounted" || st === "dismounted";
  })();

  const renderOtherDetails = (obj) => {
    if (!obj || typeof obj !== "object") return null;

    const entries = Object.entries(obj).filter(([k]) => !HIDDEN_KEYS.has(k));

    if (!entries.length)
      return (
        <p className="text-sm text-gray-500 dark:text-gray-200">
          {t("viewInfo.noDataToDisplay")}
        </p>
      );

    return (
      <ul className="space-y-1 text-sm">
        {entries.map(([k, v], idx) => {
          const isLast = idx === entries.length - 1;
          const rowBorder = !isLast
            ? "border-b border-gray-200 dark:border-gray-500"
            : "";

          if (k === "case") {
            return (
              <li
                key={k}
                className={`flex items-center justify-between px-2 py-2 ${rowBorder}`}
              >
                <span className="text-md font-medium text-gray-700 dark:text-gray-100">
                  {labels.case}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-200">
                  {mapCaseValue(v)}
                </span>
              </li>
            );
          }

          if (k === "isPassed") {
            const mapped = mapPassedValue(v);
            return (
              <li
                key={k}
                className={`flex items-center justify-between px-2 py-2 ${rowBorder}`}
              >
                <span className="text-md font-medium text-gray-700 dark:text-gray-100">
                  {labels.isPassed}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${passedPillClass(mapped.tone)}`}
                >
                  {mapped.text}
                </span>
              </li>
            );
          }

          return (
            <React.Fragment key={k}>
              <li
                className={`flex items-center justify-between px-2 py-2 ${rowBorder}`}
              >
                <span className="text-md font-medium text-gray-700 dark:text-gray-100">
                  {labels[k] || k}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-200">
                  {String(v ?? "--")}
                </span>
              </li>

              {k === "operationHours" && shouldShowTotalHours && (
                <li className="flex items-center justify-between border-b border-gray-200 px-2 py-2 dark:border-gray-500">
                  <span className="text-md font-medium text-gray-700 dark:text-gray-100">
                    {labels.totalHours}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-200">
                    {Number(totalOperationHours) || 0}
                  </span>
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-800">
      {/* Header */}
      <div className="flex h-20 w-full items-center justify-between rounded-b-2xl bg-white px-4 shadow-sm dark:bg-gray-700">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 rounded-lg px-2 py-2 text-cyan-500 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <IoArrowBack size={20} />
          <span className="text-sm font-medium">{t("viewInfo.back")}</span>
        </button>

        <div className="flex-1 text-center">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {t("viewInfo.details")}
          </p>
        </div>

        {/* Spacer to balance header layout */}
        <div className="w-[72px]" />
      </div>

      <div className="flex w-full flex-col gap-3 p-4">
        {/* Serial Card */}
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-600">
          <p className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-50">
            {updates?.serialNumber ?? "--"}
          </p>
          <p className="pt-2 text-center text-xs text-gray-500 dark:text-gray-200">
            {t("viewInfo.serialNo")}
          </p>
        </div>

        {/* Summary Card */}
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-600">
          {[
            { label: t("viewInfo.lastModifiedBy"), value: modifiedBy },
            {
              label: t("viewInfo.process"),
              value: updates?.process,
              isProcess: true,
            },
            {
              label: t("viewInfo.completionDate"),
              value: formatDateTime(updates?.dateDone),
            },
            { label: t("viewInfo.location"), value: updates?.location ?? "--" },
            { label: t("viewInfo.cycle"), value: updates?.cycle ?? "--" },
            { label: t("viewInfo.disposal"), value: data?.disposal ?? "--" },
            {
              label: t("viewInfo.disposalDate"),
              value: formatDateTime(data?.disposalDate),
            },
          ].map(({ label, value, isProcess }) => (
            <div
              key={label}
              className="flex items-center justify-between border-b border-gray-200 px-2 py-2 last:border-b-0 dark:border-gray-500"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-50">
                {label}
              </span>

              {isProcess ? (
                <ProcessStatus status={value || updates?.process} />
              ) : (
                <span className="text-sm text-gray-600 dark:text-gray-100">
                  {String(value ?? "--")}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Details Card */}
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-600">
          <p className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-50">
            {labels.otherDetails}
          </p>

          {updates?.otherDetails && typeof updates.otherDetails === "object" ? (
            renderOtherDetails(updates.otherDetails)
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-200">
              {t("viewInfo.noDataToDisplay")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewInfo;
