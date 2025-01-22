/* eslint-disable react-hooks/exhaustive-deps */
// import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { useEffect, useState } from "react";
import axiosLib from "../lib/axios";
// import { useNavigate } from "react-router-dom";

export const useAuthentication = ({
  middleware,
  redirectIfAuthenticated,
} = {}) => {
  // const navigation = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

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
          if (error.response.status !== 409) {
            setErrorMessage("Error fetching user data.");
          }

          // navigation("/login");
        }),
    {
      revalidateOnFocus: false, // Prevent unnecessary revalidation
      revalidateOnReconnect: false,
      shouldRetryOnError: false, // Prevent retries on errors
    },
  );

  const csrf = () => axiosLib.get("/sanctum/csrf-cookie");

  const login = async ({ setStatus, setLoading, ...props }) => {
    setLoading(true); // Start loading
    await csrf();
    setStatus(null);

    try {
      await axiosLib.post("/login", props);
      mutate(); // Update user data
      setLoading(false); // Stop loading after successful login
    } catch (error) {
      setLoading(false); // Reset loading on error

      if (error.response) {
        if (error.response.status === 422 || error.response.status === 403) {
          setErrorMessage(error.response.data.error);
        } else if (error.response.status === 409) {
          setErrorMessage("User already logged in.");
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      }
    }
  };

  const logout = async () => {
    if (!error) {
      await axiosLib.post("/logout").then(() => mutate());
    }

    window.location.pathname = "login";
  };

  const forgotPassword = async ({ email, setLoading }) => {
    setLoading(true);
    await csrf();
    console.log("clicked");
    console.log(email);
    return axiosLib
      .post(`/forgot-password?email=${email}`)
      .then((response) => {
        // toast.success("Password reset link sent to your email!", {
        //   position: "top-center",
        // });
        setErrorMessage("Password reset link has been sent to your email.");
        console.log("Password reset link sent to your email!");
        console.log(response);

        setLoading(false);
      })
      .catch((error) => {
        if (error.response?.status === 422) {
          // toast.error(error.response.data.message, {
          //   position: "top-center",
          // });

          console.log("Wrong Password");
        } else {
          console.log("An unexpected error occurred.");
          // toast.error("An unexpected error occurred.", {
          //   position: "top-center",
          // });
        }
        setLoading(false);
      });
  };

  const resetPassword = async ({ ...props }) => {
    await csrf();
    console.log("clicked", props);
    return axiosLib
      .post("/reset-password", props)
      .then((response) => {
        console.log("Reset password successfully!");
        console.log(response);
      })
      .catch((error) => {
        if (error.response?.status === 422) {
          console.log(error.response.data.message);
        } else {
          console.log(error.response.data.message);
        }
      });
  };

  const userId = user ? user.id : null;

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user)
      if (middleware === "auth" && error)
        // navigation(redirectIfAuthenticated);

        logout();
  }, [user, error]);

  useEffect(() => {
    if (error) {
      setErrorMessage("Error fetching user data.");
    }
  }, [error]);

  return {
    user,
    userId,
    login,
    logout,
    isLoading,
    errorMessage,
    forgotPassword,
    resetPassword,
  };
};
