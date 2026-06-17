import axiosLib from "../lib/axios";
import useSWR from "swr";
import { useAuthentication } from "./auth";
import { buildOperationSavePayload } from "../components/utils/cylinderStatus";
import { logLaravelValidationError } from "../components/utils/apiValidationErrors";

export const normalizeApiListResponse = (payload) => {
  if (payload === undefined || payload === null) return [];

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.cylinder_updates)) return payload.cylinder_updates;
  if (Array.isArray(payload?.cylinderUpdates)) return payload.cylinderUpdates;

  return [];
};

const normalizePaginatedResponse = (payload) => {
  const records = normalizeApiListResponse(payload);

  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return {
      ...payload,
      data: records,
    };
  }

  return { data: records };
};

const buildUpdateQuery = (params = {}) => {
  const searchParams = new URLSearchParams();

  if (params.perPage) searchParams.set("per_page", String(params.perPage));
  if (params.page) searchParams.set("page", String(params.page));

  if (Array.isArray(params.serialNumbers)) {
    params.serialNumbers
      .filter(Boolean)
      .forEach((serialNumber) =>
        searchParams.append("serialNumbers[]", serialNumber),
      );
  }

  const queryString = searchParams.toString();
  return queryString
    ? `/api/cylinder-update?${queryString}`
    : "/api/cylinder-update";
};

export const useCylinderUpdate = (params = {}) => {
  const csrf = () => axiosLib.get("/sanctum/csrf-cookie");
  const { userId } = useAuthentication();
  const endpoint = params.enabled === false ? null : buildUpdateQuery(params);

  const {
    data: cylinder,
    error,
    mutate,
    isLoading,
  } = useSWR(
    endpoint,
    () =>
      axiosLib
        .get(endpoint)
        .then((res) => normalizePaginatedResponse(res.data))
        .catch((error) => {
          console.error(error);
          if (error.response?.status !== 409) throw error;
        }),
    {
      revalidateOnFocus: false,
    },
  );

  const addUpdate = async (input, status, setModalOpen, setLoading) => {
    setLoading(true);

    if (input.isAlreadyDisposed) {
      setLoading(false);
      throw new Error("disposed_read_only");
    }

    const saveFields = buildOperationSavePayload(input, status);

    const updateData = {
      ...input,
      serialNumber: input.serialNumber,
      process: saveFields.process,
      status: saveFields.status,
      location: input.location,
      cycle: input.cycle,
      dateDone: input.dateDone ? input.dateDone : null,
      otherDetails: input.otherDetails ? input.otherDetails : null,
      userId,
      isDisposed: saveFields.isDisposed,
      is_disposed: saveFields.is_disposed,
      disposalDate: saveFields.disposalDate,
      disposal_date: saveFields.disposal_date,
    };

    await csrf();

    try {
      const res = await axiosLib.post("/api/cylinder-update", updateData);
      mutate();
      setModalOpen(true);
      setLoading(false);
      return res.data;
    } catch (error) {
      setLoading(false);

      if (error.response?.status === 422) {
        logLaravelValidationError(
          "Cylinder update history validation failed",
          error,
          updateData,
        );
      }

      if (error.response?.status !== 422) throw error;
      throw error;
    }
  };

  return {
    cylinder,
    records: normalizeApiListResponse(cylinder),
    isLoading: params.enabled === false ? false : isLoading,
    error,
    mutate,
    addUpdate,
  };
};
