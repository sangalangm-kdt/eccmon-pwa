import axiosLib from "../lib/axios";
import useSWR from "swr";
import { useMemo } from "react";

export const isActiveOrderRecord = (item) => {
  if (item === null || item === undefined) return false;

  if (typeof item === "string" || typeof item === "number") {
    return `${item}`.trim() !== "";
  }

  if (!Object.prototype.hasOwnProperty.call(item, "status")) {
    return true;
  }

  const { status } = item;
  return (
    status === 1 ||
    status === "1" ||
    status === true ||
    status === "active"
  );
};

export const normalizeOrderNumberListResponse = (response) => {
  const payload = response?.data ?? response;

  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.data?.data)
        ? payload.data.data
        : [];

  return list.filter(isActiveOrderRecord);
};

export const useOrderNumber = ({ enabled = true } = {}) => {
  const key = enabled ? "/api/order-number" : null;

  const { data, error, isLoading } = useSWR(
    key,
    () =>
      axiosLib
        .get("/api/order-number")
        .then((res) => res.data)
        .catch((fetchError) => {
          if (fetchError.response?.status !== 409) throw fetchError;
          return null;
        }),
    {
      revalidateOnFocus: false,
    },
  );

  const orderNumbers = useMemo(
    () => normalizeOrderNumberListResponse(data),
    [data],
  );

  return {
    orderNumbers,
    error,
    isLoading: enabled ? isLoading : false,
  };
};
