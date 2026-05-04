import axiosLib from "../lib/axios";
import useSWR from "swr";

export const useLocation = (userId) => {
  const { data: process } = useSWR(`/api/locations/processes`, () =>
    axiosLib
      .get(`/api/locations/processes`)
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) {
          setErrorMessage("Error fetching user data.");
        }
      }),
  );

  const { data: affiliation } = useSWR("/api/locations", () =>
    axiosLib
      .get("/api/locations")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) {
          setErrorMessage("Error fetching user data.");
        }
      }),
  );

  return {
    process,
    affiliation,
  };
};
