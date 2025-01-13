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
import HistorySummarySkeleton from "../../../constants/skeleton/HistorySummary"; // Import the skeleton
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendar } from "react-icons/fa";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";

const HistorySummary = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const history = useCylinderCover().cylinder?.data;
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
    if (history) {
      setLoading(false);
      const sortedHistory = sortHistoryByDate(history, sortOrder);
      const filteredData = filterHistory(
        sortedHistory,
        filter,
        startDate,
        endDate
      );
      setFilteredHistory(filteredData);
    }
  }, [history, sortOrder, filter, startDate, endDate]);

  // Effect to reset fullscreen view on page load
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
      className={`flex flex-col w-full p-2 overflow-hidden ${
        showAll ? fullscreenClass : ""
      }`}
    >
      {showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="fixed top-6 right-2 p-2 text-gray rounded-full z-60"
        >
          <CloseRounded />
        </button>
      )}

      <div
        className={`transition-transform duration-500 ease-in-out bg-white ${
          showAll ? "animate-slideUp" : "animate-slideDown"
        }`}
      >
        <div className="flex flex-col py-4 px-0">
          <div
            className={`flex justify-between px-1  border-b border-gray-300 ${
              showAll ? "fixed top-0 left-0 w-full bg-white z-10 shadow " : ""
            }`}
          >
            <label
              className={`${
                showAll
                  ? "px-1 py-8 font-semibold text-primaryText"
                  : "px-1 py-2 font-semibold text-primaryText"
              }`}
            >
              {t("common:recentHistory")}
            </label>
            {!showAll && (
              <div className="flex flex-row items-center justify-center pt-1 text-xs">
                <button
                  className="flex-row text-primaryText"
                  onClick={() => setShowAll(true)}
                >
                  <ChevronIcon />
                </button>
              </div>
            )}
          </div>

          {showAll && (
            <div className="mb-4 text-sm pt-12 bg-white  w-full  -ml-0">
              {/* Filter and Sort Section */}
              <div className="flex justify-between mb-2 mr-3 mt-7 ">
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

              {/* Custom Date Range Section */}
              {filter === "custom" && (
                <div className="flex justify-between mb-2  ">
                  <div className="flex-1  lg:w-full">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => handleDateChange(date, "startDate")}
                      className="px-4 py-2 border w-full custom-datepicker "
                      dateFormat="MM/dd/yy"
                      customInput={<CustomDateInput />}
                      popperClassName="custom-datepicker-popper"
                    />
                  </div>
                  <div className="flex-1 xs:w-32 sm:w-48 md:w-56 lg:w-full">
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => handleDateChange(date, "endDate")}
                      className="px-4 py-2 border w-full custom-datepicker "
                      dateFormat="MM/dd/yy"
                      customInput={<CustomDateInput />}
                      popperClassName="custom-datepicker-popper"
                    />
                  </div>
                </div>
              )}

              {/* Pagination Controls */}
              <div className="flex justify-between mb-2  mt-2">
                <div className="flex flex-row items-center justify-center gap-1">
                  <label>Show</label>
                  <Select
                    className="w-20  text-xs text-center"
                    options={perPageOptions}
                    value={perPageOptions.find(
                      (option) => option.value === perPage
                    )}
                    onChange={handlePerPageChange}
                  />
                  <label>entries</label>
                </div>

                <div className="flex items-center justify-center gap-1">
                  <button
                    className="border p-2 rounded "
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <IoArrowBackOutline />
                  </button>{" "}
                  <p className="flex items-center justify-center ">
                    {t("common:page")} {currentPage} {t("common:of")}{" "}
                    {totalPages}
                  </p>
                  <button
                    className="border p-2 rounded "
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
            <div className="p-4 h-72">
              <HistorySummarySkeleton />
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No recent history</p>
            </div>
          ) : (
            <div>
              <ul
                className={`transition-transform duration-500 ease-in-out h-screen border-box ${
                  showAll ? "max-h-fit overflow-y-auto " : "max-h-[380px]"
                }`}
              >
                {filteredHistory
                  .slice(startIndex, endIndex)
                  .map((item, index) => {
                    // Get the status colors dynamically
                    const { bgColor, textColor } = getStatusColors(item.status);

                    // Format created and updated dates
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
                        {/* Serial number and created date */}
                        <p className="p-2 font-normal flex items-center justify-between">
                          <span>{item.serialNumber}</span>
                          <span className="text-xs text-gray-500 ml-2 font-semibold">
                            {`${createdDate.getHours()}:${String(
                              createdDate.getMinutes()
                            ).padStart(2, "0")}`}
                          </span>
                        </p>

                        {/* Status label with dynamic colors */}
                        <div className="px-2 flex flex-row justify-between text-xs">
                          <p
                            className={`rounded-full py-1 px-2 text-tiny ${bgColor} ${textColor}`}
                          >
                            {t(`qrScanner:${item.status.toLowerCase()}`)}
                          </p>

                          {/* Created and updated dates */}
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
