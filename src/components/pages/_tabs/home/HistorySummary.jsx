import { useState } from "react";
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

const HistorySummary = () => {
  const history = useCylinderCover().cylinder?.data; // Get history data
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState("thisMonth");
  const [sortOrder, setSortOrder] = useState("desc"); // Start with descending order to show recent first
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { t } = useTranslation("common");

  // Use utility functions to sort and filter history
  const sortedHistory = sortHistoryByDate(history, sortOrder); // Ensure history is sorted
  const filteredHistory = filterHistory(
    sortedHistory,
    filter,
    startDate,
    endDate,
  );

  // Handle filter change (like "This Month", "Last 7 Days", "Last 30 Days", etc.)
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Handle start and end date changes for the custom filter
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const selectedDate = new Date(value);
    selectedDate.setHours(0, 0, 0, 0);

    if (name === "startDate") {
      setStartDate(selectedDate);
    } else if (name === "endDate") {
      setEndDate(selectedDate);
    }
  };

  // Toggle sorting order between ascending and descending
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <div
      className={`w-full p-2 overflow-hidden ${
        history?.length > 5 && !showAll ? "" : fullscreenClass // Apply fullscreen only on smaller screens
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

      <div className="py-4 px-0">
        <div className="flex flex-row justify-between px-1 pb-2 border-b-0.5">
          <label className="px-1 py-2 font-semibold text-primaryText">
            {t("common:recentHistory")}
          </label>
          {history?.length > 5 && !showAll && (
            <button
              className="px-2 py-2 flex text-white"
              onClick={() => setShowAll(true)}
            >
              <ChevronIcon />
            </button>
          )}
        </div>

        {showAll && (
          <div className="mb-4 mt-2">
            <div className="flex justify-between mb-2 mr-2">
              <select
                className="px-2 py-1 border ml-2"
                value={filter}
                onChange={handleFilterChange}
              >
                <option value="thisMonth">This Month</option>
                <option value="last7">Last 7 Days</option>
                <option value="last30">Last 30 Days</option>
                <option value="custom">Custom Date Range</option>
              </select>
              <button className="py-2" onClick={toggleSortOrder}>
                {sortOrder === "asc" ? (
                  <GoSortAsc size={24} />
                ) : (
                  <GoSortDesc size={24} />
                )}
              </button>
            </div>

            {filter === "custom" && (
              <div className="flex mt-2 px-2">
                <input
                  type="date"
                  name="startDate"
                  value={startDate ? startDate.toISOString().split("T")[0] : ""}
                  onChange={handleDateChange}
                  className="px-2 py-1 border mr-2"
                />
                <input
                  type="date"
                  name="endDate"
                  value={endDate ? endDate.toISOString().split("T")[0] : ""}
                  onChange={handleDateChange}
                  className="px-2 py-1 border"
                />
              </div>
            )}
          </div>
        )}

        <ul
          className={`transition-transform duration-500 ease-in-out ${
            showAll ? "max-h-[1500px]" : "max-h-[350px]"
          } ${showAll ? "overflow-y-auto" : ""}`}
        >
          {filteredHistory?.map((item, index) => (
            <li className="py-2 flex flex-col" key={index}>
              <p className="p-2 font-normal">{item.serialNumber}</p>
              <div className="px-2 flex flex-row justify-between text-xs font-light ">
                <p>{item.status}</p>
                <p>{formatDate(item.createdAt)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HistorySummary;
