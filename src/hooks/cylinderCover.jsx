/* eslint-disable no-unused-vars */
import axiosLib from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { useScanHistory } from "./scanHistory";
import useSWR from "swr";
import { useAuthentication } from "./auth";
import {
  buildOperationSavePayload,
  getCylinderSerialNumber,
  isDisposed,
  isDisposalOperation,
  normalizeApiCylinderResponse,
} from "../components/utils/cylinderStatus";
import {
  getLaravelValidationMessage,
  logLaravelValidationError,
} from "../components/utils/apiValidationErrors";

const parseOtherDetails = (otherDetails) => {
  if (!otherDetails) return {};
  if (typeof otherDetails === "object") return otherDetails;

  try {
    return JSON.parse(otherDetails);
  } catch {
    return {};
  }
};

const getCaseValue = (otherDetails, fallbackCase = null) => {
  const parsedOtherDetails = parseOtherDetails(otherDetails);
  return parsedOtherDetails.case ?? fallbackCase ?? 0;
};

const normalizeSerialNumber = (value) => `${value ?? ""}`.trim();

const buildCylinderApiPayload = ({
  serialNumber,
  status,
  disposalDate,
  location,
  cycle,
  otherDetails,
  userId,
  caseValue,
}) => {
  const saveFields = buildOperationSavePayload(
    { disposalDate, dateDone: disposalDate },
    status,
  );
  const resolvedSerialNumber = normalizeSerialNumber(serialNumber);

  return {
    ...(resolvedSerialNumber ? { serialNumber: resolvedSerialNumber } : {}),
    status: saveFields.status,
    process: saveFields.process,
    cycle: cycle ?? 1,
    location,
    userId,
    case: getCaseValue(otherDetails, caseValue),
    isDisposed: saveFields.isDisposed,
    disposalDate: saveFields.disposalDate,
    otherDetails: otherDetails || null,
  };
};

const buildCylinderUpdatePayload = ({
  id,
  serialNumber,
  status,
  disposalDate,
  location,
  cycle,
  otherDetails,
  userId,
  caseValue,
}) => {
  const saveFields = buildOperationSavePayload(
    { disposalDate, dateDone: disposalDate },
    status,
  );
  const resolvedSerialNumber = normalizeSerialNumber(serialNumber);

  return {
    id,
    ...(resolvedSerialNumber ? { serialNumber: resolvedSerialNumber } : {}),
    status: saveFields.status,
    process: saveFields.process,
    cycle: cycle ?? 1,
    location,
    userId,
    case: getCaseValue(otherDetails, caseValue),
    isDisposed: saveFields.isDisposed,
    disposalDate: saveFields.disposalDate,
    otherDetails: otherDetails || null,
  };
};

export const useCylinderCover = () => {
  const csrf = () => axiosLib.get("/sanctum/csrf-cookie");
  const navigate = useNavigate();
  const { addHistory } = useScanHistory();
  const { userId } = useAuthentication();

  const {
    data: cylinder,
    error,
    mutate,
  } = useSWR("/api/cylinder", () =>
    axiosLib
      .get("/api/cylinder")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;
      }),
  );

  const checkSerial = async ({
    setAddDisable,
    setMessage,
    setModalOpen,
    ...props
  }) => {
    await csrf();

    return axiosLib
      .get(`/api/cylinder/${props.eccId}`)
      .then((res) => {
        if (res.data.data) {
          const cylinder = normalizeApiCylinderResponse(res.data);
          const disposed = isDisposed(cylinder);

          navigate("/scanned-result", {
            replace: true,
            state: {
              ...res.data,
              data: cylinder,
              disposedReadOnly: disposed,
            },
          });
        } else {
          setAddDisable(false);
          setMessage("addCylinderQuestion");
          setModalOpen(true);
        }
      })
      .catch((error) => {
        if (error.response?.status === 422) return;
        throw error;
      });
  };

  const createCylinder = async ({
    serialNumber,
    location = "None",
    process = "Storage",
    disposalDate,
    otherDetails,
    cycle,
  }) => {
    const resolvedSerialNumber = getCylinderSerialNumber({ serialNumber });

    if (import.meta.env.DEV) {
      console.log("[createCylinder] serialNumber arg:", serialNumber);
      console.log("[createCylinder] resolved serial:", resolvedSerialNumber);
    }

    const data = buildCylinderApiPayload({
      serialNumber: resolvedSerialNumber,
      status: process,
      disposalDate,
      location,
      cycle,
      otherDetails,
      userId,
    });

    if (import.meta.env.DEV) {
      console.log("[createCylinder] POST payload:", data);
    }

    await csrf();

    try {
      const res = await axiosLib.post("/api/cylinder", data);

      addHistory({
        serialNumber: resolvedSerialNumber,
        status: isDisposalOperation(process) ? 2 : 1,
      });

      mutate();
      return res.data;
    } catch (error) {
      if (error.response?.status === 422) {
        logLaravelValidationError(
          "Cylinder create validation failed",
          error,
          data,
        );
      }
      throw error;
    }
  };

  const updateCylinder = async (input) => {
    if (input.isAlreadyDisposed) {
      throw new Error("disposed_read_only");
    }

    const { id, status, originalSerialNumber, ...rest } = input;
    if (!id) {
      throw new Error("missing_cylinder_id");
    }

    const resolvedSerialNumber = normalizeSerialNumber(
      rest.serialNumber || originalSerialNumber,
    );

    const data = buildCylinderUpdatePayload({
      id,
      serialNumber: resolvedSerialNumber,
      status,
      disposalDate: rest.disposalDate ?? rest.dateDone,
      location: rest.location,
      cycle: rest.cycle,
      otherDetails: rest.otherDetails,
      caseValue: rest.case,
      userId,
    });

    await csrf();

    console.info("Cylinder update PUT payload", {
      id,
      existingSerialNumber: normalizeSerialNumber(originalSerialNumber),
      payload: data,
    });

    return axiosLib
      .put(`/api/cylinder/${id}`, data)
      .then((res) => {
        mutate();
        return res.data;
      })
      .catch((error) => {
        if (error.response?.status === 422) {
          logLaravelValidationError(
            "Cylinder update validation failed",
            error,
            data,
          );
        }
        if (error.response?.status !== 409) throw error;
      });
  };

  return {
    cylinder,
    checkSerial,
    createCylinder,
    updateCylinder,
    mutate,
  };
};
