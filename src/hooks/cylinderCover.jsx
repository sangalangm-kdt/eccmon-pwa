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
  normalizeOtherDetails,
} from "../components/utils/cylinderStatus";
import { logLaravelValidationError } from "../components/utils/apiValidationErrors";

const parseOtherDetails = normalizeOtherDetails;

const getCaseValue = (otherDetails, fallbackCase = null) => {
  const parsedOtherDetails = parseOtherDetails(otherDetails) ?? {};
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
    otherDetails: normalizeOtherDetails(otherDetails),
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

    const data = buildCylinderApiPayload({
      serialNumber: resolvedSerialNumber,
      status: process,
      disposalDate,
      location,
      cycle,
      otherDetails,
      userId,
    });

    await csrf();

    try {
      const res = await axiosLib.post("/api/cylinder", data);

      addHistory({
        serialNumber: resolvedSerialNumber,
        status: isDisposalOperation(process) ? 2 : 1,
      });

      await mutate();
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

  return {
    cylinder,
    checkSerial,
    createCylinder,
    mutate,
  };
};
