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

  const clearTime = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); // Strip out time for date comparison
    return d;
  };

  switch (filter) {
    case "last7":
      const last7Days = new Date();
      last7Days.setDate(currentDate.getDate() - 7);
      filteredData = filteredData?.filter((item) => {
        // console.log(`Checking last7Days filter: ${item.createdAt}`);
        return new Date(item.createdAt) >= last7Days;
      });
      break;
    case "last30":
      const last30Days = new Date();
      last30Days.setDate(currentDate.getDate() - 30);
      filteredData = filteredData?.filter((item) => {
        // console.log(`Checking last30Days filter: ${item.createdAt}`);
        return new Date(item.createdAt) >= last30Days;
      });
      break;
    case "custom":
      if (startDate && endDate) {
        const start = clearTime(startDate);
        const end = new Date(
          clearTime(endDate).getTime() + 24 * 60 * 60 * 1000 - 1,
        ); // Include entire end date

        // console.log(`Start: ${start}, End: ${end}`);
        filteredData = filteredData?.filter((item) => {
          // console.log(
          //   `Checking custom filter: ${item.createdAt}, Start: ${start}, End: ${end}`,
          // );
          return (
            new Date(item.createdAt) >= start && new Date(item.createdAt) <= end
          );
        });
      }
      break;
    default:
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      filteredData = filteredData?.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return (
          itemDate.getMonth() === currentMonth &&
          itemDate.getFullYear() === currentYear
        );
      });
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
