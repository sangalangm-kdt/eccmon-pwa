/* eslint-disable no-undef */
import { useState } from "react";
import { ChevronIcon } from "../../../assets/icons";
import { fullscreenClass } from "../../../styles/home";
import { CloseRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { GoSortDesc, GoSortAsc } from "react-icons/go";

// Custom hook to get the recent history (dummy data for now)
const useRecentHistory = () => {
  // const location = useLocation();
  // const [history, setHistory] = useState([]);
  // const createDate = (year, month, day) => {
  //   return new Date(Date.UTC(year, month - 1, day));
  // };
  // useEffect(() => {
  //   const dummyData = [
  //     { eccId: "T-12345", status: "Storage", date: createDate(2024, 11, 1) },
  //     {
  //       eccId: "T-12346",
  //       status: "Disassembly",
  //       date: createDate(2024, 11, 2),
  //     },
  //     { eccId: "T-12347", status: "LMD", date: createDate(2024, 10, 1) },
  //     { eccId: "T-12348", status: "Inspection", date: createDate(2024, 9, 15) },
  //     { eccId: "T-12349", status: "Packing", date: createDate(2024, 11, 10) },
  //     { eccId: "T-12350", status: "Shipping", date: createDate(2024, 11, 12) },
  //     { eccId: "T-12351", status: "Storage", date: createDate(2024, 10, 5) },
  //     { eccId: "T-12353", status: "Storage", date: createDate(2024, 11, 16) },
  //     { eccId: "T-12347", status: "LMD", date: createDate(2024, 10, 1) },
  //     { eccId: "T-12348", status: "Inspection", date: createDate(2024, 9, 15) },
  //     { eccId: "T-12349", status: "Packing", date: createDate(2024, 11, 10) },
  //     { eccId: "T-12350", status: "Shipping", date: createDate(2024, 11, 12) },
  //     { eccId: "T-12351", status: "Storage", date: createDate(2024, 10, 5) },
  //     { eccId: "T-12353", status: "Storage", date: createDate(2024, 11, 16) },
  //     { eccId: "T-12347", status: "LMD", date: createDate(2024, 10, 1) },
  //     {
  //       eccId: "T-12348",
  //       status: "Inspection",
  //       date: createDate(2024, 12, 15),
  //     },
  //     { eccId: "T-12349", status: "Packing", date: createDate(2024, 11, 10) },
  //     { eccId: "T-12350", status: "Shipping", date: createDate(2024, 12, 12) },
  //     { eccId: "T-12351", status: "Storage", date: createDate(2024, 12, 5) },
  //     { eccId: "T-12353", status: "Storage", date: createDate(2024, 12, 16) },
  //     { eccId: "T-12347", status: "LMD", date: createDate(2024, 12, 1) },
  //     {
  //       eccId: "T-12348",
  //       status: "Inspection",
  //       date: createDate(2024, 12, 15),
  //     },
  //     { eccId: "T-12349", status: "Packing", date: createDate(2024, 12, 10) },
  //   ];
  //   setHistory(dummyData);
  // }, [location]);
  //   return history;
};

const HistorySummary = () => {
  const history = useRecentHistory();
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState("thisMonth");
  const [sortOrder, setSortOrder] = useState("asc"); // Track sorting order
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { t } = useTranslation("common");

  // Sort history by date based on the sortOrder state
  const sortedHistory = [...history].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.date - b.date; // Ascending
    } else {
      return b.date - a.date; // Descending
    }
  });

  // Filter history based on selected filter
  const filterHistory = () => {
    const currentDate = new Date();
    let filteredData = [...sortedHistory];

    switch (filter) {
      case "last7":
        const last7Days = new Date();
        last7Days.setDate(currentDate.getDate() - 7);
        filteredData = filteredData.filter((item) => item.date >= last7Days);
        break;
      case "last30":
        const last30Days = new Date();
        last30Days.setDate(currentDate.getDate() - 30);
        filteredData = filteredData.filter((item) => item.date >= last30Days);
        break;
      case "custom":
        if (startDate && endDate) {
          filteredData = filteredData.filter(
            (item) => item.date >= startDate && item.date <= endDate,
          );
        }
        break;
      default:
        // Default to current month
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        filteredData = filteredData.filter(
          (item) =>
            item.date.getMonth() === currentMonth &&
            item.date.getFullYear() === currentYear,
        );
        break;
    }

    return filteredData;
  };

  const filteredHistory = filterHistory();

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const selectedDate = new Date(value); // Create a Date object from the selected date string
    selectedDate.setHours(0, 0, 0, 0); // Set the time to midnight to avoid timezone shifting

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
        history.length > 5 && !showAll ? "" : fullscreenClass
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
                  <>
                    <GoSortAsc size={24} />
                  </>
                ) : (
                  <>
                    <GoSortDesc size={24} />
                  </>
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
              <p className="p-2 font-semibold">{item.serialNumber}</p>
              <div className="px-2 flex flex-row justify-between text-sm">
                <p>{item.status}</p>

                <p>{dateFormat(item.createdAt, "mmmm dS, yyyy")}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HistorySummary;
