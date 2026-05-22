import axiosLib from "../lib/axios";
import useSWR from "swr";

export const useOrderNumber = ({ enabled = true } = {}) => {
  const key = enabled ? "/api/order-number" : null;

  const { data: orderNumber, error, isLoading } = useSWR(
    key,
    () =>
      axiosLib
        .get("/api/order-number")
        .then((res) => res.data)
        .catch((error) => {
          if (error.response.status !== 409) throw error;
        }),
    {
      revalidateOnFocus: false,
    },
  );

  return {
    orderNumber,
    error,
    isLoading: enabled ? isLoading : false,
  };
};
