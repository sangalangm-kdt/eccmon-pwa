/* eslint-disable no-unused-vars */
import axiosLib from "../lib/axios";
import useSWR from "swr";

export const useAffiliation = () => {
  const { data: affiliationProcesses } = useSWR("api/locations/processes", () =>
    axiosLib
      .get("api/locations/processes")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;
      }),
  );

  return {
    affiliationProcesses,
  };
};
