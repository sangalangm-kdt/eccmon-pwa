/* eslint-disable react-hooks/exhaustive-deps */
// import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { useEffect } from "react";
import axiosLib from "../lib/axios";

export const useAuthentication = ({
  middleware,
  redirectIfAuthenticated,
} = {}) => {
  // const navigation = useNavigate();

  const {
    data: user,
    error,
    mutate,
    isLoading,
  } = useSWR(
    "/api/user",
    () =>
      axiosLib
        .get("/api/user")
        .then((res) => res.data)
        .catch((error) => {
          if (error.response.status !== 409) throw error;

          // navigation("/login");
        }),
    {
      revalidateOnFocus: false, // Prevent unnecessary revalidation
      revalidateOnReconnect: false,
      shouldRetryOnError: false, // Prevent retries on errors
    },
  );

  const csrf = () => axiosLib.get("/sanctum/csrf-cookie");

  const login = async ({ setStatus, ...props }) => {
    await csrf();
    setStatus(null);

    axiosLib
      .post("/login", props)
      .then((res) => {
        console.log(res);
        mutate();
      })
      .catch((error) => {
        if (error.response.status !== 409) throw error;
      });
  };

  const logout = async () => {
    if (!error) {
      await axiosLib.post("/logout").then(() => mutate());
    }

    window.location.pathname = "login";
  };

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user)
      if (middleware === "auth" && error)
        // navigation(redirectIfAuthenticated);

        logout();
  }, [user, error]);

  return {
    user,
    login,
    logout,
    isLoading,
  };
};
