import { formatDate } from "./utils";

const EXCLUDED_DETAIL_KEYS = new Set([
  "user",
  "users",
  "processor",
  "history",
  "locationrelation",
  "user_id",
  "userid",
  "created_at",
  "updated_at",
  "createdat",
  "updatedat",
  "id",
  "serialnumber",
  "process",
  "location",
  "datedone",
  "date_done",
  "cycle",
  "otherdetails",
  "status",
  "operation",
]);

const DETAIL_LABEL_KEYS = {
  case: "viewInfo.addDetails.case",
  ispassed: "viewInfo.addDetails.isPassed",
  ordernumber: "viewInfo.addDetails.orderNo",
  enginenumber: "viewInfo.addDetails.engineNo",
  engine_no: "viewInfo.addDetails.engineNo",
  operationhours: "viewInfo.addDetails.operatingHours",
  operatinghours: "viewInfo.addDetails.operatingHours",
  mountingposition: "viewInfo.addDetails.mountingPosition",
  mounting_position: "viewInfo.addDetails.mountingPosition",
  disposalreason: "viewInfo.disposalHistory.remarks",
  disposalremarks: "viewInfo.disposalHistory.remarks",
  remarks: "viewInfo.disposalHistory.remarks",
};

const ADDITIONAL_FIELD_ORDER = [
  "case",
  "isPassed",
  "orderNumber",
  "engineNumber",
  "engine_no",
  "mountingPosition",
  "mounting_position",
  "operationHours",
  "operatingHours",
  "disposalReason",
  "disposalRemarks",
  "remarks",
];

const ISO_DATE_PATTERN =
  /^\d{4}-\d{2}-\d{2}(?:[T\s]\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;

export const isDisplayableValue = (value) =>
  typeof value === "string" ||
  typeof value === "number" ||
  typeof value === "boolean";

export const isExcludedDetailKey = (key) => {
  const normalized = `${key}`.trim().toLowerCase();
  return EXCLUDED_DETAIL_KEYS.has(normalized);
};

export const parseOtherDetails = (value) => {
  if (value === null || value === undefined) return {};

  if (typeof value === "object" && !Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      return {};
    }
  }

  return {};
};

export const formatDisplayValue = (value) => {
  if (!isDisplayableValue(value)) return null;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  const text = String(value).trim();
  return text === "" ? null : text;
};

export const formatActivityTimestamp = (value) => {
  if (value === null || value === undefined || value === "") return null;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    const normalized = value.toISOString().replace("T", " ");
    return normalized.length > 16 ? normalized.slice(0, 16) : normalized;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const normalized = trimmed.replace("T", " ");
    return normalized.length > 16 ? normalized.slice(0, 16) : normalized;
  }

  return String(value);
};

const hasTimeComponent = (value) => {
  if (value instanceof Date) {
    return (
      value.getHours() > 0 ||
      value.getMinutes() > 0 ||
      value.getSeconds() > 0 ||
      value.getMilliseconds() > 0
    );
  }

  if (typeof value === "string") {
    return /T\d{2}:\d{2}/.test(value) || /\d{1,2}:\d{2}/.test(value);
  }

  return false;
};

export const formatDetailDateTime = (value, t) => {
  if (value === null || value === undefined || value === "") return null;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return formatDisplayValue(value);
  }

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const timePart = `${hours}:${minutes}`;

  if (t) {
    try {
      return `${formatDate(date, t)} ${timePart}`;
    } catch {
      return formatActivityTimestamp(date);
    }
  }

  return `${date.toLocaleDateString()} ${timePart}`;
};

export const formatDetailDate = (value, t) => {
  if (value === null || value === undefined || value === "") return null;

  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isNaN(date.getTime())) {
    if (hasTimeComponent(value)) {
      return formatDetailDateTime(value, t);
    }

    if (t) {
      try {
        return formatDate(date, t);
      } catch {
        return formatActivityTimestamp(date);
      }
    }
    return formatActivityTimestamp(date);
  }

  return formatDisplayValue(value);
};

export const formatDetailLabel = (key, t) => {
  const normalized = `${key}`.trim().toLowerCase();
  const translationKey = DETAIL_LABEL_KEYS[normalized];

  if (translationKey && t) {
    return t(translationKey);
  }

  return `${key}`
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const normalizeDetailValue = (value, { t, key } = {}) => {
  if (!isDisplayableValue(value)) return null;

  const text = String(value).trim();
  if (!text) return null;

  if (ISO_DATE_PATTERN.test(text) || (text.includes("T") && !Number.isNaN(Date.parse(text)))) {
    return formatDetailDate(text, t) ?? formatActivityTimestamp(text);
  }

  return formatDisplayValue(value);
};

const getFieldOrderIndex = (key) => {
  const normalized = `${key}`.trim();
  const index = ADDITIONAL_FIELD_ORDER.indexOf(normalized);
  if (index !== -1) return index;

  const lowerIndex = ADDITIONAL_FIELD_ORDER.findIndex(
    (field) => field.toLowerCase() === normalized.toLowerCase(),
  );
  return lowerIndex === -1 ? ADDITIONAL_FIELD_ORDER.length + 1 : lowerIndex;
};

const mapCaseRow = (rawValue, t) => {
  const caseMap = {
    0: t("viewInfo.addDetails.caseValues.newBuild"),
    1: t("viewInfo.addDetails.caseValues.regeneration"),
    2: t("viewInfo.addDetails.caseValues.maintenance"),
  };

  const label = caseMap[parseInt(rawValue, 10)];
  if (!label) return null;

  return {
    key: "case",
    label: t("viewInfo.addDetails.case"),
    value: label,
    kind: "text",
  };
};

const mapStatusRow = (rawValue, t) => {
  const statusMap = [
    t("viewInfo.addDetails.statusValues.ongoing"),
    t("viewInfo.addDetails.statusValues.passed"),
    t("viewInfo.addDetails.statusValues.failed"),
  ];
  const numericValue = parseInt(rawValue, 10);
  const label = statusMap[numericValue];
  if (!label) return null;

  let badgeTone = "ongoing";
  if (numericValue === 1) badgeTone = "pass";
  else if (numericValue === 2) badgeTone = "fail";

  return {
    key: "isPassed",
    label: t("viewInfo.addDetails.isPassed"),
    value: label,
    kind: "badge",
    badgeTone,
  };
};

export const mapDetailEntryToRow = (key, rawValue, { t }) => {
  if (key === "case") {
    return mapCaseRow(rawValue, t);
  }

  if (key === "isPassed") {
    return mapStatusRow(rawValue, t);
  }

  const value = normalizeDetailValue(rawValue, { t, key });
  if (!value) return null;

  return {
    key,
    label: formatDetailLabel(key, t),
    value,
    kind: "text",
  };
};

export const getDisplayableDetailEntries = (otherDetails) =>
  Object.entries(parseOtherDetails(otherDetails)).filter(
    ([key, value]) =>
      !isExcludedDetailKey(key) && isDisplayableValue(value),
  );

export const buildAdditionalDetailRows = (
  otherDetails,
  { t, displayStatus, totalOperationHours } = {},
) => {
  if (!t) return [];

  const entries = getDisplayableDetailEntries(otherDetails).sort(
    ([keyA], [keyB]) => getFieldOrderIndex(keyA) - getFieldOrderIndex(keyB),
  );

  const normalizedStatus = `${displayStatus ?? ""}`.trim().toLowerCase();
  const showTotalHours =
    normalizedStatus === "mounted" || normalizedStatus === "dismounted";

  const rows = [];

  entries.forEach(([key, rawValue]) => {
    const row = mapDetailEntryToRow(key, rawValue, { t });
    if (row) {
      rows.push(row);
    }

    if (
      (key === "operationHours" || key === "operatingHours") &&
      showTotalHours &&
      totalOperationHours !== null &&
      totalOperationHours !== undefined &&
      `${totalOperationHours}`.trim() !== ""
    ) {
      rows.push({
        key: "totalHours",
        label: t("viewInfo.addDetails.totalHours"),
        value: String(totalOperationHours),
        kind: "text",
      });
    }
  });

  return rows;
};

const buildCommonRow = (key, label, value, type = "text", t) => {
  if (type === "process") {
    return { key, label, value, type };
  }

  const formatted =
    type === "date"
      ? formatDetailDate(value, t)
      : type === "timestamp"
        ? formatDetailDateTime(value, t) ?? formatActivityTimestamp(value)
        : formatDisplayValue(value);

  if (!formatted) return null;

  return {
    key,
    label,
    value: formatted,
    type: "text",
  };
};

export const buildDisplayDetails = (cylinder, options = {}) => {
  const {
    t,
    historyRecord,
    modifiedBy,
    displayUpdatedAt,
    displayStatus,
    completionDate,
    totalOperationHours,
    disposed = false,
    disposalHistory,
  } = options;

  const record = historyRecord ?? cylinder?.updates ?? {};
  const serialNumber =
    cylinder?.serialNumber ?? record?.serialNumber ?? null;

  if (disposed) {
    const commonRows = [
      buildCommonRow("lastModifiedBy", t?.("viewInfo.lastModifiedBy"), modifiedBy, "text", t),
      buildCommonRow("updated", t?.("updated"), displayUpdatedAt, "timestamp", t),
      buildCommonRow("process", t?.("viewInfo.process"), displayStatus, "process", t),
      buildCommonRow(
        "completionDate",
        t?.("viewInfo.completionDate"),
        cylinder?.disposalDate ?? disposalHistory?.disposalDate,
        "date",
        t,
      ),
      buildCommonRow("location", t?.("viewInfo.location"), record?.location, "text", t),
      buildCommonRow("cycle", t?.("viewInfo.cycle"), record?.cycle, "text", t),
    ].filter(Boolean);

    const disposalHistoryRows = disposalHistory
      ? [
          {
            key: "disposalStatus",
            label: t("viewInfo.disposalHistory.disposalStatus"),
            value: t("qrScanner:disposal"),
            type: "text",
          },
          buildCommonRow(
            "disposalHistoryDate",
            t("viewInfo.disposalHistory.disposalDate"),
            disposalHistory.disposalDate,
            "date",
            t,
          ),
          buildCommonRow(
            "disposedBy",
            t("viewInfo.disposalHistory.disposedBy"),
            disposalHistory.disposedBy,
            "text",
            t,
          ),
          buildCommonRow(
            "remarks",
            t("viewInfo.disposalHistory.remarks"),
            disposalHistory.remarks,
            "text",
            t,
          ),
        ].filter(Boolean)
      : [];

    const additionalRows = buildAdditionalDetailRows(record?.otherDetails, {
      t,
      displayStatus,
      totalOperationHours,
    });

    return {
      serialNumber,
      commonRows,
      disposalHistoryRows,
      additionalRows,
    };
  }

  const commonRows = [
    buildCommonRow("lastModifiedBy", t?.("viewInfo.lastModifiedBy"), modifiedBy, "text", t),
    buildCommonRow("updated", t?.("updated"), displayUpdatedAt, "timestamp", t),
    buildCommonRow("process", t?.("viewInfo.process"), displayStatus, "process", t),
    buildCommonRow(
      "completionDate",
      t?.("viewInfo.completionDate"),
      completionDate,
      "date",
      t,
    ),
    buildCommonRow("location", t?.("viewInfo.location"), record?.location, "text", t),
    buildCommonRow("cycle", t?.("viewInfo.cycle"), record?.cycle, "text", t),
  ].filter(Boolean);

  const additionalRows = buildAdditionalDetailRows(record?.otherDetails, {
    t,
    displayStatus,
    totalOperationHours,
  });

  return {
    serialNumber,
    commonRows,
    disposalHistoryRows: [],
    additionalRows,
  };
};
