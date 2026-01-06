import axiosLib from "../lib/axios";
import useSWR from "swr";

const API_ENDPOINTS = {
  storage: "/api/storages",
  disassembly: "/api/disassembly",
  grooving: "/api/grooving",
  lmd: "/api/lmd",
  finishing: "/api/finishing",
  assembly: "/api/assembly",
  site: "/api/site",
  "order-number": "/api/order-number",
};

export const useLocationProcess = (process) => {
  const fetcher = (url) =>
    axiosLib
      .get(url)
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 422) throw error;
      });

  // Run API call only if a process is provided
  const { data, error, isLoading, mutate } = useSWR(
    process ? API_ENDPOINTS[process] : null,
    fetcher,
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
};
