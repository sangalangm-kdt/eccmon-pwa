import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CloseRounded } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import { useTranslation } from "react-i18next";
import { GoSortDesc, GoSortAsc } from "react-icons/go";
import { formatDate, sortHistoryByDate } from "../../../utils/utils";
import { useCylinderCover } from "../../../../hooks/cylinderCover";
import { fullscreenClass } from "../../../styles/home";
import { getStatusColors } from "../../../utils/statusColors";
import HistorySummarySkeleton from "../../../constants/skeleton/HistorySummary";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendar } from "react-icons/fa";
import { IoChevronForwardOutline } from "react-icons/io5";
import { useAuthentication } from "../../../../hooks/auth";
import { useCylinderUpdate } from "../../../../hooks/cylinderUpdates";
import { customSelectStyle } from "../../../utils/selectUtils";

const DEFAULT_PER_PAGE = 10;
const LOAD_MORE_STEP = 10;
const COMPACT_MAX_HEIGHT = 220; // ✅ like the icon tabs area height

function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return;

    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
    };
  }, [locked]);
}

/**
 * Optional props:
 * - openSignal: number | string (change value to trigger opening fullscreen)
 * - presetStatus: "storage" | "process" | "mounted" | "dismounted" | "disposal" | "all"
 */
const HistorySummary = ({ openSignal, presetStatus }) => {
  const { userId } = useAuthentication();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const cylinders = useCylinderCover().cylinder?.data ?? [];
  const cylinderUpdates = useCylinderUpdate().cylinder?.data ?? [];

  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState("latest"); // date filter
  const [sortOrder, setSortOrder] = useState("desc");

  // date range for "custom"
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // fullscreen search
  const [historySearch, setHistorySearch] = useState("");

  // optional status filter (chip style in fullscreen)
  const [statusFilter, setStatusFilter] = useState("all");

  // infinite scroll visible count (fullscreen)
  const [visibleCount, setVisibleCount] = useState(DEFAULT_PER_PAGE);
  const sentinelRef = useRef(null);

  const isDarkMode =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  useLockBodyScroll(showAll);

  // If you want InventorySummary to open this fullscreen with a preset:
  useEffect(() => {
    if (openSignal == null) return;
    setShowAll(true);
    if (presetStatus) setStatusFilter(presetStatus);
  }, [openSignal, presetStatus]);

  // ---------- Group updates by (serialNumber, cycle) once ----------
  const cycleGroupedData = useMemo(() => {
    const data = [...cylinderUpdates];
    data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const grouped = {};
    for (const item of data) {
      const key = `${item.serialNumber}-${item.cycle}`;
      grouped[key] = item; // keep latest by overwrite
    }

    const filtered = Object.values(grouped);

    return filtered.reduce((acc, item) => {
      let group = acc.find((g) => g.serialNumber === item.serialNumber);
      if (!group) {
        group = { serialNumber: item.serialNumber, data: [] };
        acc.push(group);
      }
      group.data.push(item);
      return acc;
    }, []);
  }, [cylinderUpdates]);

  // ---------- Unique serials scanned/updated by this user ----------
  const userUniqueSerials = useMemo(() => {
    const set = new Set();
    for (const u of cylinderUpdates) {
      if (u?.userId === userId && u?.serialNumber) set.add(u.serialNumber);
    }
    return set;
  }, [cylinderUpdates, userId]);

  // ---------- User history cylinders ----------
  const userHistory = useMemo(() => {
    if (!cylinders.length || !userUniqueSerials.size) return [];
    return cylinders.filter((c) => userUniqueSerials.has(c?.serialNumber));
  }, [cylinders, userUniqueSerials]);

  const normalize = (v) => (v ?? "").toString().trim().toLowerCase();

  // ---------- Sorted + date-filtered + status-filtered + search-filtered history ----------
  const filteredHistory = useMemo(() => {
    if (!userHistory.length) return [];

    // 1) Sort first
    const sorted = sortHistoryByDate(userHistory, sortOrder);

    // 2) Date filtering
    const getItemDate = (item) => {
      const d1 = item?.updates?.dateDone
        ? new Date(item.updates.dateDone)
        : null;
      if (d1 && !isNaN(d1.getTime())) return d1;

      const d2 = item?.updatedAt ? new Date(item.updatedAt) : null;
      if (d2 && !isNaN(d2.getTime())) return d2;

      const d3 = item?.createdAt ? new Date(item.createdAt) : null;
      if (d3 && !isNaN(d3.getTime())) return d3;

      return null;
    };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const withinRange = (date, start, end) => {
      if (!date) return false;
      if (start && date < start) return false;
      if (end && date > end) return false;
      return true;
    };

    const dateFiltered = sorted.filter((item) => {
      const d = getItemDate(item);

      if (filter === "latest") return true;

      if (filter === "thisMonth") return withinRange(d, startOfMonth, now);

      if (filter === "last7") {
        const last7 = new Date(now);
        last7.setDate(now.getDate() - 7);
        return withinRange(d, last7, now);
      }

      if (filter === "last30") {
        const last30 = new Date(now);
        last30.setDate(now.getDate() - 30);
        return withinRange(d, last30, now);
      }

      if (filter === "custom") {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        return withinRange(d, start, end);
      }

      return true;
    });

    // 3) Status filter (fullscreen)
    const statusFiltered =
      statusFilter === "all"
        ? dateFiltered
        : dateFiltered.filter(
            (item) => normalize(item?.status) === normalize(statusFilter),
          );

    // 4) Search filtering
    const q = normalize(historySearch);
    if (!q) return statusFiltered;

    return statusFiltered.filter((item) => {
      const serial = normalize(item?.serialNumber);
      const status = normalize(item?.status);
      return serial.includes(q) || status.includes(q);
    });
  }, [
    userHistory,
    sortOrder,
    filter,
    startDate,
    endDate,
    historySearch,
    statusFilter,
  ]);

  const loading = !(cylinders.length && cylinderUpdates.length);

  // Reset visible count when controls change
  useEffect(() => {
    setVisibleCount(DEFAULT_PER_PAGE);
  }, [
    showAll,
    filter,
    sortOrder,
    startDate,
    endDate,
    historySearch,
    statusFilter,
  ]);

  // Clear search when exiting fullscreen
  useEffect(() => {
    if (!showAll) {
      setHistorySearch("");
      setStatusFilter("all");
      setFilter("latest");
      setStartDate(null);
      setEndDate(null);
      setVisibleCount(DEFAULT_PER_PAGE);
    }
  }, [showAll]);

  const handleFilterChange = (selectedOption) =>
    setFilter(selectedOption.value);

  const handleDateChange = (date, name) => {
    if (name === "startDate") setStartDate(date);
    else setEndDate(date);
  };

  const toggleSortOrder = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const handleCycleClick = useCallback(
    (item) => {
      const totalOperationHours =
        cycleGroupedData
          ?.filter((d) => item.serialNumber === d.serialNumber)
          .map((entry) =>
            entry.data.reduce(
              (sum, it) =>
                sum + (parseInt(it.otherDetails?.operationHours) || 0),
              0,
            ),
          )[0] ?? 0;

      navigate("/view-info", { state: { data: item, totalOperationHours } });
    },
    [cycleGroupedData, navigate],
  );

  const filterOptions = useMemo(
    () => [
      { value: "latest", label: t("common:latest") },
      { value: "thisMonth", label: t("common:thisMonth") },
      { value: "last7", label: t("common:last7Days") },
      { value: "last30", label: t("common:last30Days") },
      { value: "custom", label: t("common:customDateRange") },
    ],
    [t],
  );

  const statusChips = useMemo(
    () => [
      { key: "all", label: t("common:all") || "All" },
      { key: "storage", label: t("qrScanner:storage") },
      { key: "process", label: t("qrScanner:process") },
      { key: "mounted", label: t("qrScanner:mounted") },
      { key: "dismounted", label: t("qrScanner:dismounted") },
      { key: "disposal", label: t("qrScanner:disposal") },
    ],
    [t],
  );

  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="relative w-full cursor-pointer" onClick={onClick} ref={ref}>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full rounded border bg-transparent p-2 text-sm dark:border-gray-600 dark:bg-gray-700"
        placeholder="mm/dd/yy"
      />
      <FaRegCalendar className="absolute right-2 top-3 text-gray-500 dark:text-gray-300" />
    </div>
  ));
  CustomDateInput.displayName = "CustomDateInput";

  // Infinite scroll sentinel (only when showAll)
  useEffect(() => {
    if (!showAll) return;
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisibleCount((prev) =>
          Math.min(prev + LOAD_MORE_STEP, filteredHistory.length),
        );
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [showAll, filteredHistory.length]);

  const visibleItems = useMemo(() => {
    const count = showAll
      ? visibleCount
      : Math.min(filteredHistory.length, DEFAULT_PER_PAGE);
    return filteredHistory.slice(0, count);
  }, [filteredHistory, showAll, visibleCount]);

  return (
    <div
      className={`flex w-full flex-col overflow-hidden rounded-lg bg-white shadow dark:bg-gray-700 ${
        showAll ? fullscreenClass : ""
      }`}
    >
      {/* Top header row */}
      <div
        className={`flex items-center justify-between border-b border-gray-200 dark:border-gray-600 ${
          showAll
            ? "sticky top-0 z-[80] bg-white px-3 py-4 shadow-sm dark:bg-gray-700"
            : "px-3 py-2" // ✅ smaller
        }`}
      >
        <label
          className={`font-semibold text-gray-700 dark:text-gray-50 ${showAll ? "" : "text-sm"}`}
        >
          {t("common:recentHistory")}
        </label>

        {!showAll ? (
          <button
            className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-50"
            onClick={() => setShowAll(true)}
            type="button"
          >
            <span>See all</span>
            <IoChevronForwardOutline />
          </button>
        ) : (
          <button
            onClick={() => setShowAll(false)}
            className="rounded-full p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-600"
            type="button"
            aria-label="Close"
          >
            <CloseRounded />
          </button>
        )}
      </div>

      {/* Fullscreen controls */}
      {showAll && (
        <div className="z-[70] bg-white px-3 pb-3 pt-3 dark:bg-gray-800">
          {/* Filter + Sort */}
          <div className="flex items-center justify-between gap-2">
            <Select
              className="z-[9999] w-48 sm:w-64"
              options={filterOptions}
              value={filterOptions.find((opt) => opt.value === filter)}
              onChange={handleFilterChange}
              styles={customSelectStyle(isDarkMode)}
            />

            <button
              className="rounded p-2"
              onClick={toggleSortOrder}
              type="button"
            >
              {sortOrder === "asc" ? (
                <GoSortAsc
                  size={22}
                  className="text-gray-700 dark:text-gray-100"
                />
              ) : (
                <GoSortDesc
                  size={22}
                  className="text-gray-700 dark:text-gray-100"
                />
              )}
            </button>
          </div>

          {/* Custom Date Range */}
          {filter === "custom" && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => handleDateChange(date, "startDate")}
                  dateFormat="MM/dd/yy"
                  customInput={<CustomDateInput />}
                  popperClassName="custom-datepicker-popper"
                />
              </div>
              <div className="flex-1">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => handleDateChange(date, "endDate")}
                  dateFormat="MM/dd/yy"
                  customInput={<CustomDateInput />}
                  popperClassName="custom-datepicker-popper"
                />
              </div>
            </div>
          )}

          {/* Status chips */}
          <div className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto pb-1">
            {statusChips.map((chip) => {
              const active = statusFilter === chip.key;
              return (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => setStatusFilter(chip.key)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs ${
                    active
                      ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-200"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="mt-3">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded border bg-transparent p-2 pl-10 pr-10 text-sm text-gray-700 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                type="text"
                placeholder={t("common:search") || "Search"}
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
              />
              {historySearch.trim().length > 0 && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                  onClick={() => setHistorySearch("")}
                  aria-label={t("common:clear") || "Clear"}
                >
                  <ClearIcon fontSize="small" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="h-72 p-4">
          <HistorySummarySkeleton />
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="p-6 text-center text-gray-500 dark:text-gray-300">
          <p>{t("common:noRecentHistory") || "No recent history"}</p>
        </div>
      ) : (
        <ul
          className={`${
            showAll
              ? "max-h-[calc(100vh-240px)] overflow-y-auto"
              : "max-h-[350px] overflow-y-auto"
          }`}
        >
          {visibleItems.map((item, index) => {
            const { bgColor, textColor } = getStatusColors(item.status);

            const displayDate = item?.updates?.dateDone
              ? new Date(item.updates.dateDone)
              : item?.updatedAt
                ? new Date(item.updatedAt)
                : item?.createdAt
                  ? new Date(item.createdAt)
                  : null;

            const isValidDisplayDate =
              displayDate instanceof Date && !isNaN(displayDate.getTime());

            return (
              <li
                key={`${item.serialNumber}-${index}`}
                className="flex w-full cursor-pointer flex-col border-b border-gray-200 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
                onClick={() => handleCycleClick(item)}
              >
                <div className="flex items-center justify-between px-3">
                  <p className="text-base font-medium text-gray-800 dark:text-gray-50">
                    {item?.serialNumber ?? "—"}
                  </p>

                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-300">
                    {isValidDisplayDate
                      ? `${displayDate.getHours()}:${String(displayDate.getMinutes()).padStart(2, "0")}`
                      : ""}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 px-3 pt-2">
                  <p
                    className={`rounded-full px-2 py-1 text-tiny ${bgColor} ${textColor}`}
                  >
                    {t(`qrScanner:${(item.status ?? "").toLowerCase()}`)}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    {isValidDisplayDate ? formatDate(displayDate, t) : ""}
                  </p>
                </div>
              </li>
            );
          })}

          {showAll && <div ref={sentinelRef} className="h-10" />}
        </ul>
      )}
    </div>
  );
};

export default HistorySummary;
