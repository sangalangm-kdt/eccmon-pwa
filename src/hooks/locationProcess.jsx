/* eslint-disable no-unused-vars */
import axiosLib from "../lib/axios";
import useSWR from "swr";

export const useLocationProcess = () => {
    const csrf = () => axiosLib.get("/sanctum/csrf-cookie");

    const {
        data: storage,
        error,
        isLoading: isStorageLoading,
        mutate: storageMutate,
    } = useSWR("/api/storages", () =>
        axiosLib
            .get("/api/storages")
            .then((res) => res.data)
            .catch((error) => {
                if (error.response.status !== 422) throw error;
            })
    );

    const {
        data: disassembly,
        error: disassemblyError,
        isLoading: isDisassemblyLoading,
        mutate: disassemblyMutate,
    } = useSWR("/api/disassemblyError", () =>
        axiosLib
            .get("/api/disassembly")
            .then((res) => res.data)
            .catch((disassemblyError) => {
                if (disassemblyError.response.status !== 422)
                    throw disassemblyError;
            })
    );

    const {
        data: grooving,
        error: groovingError,
        isLoading: isGroovingLoading,
        mutate: groovingMutate,
    } = useSWR("/api/grooving", () =>
        axiosLib
            .get("/api/grooving")
            .then((res) => res.data)
            .catch((groovingError) => {
                if (groovingError.response.status !== 422) throw groovingError;
            })
    );

    const {
        data: lmd,
        error: lmdError,
        isLoading: isLmdLoading,
        mutate: lmdMutate,
    } = useSWR("/api/lmd", () =>
        axiosLib
            .get("/api/lmd")
            .then((res) => res.data)
            .catch((lmdError) => {
                if (lmdError.response.status !== 422) throw lmdError;
            })
    );

    const {
        data: finishing,
        error: finishingError,
        isLoading: isFinishingLoading,
        mutate: finishingMutate,
    } = useSWR("/api/finishing", () =>
        axiosLib
            .get("/api/finishing")
            .then((res) => res.data)
            .catch((finishingError) => {
                if (finishingError.response.status !== 422)
                    throw finishingError;
            })
    );

    const {
        data: assembly,
        error: assemblyError,
        isLoading: isAssemblyLoading,
        mutate: assemblyMutate,
    } = useSWR("/api/assembly", () =>
        axiosLib
            .get("/api/assembly")
            .then((res) => res.data)
            .catch((assemblyError) => {
                if (assemblyError.response.status !== 422) throw assemblyError;
            })
    );

    const {
        data: siteData,
        error: siteError,
        isLoading: isSiteLoading,
        mutate: siteMutate,
    } = useSWR("/api/site", () =>
        axiosLib
            .get("/api/site")
            .then((res) => res.data)
            .catch((siteError) => {
                if (siteError.response.status !== 422) throw siteError;
            })
    );

    const {
        data: orderNumber,
        error: orderError,
        isLoading: isOrderLoading,
        mutate: orderMutate,
    } = useSWR("/api/order-number", () =>
        axiosLib
            .get("/api/order-number")
            .then((res) => res.data)
            .catch((orderError) => {
                if (orderError.response.status !== 422) throw orderError;
            })
    );

    return {
        storage,
        isStorageLoading,
        storageMutate,

        disassembly,
        isDisassemblyLoading,
        disassemblyMutate,

        grooving,
        isGroovingLoading,
        groovingMutate,

        lmd,
        isLmdLoading,
        lmdMutate,

        finishing,
        isFinishingLoading,
        finishingMutate,

        assembly,
        isAssemblyLoading,
        assemblyMutate,

        siteData,
        isSiteLoading,
        siteMutate,

        orderNumber,
        isOrderLoading,
        orderMutate,
    };
};
