/* eslint-disable no-unused-vars */
import axiosLib from "../lib/axios";
import useSWR from "swr";

export const useAffiliation = () => {
  const { data: affiliation, error } = useSWR("/api/affiliation", () =>
    axiosLib
      .get("/api/affiliation")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;
      }),
  );

  return {
    affiliation,
    error,
  };
};
