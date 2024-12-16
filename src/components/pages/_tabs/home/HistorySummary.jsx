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
import { fullscreenClass } from "../../../styles/home"; // Import fullscreenClass from styles
import { getStatusColors } from "../../../utils/statusColors"; // Import status color utility
import Spinner from "../../../constants/Skeleton";
import Skeleton from "../../../constants/Skeleton";

const HistorySummary = () => {
    const history = useCylinderCover().cylinder?.data; // Get history data
    const [showAll, setShowAll] = useState(false); // Default value is false
    const [filter, setFilter] = useState("thisMonth");
    const [sortOrder, setSortOrder] = useState("desc"); // Start with descending order to show recent first
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const { t } = useTranslation();

    // Use utility functions to sort and filter history
    const sortedHistory = sortHistoryByDate(history, sortOrder); // Ensure history is sorted
    const filteredHistory = filterHistory(
        sortedHistory,
        filter,
        startDate,
        endDate
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

    // Ensure fullscreen behavior starts in the collapsed state (showAll=false)
    useEffect(() => {
        setShowAll(false); // Set to false initially to avoid fullscreen on page reload
    }, []);

    return (
        <div
            className={`w-full p-2 overflow-hidden ${
                history?.length > 5 && showAll ? fullscreenClass : ""
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
                                    className="px-2 py-1 border ml-2 focus:outline focus:outline-primar"
                                    value={filter}
                                    onChange={handleFilterChange}
                                >
                                    <option value="thisMonth">
                                        {t("common:thisMonth")}
                                    </option>
                                    <option value="last7">
                                        {t("common:last7Days")}
                                    </option>
                                    <option value="last30">
                                        {t("common:last30Days")}
                                    </option>
                                    <option value="custom">
                                        {t("common:customDateRange")}
                                    </option>
                                </select>
                                <button
                                    className="py-2"
                                    onClick={toggleSortOrder}
                                >
                                    {sortOrder === "asc" ? (
                                        <GoSortAsc size={24} color="#6e7271" />
                                    ) : (
                                        <GoSortDesc size={24} color="#6e7271" />
                                    )}
                                </button>
                            </div>

                            {filter === "custom" && (
                                <div className="flex mt-2 px-2">
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={
                                            startDate
                                                ? startDate
                                                      .toISOString()
                                                      .split("T")[0]
                                                : ""
                                        }
                                        onChange={handleDateChange}
                                        className="px-2 py-1 border mr-2"
                                    />
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={
                                            endDate
                                                ? endDate
                                                      .toISOString()
                                                      .split("T")[0]
                                                : ""
                                        }
                                        onChange={handleDateChange}
                                        className="px-2 py-1 border"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {history ? (
                        // Check if filteredHistory has no data
                        filteredHistory?.length === 0 ? (
                            <div className="text-center text-gray-500 p-4 h-72">
                                No recent history
                            </div>
                        ) : (
                            <ul
                                className={`transition-transform duration-500 ease-in-out ${
                                    showAll ? "max-h-screen" : "max-h-[390px] "
                                } ${showAll ? "overflow-y-auto" : ""}`}
                            >
                                {filteredHistory?.map((item, index) => {
                                    const { backgroundColor, textColor } =
                                        getStatusColors(item.status);

                                    const createdDate = new Date(
                                        item.createdAt
                                    );
                                    const updatedDate = item.updatedAt
                                        ? new Date(item.updatedAt)
                                        : null;

                                    return (
                                        <li
                                            className="py-2 flex flex-col"
                                            key={index}
                                        >
                                            <p className="p-2 font-normal flex items-center justify-between">
                                                <span>{item.serialNumber}</span>
                                                <span className="text-xs text-gray-500 ml-2 font-semibold ">
                                                    {`${createdDate.getHours()}:${String(
                                                        createdDate.getMinutes()
                                                    ).padStart(2, "0")}`}
                                                </span>
                                            </p>
                                            <div className="px-2 flex flex-row justify-between text-xs">
                                                <p
                                                    className="rounded-full py-1 px-2 text-tiny"
                                                    style={{
                                                        backgroundColor,
                                                        color: textColor,
                                                    }}
                                                >
                                                    {t(
                                                        `qrScanner:${item.status.toLowerCase()}`
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {formatDate(createdDate, t)}
                                                </p>
                                                {updatedDate && (
                                                    <p className="text-xs text-gray-500">
                                                        {t("common:updated")}{" "}
                                                        {formatDate(
                                                            updatedDate,
                                                            t
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )
                    ) : (
                        <Skeleton description={`Loading History`} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistorySummary;
