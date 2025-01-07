/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ChevronIcon } from "../../../assets/icons";
import { CloseRounded } from "@mui/icons-material";
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
import HistorySummarySkeleton from "../../../constants/skeleton/HistorySummary"; // Import the skeleton
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

const HistorySummary = () => {
  const history = useCylinderCover().cylinder?.data; // Get history data
  const [showAll, setShowAll] = useState(false); // Default value is false
  const [filter, setFilter] = useState("latest"); // Default is "latest"
  const [sortOrder, setSortOrder] = useState("desc"); // Start with descending order to show recent first
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [clickedItem, setClickedItem] = useState(null); // State to track clicked item

  const { t } = useTranslation();
  const navigate = useNavigate(); // Hook for navigation

  // Use effect to handle sorting & filtering logic when history changes
  const [filteredHistory, setFilteredHistory] = useState([]);

  useEffect(() => {
    if (history) {
      // Sort history by date (descending) to show the latest first by default
      const sortedHistory = sortHistoryByDate(history, sortOrder);

      // If no filter is applied, it will just show the most recent history
      const filteredData = filterHistory(
        sortedHistory,
        filter,
        startDate,
        endDate
      ); // Filter history based on filter criteria

      // Set the filtered history to the state
      setFilteredHistory(filteredData);
    }
  }, [history, sortOrder, filter, startDate, endDate]); // Re-run when any of these change

  // Handle filter change (like "This Month", "Last 7 Days", "Last 30 Days", etc.)
  const handleFilterChange = (selectedOption) => {
    setFilter(selectedOption.value);
  };

  // Handle start and end date changes for the custom filter
  const handleDateChange = (date, name) => {
    if (name === "startDate") {
      setStartDate(date);
    } else if (name === "endDate") {
      setEndDate(date);
    }
  };

  // Toggle sorting order between ascending and descending
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    setShowAll(false); // Set to false initially to avoid fullscreen on page reload
  }, []);

  // Navigate to the ViewInfo component when a cycle number is clicked
  const handleCycleClick = (item) => {
    setClickedItem(item);
    navigate("/view-info", {
      state: { data: item }, // Pass the data to ViewInfo component via state
    });
  };

  // Options for react-select filter dropdown
  const filterOptions = [
    { value: "latest", label: t("common:latest") },
    { value: "thisMonth", label: t("common:thisMonth") },
    { value: "last7", label: t("common:last7Days") },
    { value: "last30", label: t("common:last30Days") },
    { value: "custom", label: t("common:customDateRange") },
  ];

  // Custom input for react-datepicker with calendar icon
  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="relative cursor-pointer" onClick={onClick} ref={ref}>
      <input
        type="text"
        value={value}
        readOnly
        className="px-2 py-1 border w-full"
      />
      <FaCalendarAlt className="absolute right-2 top-2 text-gray-500" />
    </div>
  ));

  CustomDateInput.displayName = "CustomDateInput";

  return (
    <div
      className={`w-full p-2 overflow-hidden ${
        history?.length > 3 && showAll ? fullscreenClass : ""
      }`}
    >
      {showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="absolute top-4 right-2 p-2 text-gray rounded-full"
        >
          <CloseRounded />
        </button>
      )}

      <div
        className={`transition-transform duration-500 ease-in-out ${
          showAll ? "animate-slideUp" : "animate-slideDown"
        }`}
      >
        <div className="py-4 px-0">
          <div className="flex flex-row justify-between px-1 pb-2 border-b border-gray-300">
            <label className="px-1 py-2 font-semibold text-primaryText">
              {t("common:recentHistory")}
            </label>
            {!showAll && (
              <button
                className="px-2 py-2 flex text-white"
                onClick={() => setShowAll(true)}
              >
                <p>See all</p>
                <ChevronIcon />
              </button>
            )}
          </div>

          {showAll && (
            <div className="mb-4 mt-2">
              <div className="flex justify-between mb-2 mr-2">
                <Select
                  className="w-48 sm:w-64"
                  options={filterOptions}
                  value={filterOptions.find(
                    (option) => option.value === filter
                  )}
                  onChange={handleFilterChange}
                />
                <button className="py-2" onClick={toggleSortOrder}>
                  {sortOrder === "asc" ? (
                    <GoSortAsc size={24} color="#6e7271" />
                  ) : (
                    <GoSortDesc size={24} color="#6e7271" />
                  )}
                </button>
              </div>

              {filter === "custom" && (
                <div className="flex flex-wrap gap-2 mt-2 px-2">
                  <div className="flex-1 xs:w-36 sm:w-48 md:w-56 lg:w-full">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => handleDateChange(date, "startDate")}
                      className="px-4 py-2 border w-full"
                      dateFormat="MM/dd/yy"
                      customInput={<CustomDateInput />}
                      placeholderText="mm/dd/yy"
                    />
                  </div>
                  <div className="flex-1 sm:w-48 md:w-56 lg:w-full">
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => handleDateChange(date, "endDate")}
                      className="px-4 py-2 border w-full"
                      dateFormat="MM/dd/yy"
                      customInput={<CustomDateInput />}
                      placeholderText="mm/dd/yy"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {filteredHistory.length === 0 ? (
            <div className="p-4 h-72">
              {/* Displaying the skeleton while data is loading */}
              <HistorySummarySkeleton />
            </div>
          ) : (
            <ul
              className={`transition-transform duration-500 ease-in-out ${
                showAll ? "max-h-screen" : "max-h-[390px]"
              } ${showAll ? "overflow-y-auto" : ""}`}
            >
              {filteredHistory.map((item, index) => {
                const { backgroundColor, textColor } = getStatusColors(
                  item.status
                );
                const createdDate = new Date(item.createdAt);
                const updatedDate = item.updatedAt
                  ? new Date(item.updatedAt)
                  : null;

                return (
                  <li
                    key={index}
                    className="py-2 flex flex-col cursor-pointer hover:bg-gray-100"
                    onClick={() => handleCycleClick(item)}
                  >
                    <p className="p-2 font-normal flex items-center justify-between">
                      <span>{item.serialNumber}</span>
                      <span className="text-xs text-gray-500 ml-2 font-semibold">
                        {`${createdDate.getHours()}:${String(
                          createdDate.getMinutes()
                        ).padStart(2, "0")}`}
                      </span>
                    </p>
                    <div className="px-2 flex flex-row justify-between text-xs">
                      <p
                        className="rounded-full py-1 px-2 text-tiny"
                        style={{ backgroundColor, color: textColor }}
                      >
                        {t(`qrScanner:${item.status.toLowerCase()}`)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(createdDate, t)}
                      </p>
                      {updatedDate && (
                        <p className="text-xs text-gray-500">
                          {t("common:updated")} {formatDate(updatedDate, t)}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorySummary;
