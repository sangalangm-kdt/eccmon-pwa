import axiosLib from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { useScanHistory } from "./scanHistory";
import useSWR from "swr";
import { useAuthentication } from "./auth";

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
  const { addHistory } = useScanHistory();
  const { userId } = useAuthentication();
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
          if (error.response.status !== 409) throw error;
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
    try {
      const res = await axiosLib.get(`/api/cylinder/${props.eccId}`);

      if (res.data.data) {
        if (+res.data.data.isDisposed === 1) {
          setAddDisable(true);
          setMessage("Cylinder is already disposed");
          setModalOpen(true);

          return { exists: true, isDisposed: true, data: res.data.data };
        }

        navigate("/scanned-result", { replace: true, state: res.data });
        return { exists: true, isDisposed: false, data: res.data.data };
      }

      setAddDisable(false);
      setMessage("The cylinder cover does not exist. Do you want to add it?");
      setModalOpen(true);

      return { exists: false, isDisposed: false, data: null };
    } catch (error) {
      if (error.response.status !== 422) throw error;
      return { exists: false, isDisposed: false, data: null };
    } finally {
      if (shouldFetchList) {
        mutate();
      }
    }
  };

  const addCylinder = async (input) => {
    const data = {
      serialNumber: input,
      isDisposed: 2,
      status: "Storage",
      location: "None",
      userId: userId,
    };
    await csrf();
    // console.log(data);
    axiosLib
      .post("/api/cylinder", data)
      .then((res) => {
        const data2 = {
          serialNumber: input,
          status: 2,
        };
        // console.log(res);

        addHistory(data2);
        navigate("/scanned-result", { state: res.data });
        if (shouldFetchList) {
          mutate();
        }
      })
      .catch((error) => {
        if (error.response.status !== 422) throw error;
      });
  };

  const updateCylinder = async (input) => {
    const data = {
      serialNumber: input.serialNumber,
      isDisposed: input.isDisposed,
      status: input.status,
      cycle: input.cycle,
    };
    const id = input.id;

    await csrf();

    axiosLib
      .put(`/api/cylinder/${id}`, data)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        if (error.response.status !== 409) throw error;
      });
  };

  const deleteCylinder = async (id) => {
    await csrf();

    return axiosLib
      .delete(`/api/cylinder/${id}`)
      .then((res) => {
        if (shouldFetchList) {
          mutate();
        }

        return res.data;
      })
      .catch((error) => {
        if (error.response?.status !== 409) throw error;
        return null;
      });
  };

  return {
    cylinder,
    isLoading: shouldFetchList ? isLoading : false,
    isValidating: shouldFetchList ? isValidating : false,
    checkSerial,
    addCylinder,
    updateCylinder,
    deleteCylinder,
  };
};
