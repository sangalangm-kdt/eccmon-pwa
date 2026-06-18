import axiosLib from "../lib/axios";
import useSWR from "swr";

import { useAuthentication } from "./auth";

import {
  buildOperationSavePayload,
  isDisposalOperation,
} from "../components/utils/cylinderStatus";
import { logLaravelValidationError } from "../components/utils/apiValidationErrors";

const normalizeLocationForApi = (location) => {
  const value =
    location === undefined || location === null ? "" : String(location).trim();
  if (!value || value === "None") return null;
  return value;
};

export const normalizeProcessValue = (status, input = {}) =>
  String(
    status?.value ?? status?.status ?? status ?? input.process ?? "",
  ).trim();

export const normalizeUpdateRecord = (record) => {
  if (!record || typeof record !== "object") return record;

  return {
    ...record,
    serialNumber: record.serialNumber ?? record.serial_number ?? "",
    process: record.process ?? record.status ?? null,
    status: record.status ?? record.process ?? null,
    dateDone: record.dateDone ?? record.date_done ?? null,
    createdAt: record.createdAt ?? record.created_at ?? null,
    updatedAt: record.updatedAt ?? record.updated_at ?? null,
    userId: record.userId ?? record.user_id ?? record.user?.user_id ?? record.user?.userId ?? null,
    location: record.location ?? null,
  };
};

export const normalizeApiListResponse = (response) => {
  const payload = response?.data ?? response;

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data;
  }

  if (Array.isArray(payload?.cylinder_updates)) {
    return payload.cylinder_updates;
  }

  if (Array.isArray(payload?.cylinderUpdates)) {
    return payload.cylinderUpdates;
  }

  return [];
};

const normalizePaginatedResponse = (response) => {
  const payload = response?.data ?? response;
  const records = normalizeApiListResponse(response).map(normalizeUpdateRecord);
  const meta = payload?.meta ?? payload?.pagination ?? null;

  return { records, meta, raw: payload };
};

const buildUpdateQuery = (params = {}) => {
  const searchParams = new URLSearchParams();

  if (params.perPage) searchParams.set("per_page", String(params.perPage));
  if (params.page) searchParams.set("page", String(params.page));
  if (params.search) searchParams.set("search", params.search);
  if (params.location) searchParams.set("location", params.location);
  if (params.process) searchParams.set("process", params.process);
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.direction) searchParams.set("direction", params.direction);

  const queryString = searchParams.toString();
  return queryString
    ? `/api/cylinder-update?${queryString}`
    : "/api/cylinder-update";
};

export const useCylinderUpdate = (params = {}) => {
  const csrf = () => axiosLib.get("/sanctum/csrf-cookie");

  const { user } = useAuthentication();
  const currentUserId = user?.user_id ?? user?.userId ?? null;
  const enabled = params.enabled !== false;
  const endpoint = enabled ? buildUpdateQuery(params) : null;

  const { data, mutate, isLoading, isValidating } = useSWR(
    endpoint,
    (url) => axiosLib.get(url).then((res) => normalizePaginatedResponse(res)),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  const records = data?.records ?? [];

  const addUpdate = async (input, status, setModalOpen, setLoading) => {
    setLoading?.(true);

    if (input.isAlreadyDisposed) {
      setLoading?.(false);
      throw new Error("disposed_read_only");
    }

    const processValue = normalizeProcessValue(status, input);
    if (!processValue) {
      setLoading?.(false);
      throw new Error("process_required");
    }

    const saveFields = buildOperationSavePayload(input, processValue);

    const updateData = {
      serialNumber: input.serialNumber,
      process: saveFields.process || processValue,
      location: normalizeLocationForApi(input.location ?? saveFields.location),
      cycle: input.cycle,
      dateDone: input.dateDone ?? null,
      otherDetails: input.otherDetails ?? null,
      userId: currentUserId,
      user_id: currentUserId,
    };

    if (isDisposalOperation(processValue)) {
      updateData.isDisposed = saveFields.isDisposed;
      updateData.disposalDate = saveFields.disposalDate;
    }

    await csrf();

    try {
      const res = await axiosLib.post("/api/cylinder-update", updateData);

      mutate();
      setModalOpen?.(true);
      setLoading?.(false);

      return res.data;
    } catch (error) {
      setLoading?.(false);

      if (error.response?.status === 422) {
        logLaravelValidationError(
          "Cylinder update history validation failed",
          error,
          updateData,
        );
      }

      throw error;
    }
  };

  return {
    records,
    cylinder: data,
    isLoading: enabled ? isLoading : false,
    isValidating: enabled ? isValidating : false,
    mutate,
    addUpdate,
  };
};
