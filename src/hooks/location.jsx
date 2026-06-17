import axiosLib from "../lib/axios";
import useSWR from "swr";

export const useLocation = (
  _userId,
  { enabled = true, includeAffiliation = true } = {},
) => {
  const processKey = enabled ? "/api/locations/processes" : null;
  const affiliationKey =
    enabled && includeAffiliation ? "/api/locations" : null;

  const { data: process } = useSWR(
    processKey,
    () =>
      axiosLib
        .get("/api/locations/processes")
        .then((res) => res.data)
        .catch((error) => {
          if (error.response?.status !== 409) throw error;
        }),
    {
      revalidateOnFocus: false,
    },
  );

  const {
    data: locations = [],
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
