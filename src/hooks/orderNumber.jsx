/* eslint-disable no-unused-vars */
import axiosLib from "../lib/axios";
import useSWR from "swr";

export const useOrderNumber = () => {
  const { data: orderNumber, error } = useSWR("/api/order-number", () =>
    axiosLib
      .get("/api/order-number")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;
      }),
  );

  return {
    orderNumber,
    error,
  };
};
