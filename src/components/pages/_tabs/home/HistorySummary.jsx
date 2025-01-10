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
import { FaRegCalendar } from "react-icons/fa";

const HistorySummary = () => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Hook for navigation
  const history = useCylinderCover().cylinder?.data; // Get history data
  const [showAll, setShowAll] = useState(false); // Default value is false
  const [filter, setFilter] = useState("latest"); // Default is "latest"
  const [sortOrder, setSortOrder] = useState("desc"); // Start with descending order to show recent first
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [clickedItem, setClickedItem] = useState(null); // State to track clicked item
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for skeleton loader
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Use effect to handle sorting & filtering logic when history changes
  useEffect(() => {
    if (history) {
      setLoading(false); // Data is loaded, stop showing skeleton
      const sortedHistory = sortHistoryByDate(history, sortOrder);
      const filteredData = filterHistory(
        sortedHistory,
        filter,
        startDate,
        endDate
      ); // Filter history based on filter criteria
      setFilteredHistory(filteredData);
    }
  }, [history, sortOrder, filter, startDate, endDate]); // Re-run when any of these change

  useEffect(() => {
    setShowAll(false); // Set to false initially to avoid fullscreen on page reload
  }, []);

  const handleFilterChange = (selectedOption) => {
    setFilter(selectedOption.value);
    setCurrentPage(1);
  };

  const handleDateChange = (date, name) => {
    if (name === "startDate") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setCurrentPage(1);
  };

  const handlePerPageChange = (selectedOption) => {
    setPerPage(selectedOption.value);
    setCurrentPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

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

  // Options for selecting the number of items to show
  const perPageOptions = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
  ];

  // Custom input for react-datepicker with calendar icon
  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="relative cursor-pointer w-full" onClick={onClick} ref={ref}>
      <input
        type="text"
        value={value}
        readOnly
        className="border p-2 w-full text-sm"
        placeholder="mm/dd/yy"
      />
      <FaRegCalendar className="absolute right-2 top-2 text-gray-500" />
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

  return (
    <div
      className={`w-full p-2 overflow-hidden ${showAll ? fullscreenClass : ""}`}
    >
      {showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="fixed top-2 right-2 p-2 text-gray rounded-full z-60"
        >
          <CloseRounded />
        </button>
      )}

      <div
        className={`transition-transform duration-500 ease-in-out bg-white${
          showAll ? "animate-slideUp" : "animate-slideDown"
        }`}
      >
        <div className="py-4 px-0">
          <div
            className={`flex flex-row justify-between px-1 pb-2 border-b border-gray-300 ${
              showAll ? "fixed top-0 left-0 w-full bg-white  z-10" : ""
            }`}
          >
            <label className="px-1 py-2 font-semibold text-primaryText">
              {t("common:recentHistory")}
            </label>
            {!showAll && (
              <button
                className="px-2 py-2 flex text-primaryText"
                onClick={() => setShowAll(true)}
              >
                <p className="flex items-center justify-center pt-1 text-xs">
                  See all
                </p>
                <ChevronIcon />
              </button>
            )}
          </div>

          {showAll && (
            <div className=" mb-4 mt-2 text-sm pt-8 ">
              <div className="fixed flex justify-between mb-2 mr-2">
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
                <div className="fixed flex flex-wrap gap-2 mt-2 px-2">
                  <div className="relative flex-1 xs:w-36 sm:w-48 md:w-56 lg:w-full">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => handleDateChange(date, "startDate")}
                      className="px-4 py-2 border w-full custom-datepicker fixed"
                      dateFormat="MM/dd/yy"
                      customInput={<CustomDateInput />}
                      popperClassName="custom-datepicker-popper"
                    />
                  </div>
                  <div className="flex-1 sm:w-48 md:w-56 lg:w-full">
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => handleDateChange(date, "endDate")}
                      className="px-4 py-2 border w-full custom-datepicker fixed"
                      dateFormat="MM/dd/yy"
                      customInput={<CustomDateInput />}
                      popperClassName="custom-datepicker-popper"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {showAll && (
            <div className="flex justify-between mb-4 mt-32">
              <Select
                className="w-48 sm:w-64"
                options={perPageOptions}
                value={perPageOptions.find(
                  (option) => option.value === perPage
                )}
                onChange={handlePerPageChange}
              />
              <p>
                {t("common:page")} {currentPage} {t("common:of")} {totalPages}
              </p>
              <div>
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                  {t("common:prev")}
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  {t("common:next")}
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="p-4 h-72">
              <HistorySummarySkeleton />
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="p-4 text-center text-gray-500 ">
              <p>No recent history</p>
            </div>
          ) : (
            <div>
              <ul
                className={`transition-transform duration-500 ease-in-out h-screen border-box ${
                  showAll ? `max-h-fit overflow-y-auto` : "max-h-[380px]"
                }`}
              >
                {filteredHistory
                  .slice(startIndex, endIndex)
                  .map((item, index) => {
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
                        className="py-2 flex flex-col cursor-pointer hover:bg-gray-100 w-full h-70"
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorySummary;
