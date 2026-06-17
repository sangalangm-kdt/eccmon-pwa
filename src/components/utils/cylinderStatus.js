const disposedStatusValues = new Set(["disposal", "disposed"]);

export const INVENTORY_PROCESS_STAGES = [
  "disassembly",
  "grooving",
  "lmd",
  "assembly",
  "finishing",
];

const PROCESS_STAGES = new Set(INVENTORY_PROCESS_STAGES);

const SITE_STATUS_ALIASES = {
  dismounting: "dismounted",
};

/** Longer / more specific tokens first — disassembly before assembly. */
const CANONICAL_STATUS_TOKEN_ORDER = [
  "disassembly",
  "dismounted",
  "disposal",
  "disposed",
  "assembly",
  "finishing",
  "grooving",
  "mounted",
  "storage",
  "process",
  "lmd",
];

const CANONICAL_STATUS_TOKENS = new Set(CANONICAL_STATUS_TOKEN_ORDER);

const STATUS_LABEL_OVERRIDES = {
  lmd: "LMD",
};

const toComparableDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getTimestampCandidates = (record) => [
  record?.created_at,
  record?.createdAt,
  record?.dateDone,
  record?.completionDate,
  record?.updated_at,
  record?.updatedAt,
];

const getFirstTimestamp = (...sources) => {
  for (const source of sources) {
    const candidates = Array.isArray(source)
      ? source
      : getTimestampCandidates(source);
    const match = candidates.find(
      (value) =>
        value !== undefined && value !== null && `${value}`.trim() !== "",
    );
    if (match) return match;
  }
  return null;
};

const getComparableTimestamp = (record) =>
  toComparableDate(getFirstTimestamp(record));

const normalizeStatusToken = (value) => {
  if (value === null || value === undefined) return "";
  const normalized = `${value}`.trim().toLowerCase();
  if (!normalized) return "";

  if (SITE_STATUS_ALIASES[normalized]) {
    return SITE_STATUS_ALIASES[normalized];
  }

  if (CANONICAL_STATUS_TOKENS.has(normalized)) {
    return normalized;
  }

  // Compound route strings (e.g. "Disassembly → Assembly"): match specific tokens first.
  for (const token of CANONICAL_STATUS_TOKEN_ORDER) {
    if (normalized.includes(token)) {
      return token;
    }
  }

  return normalized;
};

const formatStatusLabel = (token) => {
  if (!token) return "";
  if (STATUS_LABEL_OVERRIDES[token]) return STATUS_LABEL_OVERRIDES[token];
  return token.charAt(0).toUpperCase() + token.slice(1);
};

const getDisposedFlags = (cylinder) => [
  cylinder?.is_disposed,
  cylinder?.isDisposed,
];

const getDisposedFlag = (cylinder) =>
  getDisposedFlags(cylinder).find(
    (flag) => flag !== undefined && flag !== null,
  );

const mergeDisposedFlags = (...sources) => {
  for (const source of sources) {
    if (!source || typeof source !== "object") continue;
    const flags = getDisposedFlags(source);
    const flag =
      flags.find((value) => Number(value) === 2) ??
      flags.find((value) => value !== undefined && value !== null);

    if (flag !== undefined && flag !== null) {
      return { is_disposed: flag, isDisposed: flag };
    }
  }
  return {};
};

export const getCylinderSerialNumber = (source) => {
  if (!source) return "";

  const data =
    source.data && typeof source.data === "object" ? source.data : source;

  const candidates = [
    data?.serialNumber,
    data?.serial_number,
    source.serialNumber,
    source.serial_number,
  ];

  const match = candidates.find(
    (value) =>
      value !== undefined && value !== null && `${value}`.trim() !== "",
  );

  return match ? `${match}`.trim() : "";
};

/**
 * Merge cylinder payload from scan/navigation state so is_disposed is always
 * available on the data object (API may return the flag on the parent envelope).
 */
export const normalizeScannedCylinder = (locationState) => {
  const data = locationState?.data;
  if (!data || typeof data !== "object") return null;

  return {
    ...data,
    serialNumber: getCylinderSerialNumber(locationState),
    ...mergeDisposedFlags(data, locationState),
  };
};

export const normalizeApiCylinderResponse = (apiResponse) => {
  const data = apiResponse?.data;
  if (!data || typeof data !== "object") return null;

  return {
    ...data,
    ...mergeDisposedFlags(data, apiResponse),
  };
};

export const isScannedResultReadOnly = (locationState) => {
  if (locationState?.isNewCylinder === true) return false;
  if (locationState?.disposedReadOnly === true) return true;

  const cylinder = normalizeScannedCylinder(locationState);
  return isDisposed(cylinder);
};

/**
 * A cylinder is disposed only when is_disposed === 2.
 * disposal_date is never used to determine disposed state.
 */
export const isDisposed = (cylinder) =>
  getDisposedFlags(cylinder).some((flag) => Number(flag) === 2);

export const isDisposalOperation = (status) =>
  normalizeStatusToken(status) === "disposal";

/** True when disposed flag is set or the cover record status/process is Disposal. */
export const isCylinderInDisposalState = (cylinder) => {
  if (isDisposed(cylinder)) return true;

  return (
    isDisposalOperation(cylinder?.status) ||
    isDisposalOperation(cylinder?.process)
  );
};

const toValidCycle = (value) => {
  const cycle = Number(value);
  return Number.isFinite(cycle) && cycle > 0 ? cycle : 1;
};

export const resolveOperationCycle = (
  data = {},
  selectedStatus,
  currentCylinder = null,
) => {
  const baseCycle = toValidCycle(data?.cycle ?? currentCylinder?.cycle);
  const currentStatus = normalizeStatusToken(
    currentCylinder?.status ?? data?.previousStatus ?? data?.status,
  );
  const nextStatus = normalizeStatusToken(selectedStatus);

  return currentStatus === "dismounted" && nextStatus === "storage"
    ? baseCycle + 1
    : baseCycle;
};

export const toDisposalDatePayload = (value) => {
  if (!value) return null;

  if (typeof value === "string") {
    const datePart = value.split("T")[0]?.trim();
    return datePart || null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Canonical operation save fields for cylinder + history APIs.
 * Only Disposal sets is_disposed / isDisposed to 2.
 */
export const buildOperationSavePayload = (
  data = {},
  selectedStatus,
  currentCylinder = null,
) => {
  const isDisposal = isDisposalOperation(selectedStatus);
  const resolvedStatus = isDisposal ? "Disposal" : selectedStatus;
  const disposalDate = isDisposal
    ? toDisposalDatePayload(data.disposalDate ?? data.dateDone)
    : null;
  const disposedFlag = isDisposal ? 2 : 1;
  const serialNumber = getCylinderSerialNumber(data);
  const cycle = resolveOperationCycle(data, selectedStatus, currentCylinder);

  const payload = {
    ...data,
    ...(serialNumber ? { serialNumber } : {}),
    cycle,
    status: resolvedStatus,
    process: resolvedStatus,
    isDisposed: disposedFlag,
    is_disposed: disposedFlag,
    disposalDate,
    disposal_date: disposalDate,
  };

  if (import.meta.env.DEV) {
    console.log("[buildOperationSavePayload] Save payload:", payload);
  }

  return payload;
};

/** @deprecated Use isDisposed */
export const isCylinderDisposed = isDisposed;

export const hasDisposalDate = (cylinder) => {
  const disposalDate = cylinder?.disposalDate;
  if (disposalDate === null || disposalDate === undefined) return false;
  if (typeof disposalDate === "string" && disposalDate.trim() === "") return false;
  return true;
};

/**
 * Display label for cylinder status badges and history.
 * is_disposed === 2 always shows "Disposal".
 */
export const getDisplayStatus = (cylinder) => {
  if (!cylinder) return "--";
  if (isDisposed(cylinder)) {
    return "Disposal";
  }

  const status = cylinder.status;
  if (status === null || status === undefined || `${status}`.trim() === "") {
    return "--";
  }

  return `${status}`.trim();
};

/** @deprecated Use getDisplayStatus */
export const getCylinderStatus = getDisplayStatus;

export const getCylinderStatusKey = (cylinder) => {
  const status = getDisplayStatus(cylinder);
  return status === "--" ? "" : normalizeStatusToken(status);
};

/** @deprecated Use getDisplayStatus */
export const resolveCylinderStatus = getDisplayStatus;

/** @deprecated Use getDisplayStatus */
export const getResolvedCylinderStatus = getDisplayStatus;

export const getHistoryEventStatus = (record) => {
  const cylinder = record?.cylinder ?? record;
  return getDisplayStatus(cylinder);
};

export const getHistoryEventDate = (record) => {
  const cylinder = record?.cylinder ?? record;
  const historyRecord =
    record?.historyRecord ?? record?.updates ?? record?.historyDisplay?.updates ?? null;

  return (
    getFirstTimestamp(historyRecord, cylinder?.updates) ??
    (isDisposed(cylinder) && hasDisposalDate(cylinder)
      ? cylinder.disposalDate
      : null) ??
    null
  );
};

export const getDisplayUpdatedAt = (cylinder, latestUpdate = null) =>
  getFirstTimestamp(
    latestUpdate,
    cylinder?.updates,
    [
      cylinder?.displayUpdatedAt,
      cylinder?.updated_at,
      cylinder?.updatedAt,
      cylinder?.created_at,
      cylinder?.createdAt,
    ],
  );

export const normalizeCylinderStatus = ({ cylinder, status, is_disposed, isDisposed: isDisposedFlag } = {}) =>
  getDisplayStatus(
    cylinder ?? {
      status,
      is_disposed,
      isDisposed: isDisposedFlag,
    },
  );

export const getHistoryRecordsForCylinder = (
  serialNumber,
  historyRecords = [],
  userId = null,
) =>
  historyRecords.filter((record) => {
    if (record.serialNumber !== serialNumber) return false;
    if (userId != null && record.userId !== userId) return false;
    return true;
  });

export const getLatestHistoryRecord = (
  serialNumber,
  historyRecords = [],
  userId = null,
) => {
  const records = getHistoryRecordsForCylinder(
    serialNumber,
    historyRecords,
    userId,
  );

  if (!records.length) return null;

  return [...records].sort((a, b) => {
    const dateA = getComparableTimestamp(a) || new Date(0);
    const dateB = getComparableTimestamp(b) || new Date(0);
    return dateB - dateA;
  })[0];
};

export const getLatestStatusHistoryRecord = (
  serialNumber,
  historyRecords = [],
  userId = null,
) => {
  const records = getHistoryRecordsForCylinder(
    serialNumber,
    historyRecords,
    userId,
  ).filter((record) => {
    const token = normalizeStatusToken(record.process ?? record.operation);
    return !token || !disposedStatusValues.has(token);
  });

  if (!records.length) return null;

  return [...records].sort((a, b) => {
    const dateA = getComparableTimestamp(a) || new Date(0);
    const dateB = getComparableTimestamp(b) || new Date(0);
    return dateB - dateA;
  })[0];
};

/** @deprecated Use getLatestStatusHistoryRecord */
export const getLatestProcessHistoryRecord = getLatestStatusHistoryRecord;

const enrichHistoryEvent = (event) => {
  const status = getDisplayStatus(event.cylinder);
  const statusKey = status === "--" ? "" : normalizeStatusToken(status);

  return {
    serialNumber: event.serialNumber ?? event.cylinder?.serialNumber ?? "",
    status,
    statusKey,
    eventDate: getHistoryEventDate(event),
    displayUpdatedAt: getDisplayUpdatedAt(event.cylinder, event.historyRecord),
    eventType: event.eventType,
    latestRecord: event.historyRecord,
    updates: event.historyRecord,
  };
};

export const buildCylinderHistoryEvents = (
  cylinder,
  historyRecords = [],
  userId = null,
) => {
  if (!cylinder) return [];

  const latestRecord = getLatestHistoryRecord(
    cylinder.serialNumber,
    historyRecords,
    userId,
  );
  const fallbackUpdate =
    cylinder.updates &&
    !disposedStatusValues.has(
      normalizeStatusToken(cylinder.updates.process ?? cylinder.updates.operation),
    )
      ? cylinder.updates
      : null;
  const historyRecord = latestRecord || fallbackUpdate;
  const status = getDisplayStatus(cylinder);

  if (!historyRecord && status === "--") {
    return [];
  }

  const eventType = isDisposed(cylinder) ? "disposal" : "process";
  const historyEvent = {
    eventType,
    cylinder,
    historyRecord,
    serialNumber: cylinder.serialNumber,
  };
  const historyDisplay = enrichHistoryEvent(historyEvent);

  if (process.env.NODE_ENV === "development" && cylinder.serialNumber === "HK-786") {
    console.info("[RecentHistory] HK-786 status resolution", {
      serialNumber: cylinder.serialNumber,
      is_disposed: getDisposedFlag(cylinder),
      cylinderStatus: cylinder.status,
      disposalDate: cylinder.disposalDate,
      resolvedStatus: historyDisplay.status,
      resolvedDate: historyDisplay.eventDate,
    });
  }

  return [
    {
      ...cylinder,
      eventType,
      historyRecord,
      historyDisplay,
      updates: historyDisplay.updates ?? cylinder.updates,
    },
  ];
};

export const resolveCylinderHistoryDisplay = (
  cylinder,
  historyRecords = [],
  userId = null,
) => {
  const events = buildCylinderHistoryEvents(cylinder, historyRecords, userId);
  return (
    events[0]?.historyDisplay ??
    enrichHistoryEvent({
      eventType: isDisposed(cylinder) ? "disposal" : "process",
      cylinder,
      historyRecord: cylinder?.updates ?? null,
      serialNumber: cylinder?.serialNumber ?? "",
    })
  );
};

export const getDisposalHistoryDetails = (cylinder) => {
  if (!isDisposed(cylinder)) {
    return null;
  }

  const updates = cylinder.updates;
  const disposalUpdate =
    normalizeStatusToken(updates?.process) === "disposal" ? updates : null;

  const disposedBy =
    cylinder.disposedBy ??
    cylinder.disposedByUser ??
    (disposalUpdate &&
    cylinder.user &&
    disposalUpdate.userId === cylinder.user?.id
      ? `${cylinder.user.firstName ?? ""} ${cylinder.user.lastName ?? ""}`.trim()
      : null);

  const remarks =
    cylinder.disposalRemarks ??
    cylinder.disposalReason ??
    cylinder.remarks ??
    disposalUpdate?.otherDetails?.disposalRemarks ??
    disposalUpdate?.otherDetails?.disposalReason ??
    disposalUpdate?.otherDetails?.remarks ??
    null;

  return {
    status: true,
    disposalDate: cylinder.disposalDate ?? null,
    disposedBy: disposedBy || null,
    remarks: remarks || null,
  };
};

export const isInventoryProcessStage = (status) =>
  PROCESS_STAGES.has(normalizeStatusToken(status));

/**
 * Resolves the cylinder's current inventory category from the latest known
 * operation. Prefers the newest cylinder-update record (merged into
 * `cylinder.updates` on the home screen) over `cylinder_covers.status`, which
 * can lag after a scan/save if the cover record was not refreshed yet.
 */
const resolveInventoryStatusToken = (cylinder) => {
  const candidates = [
    cylinder?.updates?.process,
    cylinder?.updates?.status,
    cylinder?.updates?.operation,
    cylinder?.process,
    cylinder?.status,
  ];

  for (const candidate of candidates) {
    const token = normalizeStatusToken(candidate);
    if (!token || disposedStatusValues.has(token)) continue;
    return token;
  }

  return "";
};

export const getInventoryCategoryStatus = (cylinder) => {
  if (isCylinderInDisposalState(cylinder)) {
    return "disposal";
  }

  return resolveInventoryStatusToken(cylinder);
};

/**
 * Human-readable label for Recent History badges.
 * Matches the Details page (`getDisplayStatus` on `cylinder.status`).
 */
export const resolveCurrentCylinderStatusLabel = (cylinder) =>
  getDisplayStatus(cylinder);

/** Translated Recent History badge text with resolver + i18n fallback. */
export const getHistoryStatusBadgeText = (item, translate) => {
  const cylinder = item?.cylinder ?? item;
  const label =
    item?.historyDisplay?.status ?? resolveCurrentCylinderStatusLabel(cylinder);

  if (!label || label === "--") return "--";

  const statusKey = normalizeStatusToken(label);

  return translate(`qrScanner:${statusKey}`, { defaultValue: label });
};

/**
 * Dev-only: compare inventory category counts with raw cover status and latest
 * history operations to surface stale `cylinder_covers.status` values.
 */
export const logHomeStatusComparison = ({
  cylinders = [],
  historyRecords = [],
  userId = null,
} = {}) => {
  if (!import.meta.env.DEV) return;

  const withLatestUpdate = (cylinder) => ({
    ...cylinder,
    updates:
      getLatestHistoryRecord(cylinder.serialNumber, historyRecords, userId) ??
      cylinder.updates,
  });

  const inventoryCounts = {};
  const cylinderCoverStatusCounts = {};
  const latestHistoryOperationCounts = {};
  const mismatches = [];

  const increment = (bucket, key) => {
    if (!key) return;
    bucket[key] = (bucket[key] || 0) + 1;
  };

  cylinders.forEach((rawCylinder) => {
    const cylinder = withLatestUpdate(rawCylinder);
    const inventoryToken = getInventoryCategoryStatus(cylinder);
    const coverToken = normalizeStatusToken(cylinder.status);
    const latestHistoryRecord = getLatestHistoryRecord(
      cylinder.serialNumber,
      historyRecords,
      userId,
    );
    const latestOpToken = normalizeStatusToken(
      latestHistoryRecord?.process ?? latestHistoryRecord?.operation,
    );

    increment(inventoryCounts, inventoryToken);
    increment(cylinderCoverStatusCounts, coverToken);
    increment(latestHistoryOperationCounts, latestOpToken);

    if (inventoryToken && coverToken && inventoryToken !== coverToken) {
      mismatches.push({
        serialNumber: cylinder.serialNumber,
        inventoryCategory: inventoryToken,
        cylinderCoverStatus: cylinder.status,
        latestUpdateProcess: cylinder.updates?.process ?? null,
      });
    }
  });

  console.info("[Home] status comparison", {
    inventoryCounts,
    cylinderCoverStatusCounts,
    latestHistoryOperationCounts,
    mismatches,
  });
};

export const matchesInventoryCategory = (cylinder, categoryStatus) => {
  if (!cylinder) return false;

  if (categoryStatus === "disposal") {
    return isCylinderInDisposalState(cylinder);
  }

  if (isCylinderInDisposalState(cylinder)) {
    return false;
  }

  const itemStatus = getInventoryCategoryStatus(cylinder);

  if (Array.isArray(categoryStatus)) {
    return categoryStatus.includes(itemStatus);
  }

  return itemStatus === categoryStatus;
};
