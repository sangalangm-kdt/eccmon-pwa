import { useEffect, useState } from "react";
import { ChevronIcon } from "../../../assets/icons";
import { CloseRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { GoSortDesc, GoSortAsc } from "react-icons/go";
import { sortHistoryByDate, filterHistory, formatDate } from "../../../utils"; // Import utility functions

const useRecentHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const dummyData = [
      {
        eccId: "T-12345",
        status: "Storage",
        date: "2024-11-01T00:00:00Z",
      },
      {
        eccId: "T-12346",
        status: "Disassembly",
        date: "2024-11-02T00:00:00Z",
      },
      { eccId: "T-12347", status: "LMD", date: "2024-10-01T00:00:00Z" },
      {
        eccId: "T-12348",
        status: "Inspection",
        date: "2024-09-15T00:00:00Z",
      },
      {
        eccId: "T-12349",
        status: "Packing",
        date: "2024-11-10T00:00:00Z",
      },
      {
        eccId: "T-12350",
        status: "Shipping",
        date: "2024-11-12T00:00:00Z",
      },
      {
        eccId: "T-12351",
        status: "Storage",
        date: "2024-10-05T00:00:00Z",
      },
      {
        eccId: "T-12353",
        status: "Storage",
        date: "2024-11-16T00:00:00Z",
      },
      // Add more data as needed...
    ];
    setHistory(dummyData);
  }, []);

  return history;
};

const HistorySummary = () => {
  const history = useRecentHistory();
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState("thisMonth");
  const [sortOrder, setSortOrder] = useState("asc");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { t } = useTranslation("common");

  // Use utility functions to sort and filter history
  const sortedHistory = sortHistoryByDate(history, sortOrder);
  const filteredHistory = filterHistory(
    sortedHistory,
    filter,
    startDate,
    endDate,
  );

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

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

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <div
      className={`w-full p-2 overflow-hidden ${
        history.length > 5 && !showAll ? "" : "h-full"
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
        <div className="flex flex-row justify-between px-1 mb-2">
          <label className="px-1 py-2 font-semibold">
            {t("common:recentHistory")}
          </label>
          {history.length > 5 && !showAll && (
            <button
              className="px-2 py-2 flex text-white"
              onClick={() => setShowAll(true)}
            >
              <ChevronIcon />
            </button>
          )}
        </div>

        {showAll && (
          <div className="mb-4">
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
            showAll ? "max-h-[1000px]" : "max-h-[200px]"
          } ${showAll ? "overflow-y-auto" : ""}`}
        >
          {filteredHistory.map((item, index) => (
            <li className="py-2 flex flex-col border-t-0.5" key={index}>
              <p className="p-2 font-semibold">{item.eccId}</p>
              <div className="px-2 flex flex-row justify-between text-sm">
                <p>{item.status}</p>
                <p>{formatDate(item.date)}</p> {/* Use formatDate here */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HistorySummary;
