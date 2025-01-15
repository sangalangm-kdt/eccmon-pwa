import dateFormat from "dateformat";
import { useCylinderUpdate } from "../../hooks/cylinderUpdates";

export const useHistoryWithUpdates = (history) => {
  const { cylinder: updateData } = useCylinderUpdate(); // Hook used correctly here

  if (updateData && updateData.data) {
    return [...history, ...updateData.data]; // Combine data
  }

  return history;
};

// Sort function for history based on the date or alphabetically
export const sortHistory = (userHistory, sortOrder = "asc", sortBy = "date") => {
  if (sortBy === "date") {
    return userHistory?.sort((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.createdAt) - new Date(b.createdAt); // Ascending
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt); // Descending
      }
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
export const sortHistoryByDate = (userHistory, sortOrder = "asc") => {
  return userHistory?.sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.createdAt) - new Date(b.createdAt); // Ascending
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt); // Descending
    }
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

  // console.log("Filtering history with filter:", filter);

  switch (filter) {
    case "last7":
      const last7Days = new Date();
      last7Days.setDate(currentDate.getDate() - 7);
      // console.log("Last 7 days:", last7Days);
      filteredData = filteredData?.filter((item) => {
        const itemDate = new Date(item.createdAt);
        // console.log("Item Date:", itemDate);
        return itemDate >= last7Days;
      });
      break;

    case "last30":
      const last30Days = new Date();
      last30Days.setDate(currentDate.getDate() - 30);
      // console.log("Last 30 days:", last30Days);
      filteredData = filteredData?.filter((item) => {
        const itemDate = new Date(item.createdAt);
        // console.log("Item Date:", itemDate);
        return itemDate >= last30Days;
      });
      break;

    case "custom":
      if (startDate && endDate) {
        const start = clearTime(startDate);
        const end = new Date(
          clearTime(endDate).getTime() + 24 * 60 * 60 * 1000 - 1,
        );
        // console.log("Custom date range:", start, end);
        filteredData = filteredData?.filter((item) => {
          const itemDate = new Date(item.createdAt);
          // console.log("Item Date:", itemDate);
          return itemDate >= start && itemDate <= end;
        });
      }
      break;

    default:
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      // console.log("Current month/year:", currentMonth, currentYear);
      filteredData = filteredData?.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return (
          itemDate.getMonth() === currentMonth &&
          itemDate.getFullYear() === currentYear
        );
      });
      break;
  }

  // console.log("Filtered Data:", filteredData);
  return filteredData;
};

export const formatDate = (date, t) => {
  const month = new Date(date).getMonth() + 1;
  const monthName = t(`date:months.${month}`);

  const formattedDate = dateFormat(date, "dS, yyyy");
  return `${monthName} ${formattedDate}`;
};
