import axiosLib from "../lib/axios";
import useSWR from "swr";

export const useLocation = (userId) => {
  const processKey = userId
    ? `/api/locations/processes?userId=${userId}`
    : null;

  const { data: process } = useSWR(processKey, () =>
    axiosLib
      .get(`/api/locations/processes?userId=${userId}`)
      .then((res) => res.data)
      .catch((error) => {
        if (error.response?.status !== 409) throw error;
      }),
  );

  const {
    data: locations,
    error: affiliationError,
    isLoading: isAffiliationLoading,
  } = useSWR("/api/locations", () =>
    axiosLib
      .get("/api/locations")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response?.status !== 409) throw error;
      }),
  );

  return {
    process,
    locations,
    affiliation: locations,
    affiliationError,
    isAffiliationLoading,
  };
};
