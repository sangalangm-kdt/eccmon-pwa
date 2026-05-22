import axiosLib from "../lib/axios";
import useSWR from "swr";

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
        .then((res) => res.data)
        .catch((error) => {
          console.error(error);
          if (error.response.status !== 409) throw error;
        }),
    {
      revalidateOnFocus: false,
    },
  );

  const addUpdate = async (input, status, setModalOpen, setLoading) => {
    setLoading(true);

    const updateData = {
      serialNumber: input.serialNumber,
      process: status,
      location: input.location,
      cycle: input.cycle,
      dateDone: input.dateDone ? input.dateDone : null,
      otherDetails: input.otherDetails ? input.otherDetails : null,
    };

    await csrf();

    axiosLib
      .post("/api/cylinder-update", updateData)
      .then((res) => {
        console.log(res);
        setModalOpen(true);
        setLoading(false);
        // navigate("/qrscanner");
      })
      .catch((error) => {
        console.error("Error: ", error);
        if (error.response.status !== 422) throw error;
        setLoading(false);
      });
  };

  return {
    cylinder,
    isLoading: params.enabled === false ? true : isLoading,
    mutate,
    addUpdate,
  };
};
