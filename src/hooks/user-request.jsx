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
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.status === 422) {
          console.log(error.response.data.message);
        } else {
          console.log(error.response.data.message);
        }
      });
  };

  return { userRequest, mutate, register };
};
