/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
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
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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
    setCurrentPage(1);
  };

  const handleDateChange = (date, name) => {
    name === "startDate" ? setStartDate(date) : setEndDate(date);
    setCurrentPage(1);
  };

  const handlePerPageChange = (selectedOption) => {
    setPerPage(selectedOption.value);
    setCurrentPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleCycleClick = (item) => {
    navigate("/view-info", { state: { data: item } });
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

  const totalPages = Math.ceil(filteredHistory.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const isDarkMode = document.documentElement.classList.contains("dark");
  return (
    <div
      className={`xs:min-[300px] flex w-full flex-col overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-700 xs:px-1 lg:w-full ${
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

              {/* Pagination Controls */}
              <div className="mb-2 mt-2 flex justify-between">
                <div className="flex flex-row items-center justify-center gap-1">
                  <label>Show</label>
                  <Select
                    className="w-20 text-center text-xs"
                    options={perPageOptions}
                    value={perPageOptions.find(
                      (option) => option.value === perPage,
                    )}
                    onChange={handlePerPageChange}
                    styles={customSelectStyle(isDarkMode)}
                  />
                  <label>entries</label>
                </div>

                <div className="flex items-center justify-center gap-1">
                  <button
                    className="rounded border p-2"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <IoArrowBackOutline />
                  </button>{" "}
                  <p className="flex items-center justify-center">
                    {t("common:page")} {currentPage} {t("common:of")}{" "}
                    {totalPages}
                  </p>
                  <button
                    className="rounded border p-2"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <IoArrowForwardOutline />
                  </button>
                </div>
              </div>
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
                {filteredHistory
                  .slice(startIndex, endIndex)
                  .map((item, index) => {
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
                        className={`h-70 flex w-full cursor-pointer flex-col border-b-0.5 border-gray-200 py-2 hover:bg-gray-100 dark:border-gray-500 dark:bg-transparent dark:hover:bg-gray-400`}
                        onClick={() => handleCycleClick(item)}
                      >
                        {/* Serial number and date_done */}
                        <p className="flex items-center justify-between p-2 font-normal">
                          <span>
                            {item?.serialNumber ?? "No serial number"}
                          </span>

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
