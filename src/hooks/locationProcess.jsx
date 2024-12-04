/* eslint-disable no-unused-vars */
import axiosLib from "../lib/axios";
import useSWR from "swr";

export const useLocationProcess = () => {
  const csrf = () => axiosLib.get("/sanctum/csrf-cookie");

  const {
    data: storage,
    error,
    mutate: storageMutate,
  } = useSWR("/api/storages", () =>
    axiosLib
      .get("/api/storages")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 422) throw error;
      }),
  );

  const {
    data: disassembly,
    error: disassemblyError,
    mutate: disassemblyMutate,
  } = useSWR("/api/disassemblyError", () =>
    axiosLib
      .get("/api/disassembly")
      .then((res) => res.data)
      .catch((disassemblyError) => {
        if (disassemblyError.response.status !== 422) throw disassemblyError;
      }),
  );

  const {
    data: grooving,
    error: groovingError,
    mutate: groovingMutate,
  } = useSWR("/api/grooving", () =>
    axiosLib
      .get("/api/grooving")
      .then((res) => res.data)
      .catch((groovingError) => {
        if (groovingError.response.status !== 422) throw groovingError;
      }),
  );

  const {
    data: lmd,
    error: lmdError,
    mutate: lmdMutate,
  } = useSWR("/api/lmd", () =>
    axiosLib
      .get("/api/lmd")
      .then((res) => res.data)
      .catch((lmdError) => {
        if (lmdError.response.status !== 422) throw lmdError;
      }),
  );

  const {
    data: finishing,
    error: finishingError,
    mutate: finishingMutate,
  } = useSWR("/api/finishing", () =>
    axiosLib
      .get("/api/finishing")
      .then((res) => res.data)
      .catch((finishingError) => {
        if (finishingError.response.status !== 422) throw finishingError;
      }),
  );

  const {
    data: assembly,
    error: assemblyError,
    mutate: assemblyMutate,
  } = useSWR("/api/assembly", () =>
    axiosLib
      .get("/api/assembly")
      .then((res) => res.data)
      .catch((assemblyError) => {
        if (assemblyError.response.status !== 422) throw assemblyError;
      }),
  );

  const {
    data : siteData,
    error : siteError,
    mutate : siteMutate,
  } = useSWR("/api/site", () => 
        axiosLib
            .get("/api/site")
            .then((res) => res.data)
            .catch((siteError) => {
                if (siteError.response.status !== 422) throw siteError;
            })
    )

    const {
        data : orderNumber,
        error : orderError,
        mutate: orderMutate,
    } = useSWR("/api/order-number", () => 
        axiosLib
            .get("/api/order-number")
            .then((res) => res.data)
            .catch((orderError) => {
                if (orderError.response.status !== 422) throw orderError;
            })
    )

  return {
    storage,
    storageMutate,
    disassembly,
    disassemblyMutate,
    grooving,
    groovingMutate,
    lmd,
    lmdMutate,
    finishing,
    finishingMutate,
    assembly,
    assemblyMutate,
    siteData,
    siteMutate,
    orderNumber,
    orderMutate,
  };
};
