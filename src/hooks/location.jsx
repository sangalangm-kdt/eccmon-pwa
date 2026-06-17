import axiosLib from "../lib/axios";
import useSWR from "swr";
import { parseLocationsFromResponse } from "../components/utils/affiliationOptions";

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
  } = useSWR(
    affiliationKey,
    () =>
      axiosLib
        .get("/api/locations")
        .then((res) => parseLocationsFromResponse(res))
        .catch((error) => {
          if (error.response?.status !== 409) throw error;
        }),
    {
      revalidateOnFocus: false,
    },
  );

  return {
    process,
    locations,
    affiliation: locations,
    affiliationError,
    isAffiliationLoading,
  };
};
