/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { ChevronIcon } from "../../../assets/icons";
import { CloseRounded, IosShare } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { GoSortDesc, GoSortAsc } from "react-icons/go";
import {
  sortHistoryByDate,
  filterHistory,
  formatDate,
} from "../../../utils/utils";
import { useCylinderCover } from "../../../../hooks/cylinderCover";
import { fullscreenClass } from "../../../styles/home";
import { getStatusColors } from "../../../utils/statusColors";
import HistorySummarySkeleton from "../../../constants/skeleton/HistorySummary";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendar } from "react-icons/fa";
import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import { useAuthentication } from "../../../../hooks/auth";
import { useCylinderUpdate } from "../../../../hooks/cylinderUpdates";
import { customSelectStyle } from "../../../utils/selectUtils";

const HistorySummary = () => {
  const { userId } = useAuthentication();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cylinders = useCylinderCover().cylinder?.data ?? [];
  const cylinderUpdates = useCylinderUpdate().cylinder?.data ?? [];

  function filterDataByCycle(data) {
    const grouped = {};

    data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Sort by createdAt

    data.forEach((item) => {
      const key = `${item.serialNumber}-${item.cycle}`;
      grouped[key] = item; // Keep the latest occurrence for each cycle
    });

    const filteredData = Object.values(grouped);

    const groupedBySerial = filteredData.reduce((acc, item) => {
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

    return groupedBySerial;
  }

  const filteredData = filterDataByCycle(cylinderUpdates);
  console.log(filteredData);

  const filteredCylinderUpdates = cylinderUpdates
    ?.filter((cyl) => cyl.userId === userId)
    .filter(
      (cyl, index, self) =>
        index ===
        self.findIndex((item) => item.serialNumber === cyl.serialNumber),
    );

  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState("latest");
  const [sortOrder, setSortOrder] = useState("desc");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [perPage, setPerPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const [isFetching, setIsFetching] = useState(false); // for infinite scroll

  const listInnerRef = useRef(null);

  // Effect for handling sorting and filtering updates
  useEffect(() => {
    if (cylinders.length && cylinderUpdates.length) {
      setLoading(false);

      // Filter the cylinders that have matching updates for the user
      const userHistory = cylinders.filter((item) =>
        filteredCylinderUpdates.some(
          (update) => update.serialNumber === item.serialNumber,
        ),
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
    }
  }, [
    cylinders,
    cylinderUpdates,
    filteredCylinderUpdates,
    sortOrder,
    filter,
    startDate,
    endDate,
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

  const handlePerPageChange = (selectedOption) => {
    setPerPage(selectedOption.value);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleCycleClick = (item) => {
    const totalOperationHours = filteredData
      ?.filter((data) => item.serialNumber === data.serialNumber)
      .map((entry) => {
        const totalHours = entry.data.reduce((sum, item) => {
          return sum + (parseInt(item.otherDetails?.operationHours) || 0);
        }, 0);

        return totalHours;
      })[0];
    console.log(totalOperationHours);
    navigate("/view-info", {
      state: { data: item, totalOperationHours: totalOperationHours },
    });
  };

  const filterOptions = [
    { value: "latest", label: t("common:latest") },
    { value: "thisMonth", label: t("common:thisMonth") },
    { value: "last7", label: t("common:last7Days") },
    { value: "last30", label: t("common:last30Days") },
    { value: "custom", label: t("common:customDateRange") },
  ];

  const perPageOptions = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
  ];

  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="relative w-full cursor-pointer" onClick={onClick} ref={ref}>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full border p-2 text-sm dark:bg-gray-700"
        placeholder="mm/dd/yy"
      />
      <FaRegCalendar className="absolute right-2 top-3 text-gray-500 dark:text-gray-300" />
    </div>
  ));

  CustomDateInput.displayName = "CustomDateInput";

  // Infinite scroll logic
  const loadMore = () => {
    if (isFetching || filteredHistory.length === 0) return;
    setIsFetching(true);

    // Simulate an API call and append more items (in this case, just slice)
    setTimeout(() => {
      setFilteredHistory((prev) => [
        ...prev,
        ...filteredHistory.slice(
          filteredHistory.length,
          filteredHistory.length + 10,
        ),
      ]);
      setIsFetching(false);
    }, 1000);
  };

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "100px" },
    );
    if (listInnerRef.current) observer.observe(listInnerRef.current);
    return () => {
      if (listInnerRef.current) observer.unobserve(listInnerRef.current);
    };
  }, [filteredHistory]);

  const isDarkMode = document.documentElement.classList.contains("dark");
  return (
    <div
      className={`xs:min-[300px] shadow- flex w-full flex-col overflow-hidden rounded-lg bg-white dark:bg-gray-700 xs:px-1 lg:w-full ${
        showAll ? fullscreenClass : ""
      }`}
    >
      {showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="text-gray fixed right-2 top-6 z-60 rounded-full p-2 dark:text-gray-50"
        >
          <CloseRounded />
        </button>
      )}

      <div
        className={`bg-white transition-transform duration-500 ease-in-out dark:bg-gray-700 ${
          showAll ? "animate-slideUp" : "animate-slideDown"
        }`}
      >
        <div
          className={`flex flex-col px-0 py-4 ${showAll ? "dark:bg-gray-800" : ""}`}
        >
          <div
            className={`flex justify-between border-b border-gray-300 ${
              showAll
                ? "fixed left-0 top-0 z-10 w-full bg-white shadow dark:bg-gray-700"
                : "px-1 py-3"
            }`}
          >
            <label
              className={`${
                showAll
                  ? "px-1 py-8 font-semibold text-gray-600"
                  : "px-1 pb-2 font-semibold text-gray-600"
              } dark:text-gray-50`}
            >
              {t("common:recentHistory")}
            </label>
            {!showAll && (
              <div className="flex flex-row items-center justify-center pt-1 text-xs">
                <button
                  className="flex pb-2 text-primaryText dark:text-gray-50"
                  onClick={() => setShowAll(true)}
                >
                  <label className="flex-row items-center justify-center">
                    See all
                  </label>
                  <div className="flex-row items-center justify-center">
                    <IoChevronForwardOutline />
                  </div>
                </button>
              </div>
            )}
          </div>

          {showAll && (
            <div className="mb-4 mt-20 flex w-full flex-col bg-white text-sm dark:bg-gray-800">
              {/* Filter and Sort Section */}
              <div className="flex justify-between">
                <Select
                  className="w-48 sm:w-64"
                  options={filterOptions}
                  value={filterOptions.find(
                    (option) => option.value === filter,
                  )}
                  onChange={handleFilterChange}
                  styles={customSelectStyle(isDarkMode)}
                />
                <button className="py-2" onClick={toggleSortOrder}>
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

              {/* Custom Date Range Section */}
              {filter === "custom" && (
                <div className="item-center mb-2 flex justify-between gap-1 p-2">
                  <div className="flex-1 lg:w-full">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => handleDateChange(date, "startDate")}
                      className="custom-datepicker w-full border px-4 py-2"
                      dateFormat="MM/dd/yy"
                      customInput={<CustomDateInput />}
                      popperClassName="custom-datepicker-popper"
                    />
                  </div>
                  <div className="flex-1 xs:w-32 sm:w-48 md:w-56 lg:w-full">
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => handleDateChange(date, "endDate")}
                      className="custom-datepicker w-full border px-4 py-2"
                      dateFormat="MM/dd/yy"
                      customInput={<CustomDateInput />}
                      popperClassName="custom-datepicker-popper"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div className="h-72 p-4">
              <HistorySummarySkeleton />
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No recent history</p>
            </div>
          ) : (
            <div>
              <ul
                className={`border-box h-screen transition-transform duration-500 ease-in-out ${
                  showAll ? "max-h-fit overflow-y-auto" : "max-h-[380px]"
                }`}
              >
                {filteredHistory.slice(0, perPage).map((item, index) => {
                  // Get the status colors dynamically
                  const { bgColor, textColor } = getStatusColors(item.status);

                  // Format created and updated dates
                  const createdDate = new Date(item?.updates?.dateDone);
                  const updatedDate = item.updatedAt
                    ? new Date(item.updatedAt)
                    : null;

                  return (
                    <li
                      key={index}
                      className={`h-70 flex w-full cursor-pointer flex-col border-b-0.5 border-gray-200 py-2 hover:bg-gray-100 dark:border-gray-500 dark:bg-transparent dark:hover:bg-gray-600`}
                      onClick={() => handleCycleClick(item)}
                    >
                      {/* Serial number and date_done */}
                      <p className="flex items-center justify-between p-2 font-normal">
                        <span>{item?.serialNumber ?? "No serial number"}</span>

                        <span className="ml-2 text-xs font-semibold text-gray-500 dark:text-gray-300">
                          {`${createdDate.getHours()}:${String(createdDate.getMinutes()).padStart(2, "0")}`}
                        </span>
                      </p>

                      {/* Status label with dynamic colors */}
                      <div className="flex flex-row justify-between px-2 text-xs">
                        <p
                          className={`rounded-full px-2 py-1 text-tiny ${bgColor} ${textColor}`}
                        >
                          {t(`qrScanner:${item.status.toLowerCase()}`)}
                        </p>

                        {/* date_done */}
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                          {isNaN(createdDate.getTime())
                            ? "Invalid Date"
                            : formatDate(createdDate, t)}
                        </p>
                        {updatedDate && (
                          <p className="text-xs text-gray-500 dark:text-gray-300">
                            {t("common:updated")}{" "}
                            {isNaN(updatedDate.getTime())
                              ? "Invalid Date"
                              : formatDate(updatedDate, t)}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorySummary;
