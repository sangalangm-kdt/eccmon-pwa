import axiosLib from "../lib/axios";
import useSWR from "swr";
import { mapMessageToErrorKey } from "../components/utils/authErrors";

export const useUserRequest = () => {
  const csrf = () => axiosLib.get("/sanctum/csrf-cookie");

  const {
    data: userRequest,
    error,
    mutate,
  } = useSWR(
    "/api/user-request",
    () =>
      axiosLib
        .get("/api/user-request")
        .then((res) => res.data)
        .catch((error) => {
          if (error.response.status !== 409) throw error;
        }),
    {
      revalidateOnFocus: false,
    },
  );

  const register = async ({ ...props }) => {
    await csrf();
    console.log("clicked", props);
    return axiosLib
      .post("/api/user-request", props)
      .then((response) => {
        console.log("Request successfully!");
        return {
          messageKey: "common:authFeedback.requestSuccess",
          message: response.data?.message,
          isSuccess: true,
        };
      })
      .catch((error) => {
        console.log(error);
        const errors = error.response?.data?.errors || {};
        const firstKey = Object.keys(errors)[0];
        const firstError = firstKey
          ? errors[firstKey][0].includes("user id")
            ? "The employee number has already been taken."
            : errors[firstKey][0]
          : error.response?.data?.message || "Request failed.";
        console.log(firstError);
        return {
          messageKey: mapMessageToErrorKey(firstError, firstKey),
          message: firstError,
          isSuccess: false,
        };
      });
  };

  return { userRequest, mutate, register };
};
