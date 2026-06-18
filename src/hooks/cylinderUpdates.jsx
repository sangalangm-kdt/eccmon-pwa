import axiosLib from "../lib/axios";
import useSWR from "swr";

import { useAuthentication } from "./auth";

import { buildOperationSavePayload } from "../components/utils/cylinderStatus";
import { logLaravelValidationError } from "../components/utils/apiValidationErrors";

export const useCylinderUpdate = () => {
  const csrf = () => axiosLib.get("/sanctum/csrf-cookie");

  const { userId } = useAuthentication();

  const {
    data: cylinder,
    error,
    mutate,
  } = useSWR("/api/cylinder-update", () =>
    axiosLib

      .get("/api/cylinder-update")

      .then((res) => res.data)

      .catch((error) => {
        if (error.response.status !== 409) throw error;
      }),
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
    cylinder,

    mutate,
    addUpdate,
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
