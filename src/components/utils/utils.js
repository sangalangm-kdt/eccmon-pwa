import dateFormat from "dateformat";

// Sort function for history based on the date
export const sortHistoryByDate = (history, sortOrder = "asc") => {
  return history?.sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.createdAt) - new Date(b.createdAt); // Ascending
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt); // Descending
    }
  });
};

// Filter function for history
export const filterHistory = (history, filter, startDate, endDate) => {
  const currentDate = new Date();
  let filteredData = history;

  // Ensure the comparison dates are set to the start of the day (midnight)
  const clearTime = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); // Strip out time for date comparison
    return d;
  };

  switch (filter) {
    case "last7":
      const last7Days = new Date();
      last7Days.setDate(currentDate.getDate() - 7);
      filteredData = filteredData?.filter(
        (item) => new Date(item.createdAt) >= last7Days,
      );
      break;
    case "last30":
      const last30Days = new Date();
      last30Days.setDate(currentDate.getDate() - 30);
      filteredData = filteredData?.filter(
        (item) => new Date(item.createdAt) >= last30Days,
      );
      break;
    case "custom":
      if (startDate && endDate) {
        // Compare against the cleared startDate and endDate to avoid time issues
        const start = clearTime(startDate);
        const end = clearTime(endDate);

        filteredData = filteredData?.filter(
          (item) =>
            new Date(item.createdAt) >= start &&
            new Date(item.createdAt) <= end,
        );
      }
      break;
    default:
      // Default to current month
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      filteredData = filteredData?.filter(
        (item) =>
          new Date(item.createdAt).getMonth() === currentMonth &&
          new Date(item.createdAt).getFullYear() === currentYear,
      );
      break;
  }

  return filteredData;
};

export const formatDate = (date, t) => {
  const month = new Date(date).getMonth() + 1;
  const monthName = t(`date:months.${month}`);

  const formattedDate = dateFormat(date, "dS, yyyy");
  return `${monthName} ${formattedDate}`;
};
