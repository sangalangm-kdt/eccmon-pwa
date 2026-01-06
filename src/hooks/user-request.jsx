import { useNavigate } from "react-router-dom";
import axiosLib from "../lib/axios";
import useSWR from "swr";

export const useUserRequest = () => {
  const csrf = () => axiosLib.get("/sanctum/csrf-cookie");

  const {
    data: userRequest,
    error,
    mutate,
  } = useSWR("/api/user-request", () =>
    axiosLib
      .get("/api/user-request")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;
      }),
  );

  const register = async ({ ...props }) => {
    await csrf();
    console.log("clicked", props);
    return axiosLib
      .post("/api/user-request", props)
      .then((response) => {
        console.log("Request successfully!");
        return { message: "Request successfully!", isSuccess: true };
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.status === 422) {
          console.log(error.response.data.message);
        } else {
          console.log(error.response.data.message);
        }
        const firstKey = Object.keys(error.response.data.errors)[0]; // "user_id"
        const firstError = error.response.data.errors[firstKey][0].includes(
          "user id",
        )
          ? "The employee number has already been taken."
          : error.response.data.errors[firstKey][0];
        console.log(firstError);
        return {
          message: firstError,
          isSuccess: false,
        };
      });
  };

  return { userRequest, mutate, register };
};
