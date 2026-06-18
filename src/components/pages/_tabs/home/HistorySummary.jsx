/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { GoSortDesc, GoSortAsc } from "react-icons/go";
import {
  sortHistoryByDate,
  filterHistory,
  formatDate,
} from "../../../utils/utils";
import { useCylinderCover } from "../../../../hooks/cylinderCover";
import { getStatusColors } from "../../../utils/statusColors";
import HistorySummarySkeleton from "../../../constants/skeleton/HistorySummary";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { IoChevronForwardOutline, IoTimeOutline } from "react-icons/io5";
import ResponsiveDatePicker from "../../../constants/ResponsiveDatePicker";
import FullScreenSheet from "../../../constants/FullScreenSheet";
import { useAuthentication } from "../../../../hooks/auth";
import {
  normalizeApiListResponse,
  useCylinderUpdate,
} from "../../../../hooks/cylinderUpdates";
import { customSelectStyle } from "../../../utils/selectUtils";
import {
  buildCylinderHistoryEvents,
  getDisplayStatus,
  getHistoryEventDate,
  getHistoryStatusBadgeText,
  resolveCurrentCylinderStatusLabel,
} from "../../../utils/cylinderStatus";

const PREVIEW_LIMITS = {
  mobile: 5,
  tablet: 8,
  desktop: 10,
};

const getPreviewRecordLimit = () => {
  if (typeof window === "undefined") return PREVIEW_LIMITS.mobile;
  if (window.matchMedia("(min-width: 1024px)").matches) {
    return PREVIEW_LIMITS.desktop;
  }
  if (window.matchMedia("(min-width: 768px)").matches) {
    return PREVIEW_LIMITS.tablet;
  }
  return PREVIEW_LIMITS.mobile;
};

const HISTORY_PAGE_SIZE = 50;

const getUpdateTimestamp = (update) =>
  update?.dateDone ??
  update?.date_done ??
  update?.createdAt ??
  update?.created_at ??
  update?.updatedAt ??
  update?.updated_at ??
  null;

const getRecordUserId = (update) =>
  update?.user_id ??
  update?.userId ??
  update?.user?.user_id ??
  update?.user?.userId ??
  null;

const HistorySummary = () => {
  const { user, isLoading: isUserLoading } = useAuthentication();
  const { t } = useTranslation(["common", "date", "qrScanner"]);
  const navigate = useNavigate();

  const queriesEnabled = !isUserLoading && !!user;
  const locationFilter = user?.is_admin === 1 ? "" : user?.affiliation || "";
  const currentUserId = user?.user_id ?? user?.userId ?? null;
  const historyUserId = user?.is_admin === 1 ? null : currentUserId;

  const cylinderListQuery = {
    enabled: queriesEnabled,
    perPage: HISTORY_PAGE_SIZE,
    page: 1,
    includeUpdates: true,
    direction: "desc",
    ...(locationFilter ? { location: locationFilter } : {}),
  };

  const updateListQuery = {
    enabled: queriesEnabled,
    perPage: HISTORY_PAGE_SIZE,
    page: 1,
  };

  const { cylinder: cylinderListResponse, isLoading: isCylindersLoading } =
    useCylinderCover(cylinderListQuery);
  const { records: cylinderUpdates, isLoading: isUpdatesLoading } =
    useCylinderUpdate(updateListQuery);

  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState("latest");
  const [sortOrder, setSortOrder] = useState("desc");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewLimit, setPreviewLimit] = useState(PREVIEW_LIMITS.mobile);

  const cylinders = useMemo(
    () => normalizeApiListResponse(cylinderListResponse),
    [cylinderListResponse],
  );

  const safeCylinderUpdates = useMemo(
    () => (Array.isArray(cylinderUpdates) ? cylinderUpdates : []),
    [cylinderUpdates],
  );

  const scopedCylinderUpdates = useMemo(() => {
    if (!locationFilter) return safeCylinderUpdates;

    return safeCylinderUpdates.filter((item) => {
      const itemLocation = item.location;
      if (!itemLocation || itemLocation === "None") return true;
      return itemLocation === locationFilter;
    });
  }, [safeCylinderUpdates, locationFilter]);

  const filteredCylinderUpdates = useMemo(() => {
    if (historyUserId == null) return scopedCylinderUpdates;

    return scopedCylinderUpdates.filter((update) => {
      const recordUserId = getRecordUserId(update);
      return String(recordUserId) === String(historyUserId);
    });
  }, [scopedCylinderUpdates, historyUserId]);

  const sortedCylinderUpdates = useMemo(() => {
    return [...filteredCylinderUpdates].sort((a, b) => {
      const dateA = getUpdateTimestamp(a);
      const dateB = getUpdateTimestamp(b);
      const timeA = dateA ? new Date(dateA).getTime() : 0;
      const timeB = dateB ? new Date(dateB).getTime() : 0;

      return timeB - timeA;
    });
  }, [filteredCylinderUpdates]);

  function filterDataByCycle(data) {
    const grouped = {};

    [...data]
      .sort((a, b) => {
        const dateA = a.createdAt ?? a.created_at;
        const dateB = b.createdAt ?? b.created_at;
        return new Date(dateA) - new Date(dateB);
      })
      .forEach((item) => {
        const serialNumber = item.serialNumber ?? item.serial_number;
        const key = `${serialNumber}-${item.cycle}`;
        grouped[key] = { ...item, serialNumber };
      });

    const filteredData = Object.values(grouped);

    return filteredData.reduce((acc, item) => {
      let existingGroup = acc.find(
        (group) => group.serialNumber === item.serialNumber,
      );
      if (!existingGroup) {
        existingGroup = { serialNumber: item.serialNumber, data: [] };
        acc.push(existingGroup);
      }
      existingGroup.data.push(item);
      return acc;
    }, []);
  }

  const cycleGroupedUpdates = useMemo(
    () => filterDataByCycle(scopedCylinderUpdates),
    [scopedCylinderUpdates],
  );

  const buildHistoryItems = (cylinder) =>
    buildCylinderHistoryEvents(cylinder, sortedCylinderUpdates, historyUserId);

  const cylinderBySerialNumber = useMemo(() => {
    return new Map(
      cylinders
        .filter((cylinder) => cylinder?.serialNumber)
        .map((cylinder) => [cylinder.serialNumber, cylinder]),
    );
  }, [cylinders]);

  const buildFallbackCylinderFromUpdate = (update) => {
    if (!update) return null;

    return {
      serialNumber: update.serialNumber ?? update.serial_number,
      status: update.process ?? update.status ?? "--",
      process: update.process,
      location: update.location,
      cycle: update.cycle,
      updates: update,
      createdAt: update.createdAt ?? update.created_at,
      updatedAt: update.updatedAt ?? update.updated_at,
    };
  };

  useEffect(() => {
    const updatePreviewLimit = () => {
      setPreviewLimit(getPreviewRecordLimit());
    };

    updatePreviewLimit();
    window.addEventListener("resize", updatePreviewLimit);
    return () => window.removeEventListener("resize", updatePreviewLimit);
  }, []);

  // Effect for handling sorting and filtering updates
  useEffect(() => {
    if (isUserLoading || isCylindersLoading || isUpdatesLoading) {
      setLoading(true);
      return;
    }

    setLoading(false);

    // Filter the cylinders that have matching updates for the user. If a
    // matching cylinder record is missing, fall back to the update itself.
    const userSerialNumbers = new Set(
      sortedCylinderUpdates.map(
        (update) => update.serialNumber ?? update.serial_number,
      ),
    );
    const userHistory = Array.from(userSerialNumbers).flatMap(
      (serialNumber) => {
        const latestUpdate = sortedCylinderUpdates.find(
          (update) =>
            (update.serialNumber ?? update.serial_number) === serialNumber,
        );
        const cylinder =
          cylinderBySerialNumber.get(serialNumber) ??
          buildFallbackCylinderFromUpdate(latestUpdate);

        return buildHistoryItems(cylinder);
      },
    );

    // Apply the filter and sort logic
    const sortedHistory = sortHistoryByDate(userHistory, sortOrder); // First sort by date

    // Then apply the custom filtering based on selected filter and date range
    const filteredData = filterHistory(
      sortedHistory,
      filter,
      startDate,
      endDate,
    );

    // Update the filtered history if it has changed
    if (JSON.stringify(filteredData) !== JSON.stringify(filteredHistory)) {
      setFilteredHistory(filteredData);
    }
  }, [
    cylinders,
    sortedCylinderUpdates,
    cylinderBySerialNumber,
    historyUserId,
    isUserLoading,
    isCylindersLoading,
    isUpdatesLoading,
    sortOrder,
    filter,
    startDate,
    endDate,
    locationFilter,
  ]);

  useEffect(() => {
    setShowAll(false);
  }, []);

  const handleFilterChange = (selectedOption) => {
    setFilter(selectedOption.value);
  };

  const handleDateChange = (date, name) => {
    name === "startDate" ? setStartDate(date) : setEndDate(date);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleCycleClick = (item) => {
    const cylinder = item.cylinder ?? item;
    const processEvent = buildCylinderHistoryEvents(
      cylinder,
      scopedCylinderUpdates,
      historyUserId,
    ).find((event) => event.eventType === "process");

    const totalOperationHours = cycleGroupedUpdates
      ?.filter((data) => cylinder.serialNumber === data.serialNumber)
      .map((entry) => {
        const totalHours = entry.data.reduce((sum, entryItem) => {
          return sum + (parseInt(entryItem.otherDetails?.operationHours) || 0);
        }, 0);

        return totalHours;
      })[0];

    navigate("/view-info", {
      state: {
        data: {
          ...cylinder,
          updates: processEvent?.updates ?? cylinder.updates,
        },
        totalOperationHours: totalOperationHours,
      },
    });
  };

  const filterOptions = [
    { value: "latest", label: t("common:latest") },
    { value: "thisMonth", label: t("common:thisMonth") },
    { value: "last7", label: t("common:last7Days") },
    { value: "last30", label: t("common:last30Days") },
    { value: "custom", label: t("common:customDateRange") },
  ];

  const getHistorySearchText = (item) => {
    const cylinder = item.cylinder ?? item;
    const status =
      item.historyDisplay?.status ?? getDisplayStatus(cylinder);
    const statusKey =
      item.historyDisplay?.statusKey ?? status.toLowerCase();
    const eventDate =
      item.historyDisplay?.eventDate ?? getHistoryEventDate(item);
    const serialNumber = item.historyDisplay?.serialNumber ?? item.serialNumber;
    const eventDateValue = eventDate ? new Date(eventDate) : null;
    const translatedStatus = t(`qrScanner:${statusKey}`);
    const formattedDate =
      eventDateValue && !Number.isNaN(eventDateValue.getTime())
        ? formatDate(eventDateValue, t)
        : "";

    return [serialNumber, status, translatedStatus, formattedDate, eventDate]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  };

  const visibleHistory = filteredHistory.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return getHistorySearchText(item).includes(query);
  });

  const isDarkMode = document.documentElement.classList.contains("dark");

  const historyGridCols =
    "md:grid md:grid-cols-[minmax(6rem,1.2fr)_minmax(5rem,1fr)_7.5rem_4rem] md:items-center md:gap-4";

  const renderHistoryColumnHeaders = (sticky = false) => (
    <div
      className={`${historyGridCols} hidden border-b border-gray-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:border-gray-600 dark:text-gray-300 md:grid ${
        sticky
          ? "sticky top-0 z-[1] bg-white dark:bg-gray-700"
          : ""
      }`}
    >
      <span>{t("qrScanner:serialNumber")}</span>
      <span>{t("qrScanner:status")}</span>
      <span>{t("qrScanner:label.completionDate")}</span>
      <span className="text-right">{t("date:time")}</span>
    </div>
  );

  const renderHistoryItem = (item, index) => {
    const cylinder = item.cylinder ?? item;
    const statusLabel =
      item.historyDisplay?.status ??
      resolveCurrentCylinderStatusLabel(cylinder);
    const badgeText = getHistoryStatusBadgeText(item, t);
    const eventDate =
      item.historyDisplay?.eventDate ?? getHistoryEventDate(item);
    const serialNumber =
      item.historyDisplay?.serialNumber ?? item.serialNumber;
    const { bgColor, textColor } = getStatusColors(statusLabel);
    const eventDateValue = eventDate ? new Date(eventDate) : null;
    const hasValidEventDate =
      eventDateValue && !Number.isNaN(eventDateValue.getTime());
    const timeLabel = hasValidEventDate
      ? `${String(eventDateValue.getHours()).padStart(2, "0")}:${String(eventDateValue.getMinutes()).padStart(2, "0")}`
      : "--";
    const dateLabel = hasValidEventDate
      ? formatDate(eventDateValue, t)
      : "--";

    return (
      <li
        key={`${serialNumber}-${item.eventType ?? "process"}-${index}`}
        className="cursor-pointer border-b border-gray-200 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600/60"
        onClick={() => handleCycleClick(item)}
      >
        <div className="px-3 py-3 md:hidden">
          <p className="flex min-w-0 items-center justify-between gap-2 font-normal">
            <span className="min-w-0 truncate text-lg font-semibold leading-tight text-gray-900 dark:text-gray-50">
              {serialNumber || "--"}
            </span>
            <span className="shrink-0 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {timeLabel}
            </span>
          </p>
          <div className="mt-0.5 flex min-w-0 items-center justify-between gap-2">
            <p
              className={`max-w-[65%] truncate rounded-full px-1.5 py-0.5 text-tiny font-medium ${bgColor} ${textColor}`}
              title={badgeText}
            >
              {badgeText}
            </p>
            <p className="shrink-0 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {dateLabel}
            </p>
          </div>
        </div>

        <div
          className={`${historyGridCols} hidden px-3 py-2.5 md:grid`}
        >
          <span className="ecc-serial truncate md:text-sm">
            {serialNumber || "--"}
          </span>
          <span
            className={`w-fit max-w-full truncate rounded-full px-2 py-0.5 text-tiny font-medium ${bgColor} ${textColor}`}
            title={badgeText}
          >
            {badgeText}
          </span>
          <span className="truncate text-xs text-gray-500 dark:text-gray-300">
            {dateLabel}
          </span>
          <span className="text-right text-xs font-semibold text-gray-500 dark:text-gray-300">
            {timeLabel}
          </span>
        </div>
      </li>
    );
  };

  const renderHistoryEmptyState = (isSearchResult = false) => {
    if (isSearchResult) {
      return (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          <p>{t("common:noHistoryFound")}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center px-4 py-8 text-center md:py-10">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-600 dark:text-gray-300">
          <IoTimeOutline className="h-7 w-7" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-50 md:text-lg">
          {t("common:dashboardEmpty.noActivityTitle")}
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {t("common:dashboardEmpty.noActivityDescription")}
        </p>
        <button
          type="button"
          onClick={() => navigate("/qrscanner")}
          className="ecc-touch-btn mt-5 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-cyan-to-blue px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-105 active:scale-[0.99]"
        >
          {t("common:dashboardEmpty.scanQrCode")}
        </button>
      </div>
    );
  };

  const renderHistoryList = (expanded = false, items = visibleHistory) => {
    if (loading) {
      return (
        <div className="p-4">
          <HistorySummarySkeleton />
        </div>
      );
    }

    if (items.length === 0) {
      return renderHistoryEmptyState(Boolean(searchQuery.trim()));
    }

    return (
      <>
        {renderHistoryColumnHeaders(expanded)}
        <ul className="min-w-0 divide-y divide-gray-100 dark:divide-gray-600">
          {items.map(renderHistoryItem)}
        </ul>
      </>
    );
  };

  const previewHistory = visibleHistory.slice(0, previewLimit);

  return (
    <>
      <div className="flex w-full flex-col overflow-hidden rounded-lg bg-white shadow dark:bg-gray-700 md:rounded-xl md:shadow-sm">
        <div className="flex flex-col bg-white dark:bg-gray-700">
          <div className="border-b border-gray-300 px-3 py-2 dark:border-gray-600 md:px-3 md:py-3">
            <div className="flex items-center justify-between">
              <label className="text-lg font-semibold text-gray-700 dark:text-gray-50 md:ecc-section-title">
                {t("common:recentHistory")}
              </label>
              <button
                type="button"
                className="flex items-center gap-0.5 text-sm text-primaryText transition-colors hover:text-primary dark:text-gray-50"
                onClick={() => setShowAll(true)}
              >
                <span>See all</span>
                <IoChevronForwardOutline />
              </button>
            </div>
          </div>

          {renderHistoryList(false, previewHistory)}
        </div>
      </div>

      <FullScreenSheet
        isOpen={showAll}
        onClose={() => setShowAll(false)}
        title={t("common:recentHistory")}
        closeLabel={t("common:backButton")}
        zIndex={110}
        stickyContent={
          <div className="flex w-full flex-col gap-3 text-sm">
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("common:searchHistory")}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-600 dark:text-gray-50"
            />

            <div className="flex min-w-0 items-center justify-between gap-2">
              <Select
                className="min-w-0 flex-1"
                options={filterOptions}
                value={filterOptions.find((option) => option.value === filter)}
                onChange={handleFilterChange}
                styles={customSelectStyle(isDarkMode)}
              />
              <button
                type="button"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center py-2"
                onClick={toggleSortOrder}
              >
                {sortOrder === "asc" ? (
                  <GoSortAsc
                    size={24}
                    className="text-gray-600 dark:text-gray-100"
                  />
                ) : (
                  <GoSortDesc
                    size={24}
                    className="text-gray-600 dark:text-gray-100"
                  />
                )}
              </button>
            </div>

            {filter === "custom" ? (
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:gap-3">
                <div className="min-w-0 flex-1">
                  <ResponsiveDatePicker
                    selected={startDate}
                    onChange={(date) => handleDateChange(date, "startDate")}
                    title={t("date:startDate")}
                    maxDate={endDate ?? undefined}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <ResponsiveDatePicker
                    selected={endDate}
                    onChange={(date) => handleDateChange(date, "endDate")}
                    title={t("date:endDate")}
                    minDate={startDate ?? undefined}
                  />
                </div>
              </div>
            ) : null}
          </div>
        }
      >
        <div className="px-2 md:px-3">{renderHistoryList(true, visibleHistory)}</div>
      </FullScreenSheet>
    </>
  );
};

export default HistorySummary;
