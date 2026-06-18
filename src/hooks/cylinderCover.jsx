import axiosLib from "../lib/axios";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { useAuthentication } from "./auth";
import {
  buildOperationSavePayload,
  getCylinderSerialNumber,
  isDisposed,
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

const hasCylinderCoverAccess = (cylinder, user) => {
  const isAdmin = Number(user?.is_admin ?? user?.isAdmin) === 1;
  if (isAdmin) return true;

  const userLocation = user?.affiliation ?? "";
  const cylinderLocation =
    cylinder?.location ??
    cylinder?.data?.location ??
    cylinder?.cylinder?.location ??
    "";

  return (
    String(cylinderLocation).trim().toLowerCase() ===
    String(userLocation).trim().toLowerCase()
  );
};

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

const buildCylinderQuery = (params = {}) => {
  const searchParams = new URLSearchParams();

  if (params.perPage) searchParams.set("per_page", String(params.perPage));
  if (params.page) searchParams.set("page", String(params.page));
  if (params.search) searchParams.set("search", params.search);
  if (params.location) searchParams.set("location", params.location);
  if (params.status) searchParams.set("status", params.status);
  if (params.statusFilter) {
    searchParams.set("status_filter", params.statusFilter);
  }
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.direction) searchParams.set("direction", params.direction);
  if (params.caseFilter !== undefined && params.caseFilter !== null) {
    searchParams.set("case", String(params.caseFilter));
  }
  if (typeof params.includeUpdates === "boolean") {
    searchParams.set("include_updates", params.includeUpdates ? "1" : "0");
  }

  const queryString = searchParams.toString();
  return queryString ? `/api/cylinder?${queryString}` : "/api/cylinder";
};

export const CYLINDER_COVER_DELETE_SUPPORTED = true;

const shouldFetchCylinderList = (params = {}) =>
  params.fetchList === true ||
  [
    "perPage",
    "page",
    "search",
    "location",
    "status",
    "statusFilter",
    "sort",
    "direction",
    "caseFilter",
    "includeUpdates",
  ].some((key) => params[key] !== undefined);

export const useCylinderCover = (params = {}) => {
  const csrf = () => axiosLib.get("/sanctum/csrf-cookie");
  const navigate = useNavigate();
  const { userId, user } = useAuthentication();
  const shouldFetchList =
    params.enabled !== false && shouldFetchCylinderList(params);
  const endpoint = shouldFetchList ? buildCylinderQuery(params) : null;

  const {
    data: cylinder,
    error,
    mutate,
    isLoading,
    isValidating,
  } = useSWR(
    endpoint,
    () =>
      axiosLib
        .get(endpoint)
        .then((res) => res.data)
        .catch((error) => {
          console.error(error);
          if (error.response?.status !== 409) throw error;
        }),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  const checkSerial = async ({
    setAddDisable,
    setMessage,
    setModalOpen,
    ...props
  }) => {
    await csrf();

    try {
      const res = await axiosLib.get(`/api/cylinder/${props.eccId}`);

      if (res.data.data) {
        const cylinder = normalizeApiCylinderResponse(res.data);

        if (!hasCylinderCoverAccess(cylinder, user)) {
          setAddDisable(true);
          setMessage("noAccessCylinderCover");
          setModalOpen(true);

          return {
            exists: true,
            hasAccess: false,
            isDisposed: false,
            data: cylinder,
          };
        }

        const disposed = isDisposed(cylinder);

        navigate("/scanned-result", {
          replace: true,
          state: {
            ...res.data,
            data: cylinder,
            disposedReadOnly: disposed,
          },
        });

        return { exists: true, isDisposed: disposed, data: cylinder };
      }

      setAddDisable(false);
      setMessage("addCylinderQuestion");
      setModalOpen(true);

      return { exists: false, isDisposed: false, data: null };
    } catch (error) {
      if (error.response?.status === 422) {
        return { exists: false, isDisposed: false, data: null };
      }
      throw error;
    } finally {
      if (shouldFetchList) {
        mutate();
      }
    }
  };

  const createCylinder = async ({
    serialNumber,
    location = null,
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

  const deleteCylinder = async (id) => {
    if (!CYLINDER_COVER_DELETE_SUPPORTED) {
      throw new Error("cylinder_cover_delete_unsupported");
    }

    if (!id) {
      throw new Error("missing_cylinder_id");
    }

    await csrf();

    return axiosLib
      .delete(`/api/cylinder/${id}`)
      .then((res) => {
        mutate();
        return res.data;
      })
      .catch((error) => {
        if (error.response?.status !== 409) throw error;
      });
  };

  return {
    cylinder,
    isLoading: shouldFetchList ? isLoading : false,
    isValidating: shouldFetchList ? isValidating : false,
    checkSerial,
    createCylinder,
    updateCylinder,
    deleteCylinder,
    mutate,
  };
};
