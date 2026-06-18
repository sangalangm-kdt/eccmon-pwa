/* eslint-disable no-unused-vars */

import axiosLib from "../lib/axios";

import useSWR from "swr";

import { normalizeOtherDetails } from "../components/utils/cylinderStatus";
import { logLaravelValidationError } from "../components/utils/apiValidationErrors";

export const useCylinderUpdate = () => {
  const csrf = () => axiosLib.get("/sanctum/csrf-cookie");

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

  const addUpdate = async (input, status) => {
    const updateData = {
      serialNumber: input.serialNumber,
      process: status,
      location: input.location,
      cycle: input.cycle,
      dateDone: input.dateDone || null,
      otherDetails: normalizeOtherDetails(input.otherDetails),
    };

    await csrf();

    try {
      const response = await axiosLib.post("/api/cylinder-update", updateData);
      await mutate();
      return response.data;
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
