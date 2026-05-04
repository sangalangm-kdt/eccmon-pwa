/* eslint-disable no-unused-expressions */
import dateFormat from "dateformat";
import { useCylinderUpdate } from "../../hooks/cylinderUpdates";

// Custom hook to combine history and updates
export const useHistoryWithUpdates = (history) => {
  const { cylinder: updateData } = useCylinderUpdate(); // Hook used correctly here

  if (updateData && updateData.data) {
    return [...history, ...updateData.data]; // Combine data
  }

  return history;
};

// Sort function for history based on the date or alphabetically
export const sortHistory = (
  userHistory,
  sortOrder = "asc",
  sortBy = "date",
) => {
  if (sortBy === "date") {
    return userHistory?.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  } else if (sortBy === "alphabetical") {
    return userHistory?.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.serialNumber.localeCompare(b.serialNumber); // Ascending Alphabetically
      } else {
        return b.serialNumber.localeCompare(a.serialNumber); // Descending Alphabetically
      }
    });
  }
  return userHistory;
};

// Sort function for history based on the date
// Sort function for history based on the date and time
export const sortHistoryByDate = (userHistory, sortOrder = "asc") => {
  return userHistory.sort((a, b) => {
    // Ensure that dateDone exists and is a valid date
    const dateA = a.updates?.dateDone ? new Date(a.updates?.dateDone) : null;
    const dateB = b.updates?.dateDone ? new Date(b.updates?.dateDone) : null;

    // If any date is invalid, treat it as the lowest value (if ascending) or the highest (if descending)
    if (isNaN(dateA)) return sortOrder === "asc" ? 1 : -1;
    if (isNaN(dateB)) return sortOrder === "asc" ? -1 : 1;

    // Compare the dates
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });
};

// Filter function for history
export const filterHistory = (userHistory, filter, startDate, endDate) => {
  const currentDate = new Date();
  let filteredData = userHistory;

  const clearTime = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); // Strip out time for date comparison
    return d;
  };

  switch (filter) {
    case "latest":
      // Sort by dateDone descending and return only the most recent entry
      filteredData;
      break;

    case "last7":
      const last7Days = new Date();
      last7Days.setDate(currentDate.getDate() - 7);
      filteredData = filteredData?.filter((item) => {
        const itemDate = new Date(item?.updates?.dateDone);
        return itemDate >= last7Days;
      });
      break;

    case "last30":
      const last30Days = new Date();
      last30Days.setDate(currentDate.getDate() - 30);
      filteredData = filteredData?.filter((item) => {
        const itemDate = new Date(item?.updates?.dateDone);
        return itemDate >= last30Days;
      });
      break;

    case "custom":
      if (startDate && endDate) {
        const start = clearTime(startDate);
        const end = new Date(
          clearTime(endDate).getTime() + 24 * 60 * 60 * 1000 - 1,
        );
        filteredData = filteredData?.filter((item) => {
          const itemDate = new Date(item?.updates?.dateDone);
          return itemDate >= start && itemDate <= end;
        });
      }
      break;

    default:
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      filteredData = filteredData?.filter((item) => {
        const itemDate = new Date(item?.updates?.dateDone);
        return (
          itemDate.getMonth() === currentMonth &&
          itemDate.getFullYear() === currentYear
        );
      });
      break;
  }

  return filteredData;
};

// Format the date for display
export const formatDate = (date, t) => {
  const month = new Date(date).getMonth() + 1;
  const day = new Date(date).getDate();
  const year = new Date(date).getFullYear();

  const monthName = t(`date:months.${month}`);
  const daySuffix = t(
    `date:days.${
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th"
    }`,
  );

  // You can customize the format as per language, for example:
  return `${monthName} ${day}${daySuffix}, ${year}`;
};
