/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import axiosLib from "../lib/axios";
import {
  AUTH_ERROR_KEYS,
  normalizeAuthError,
} from "../components/utils/authErrors";

export const useAuthentication = ({
  middleware,
  redirectIfAuthenticated,
} = {}) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorKey, setErrorKey] = useState(null);

  const {
    data: user,
    error,
    mutate,
    isLoading,
  } = useSWR(
    "/api/user",
    async () => {
      try {
        const response = await axiosLib.get("/api/user");
        return response.data;
      } catch (error) {
        const status = error.response?.status;
        if (status === 401 || status === 409) {
          return null;
        }

        setErrorKey(AUTH_ERROR_KEYS.server);
        return null;
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );

  const csrf = () => axiosLib.get("/sanctum/csrf-cookie");

  const login = async ({ setStatus, setErrors, setLoading, ...props }) => {
    setLoading(true);
    setStatus(null);
    setErrorMessage(null);
    setErrorKey(null);

    try {
      await csrf();
      await axiosLib.post("/login", props);
      await mutate();
    } catch (error) {
      const status = error.response?.status;
      const normalizedError = normalizeAuthError(error);

      if (status === 422 || status === 403) {
        setErrorKey(normalizedError.general);
      } else if (status === 409) {
        setErrorKey(AUTH_ERROR_KEYS.invalidCredentials);
      } else {
        setErrorKey(normalizedError.general);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (!error) {
        await axiosLib.post("/logout");
        await mutate(null, false);
      }
    } catch {
      await mutate(null, false);
    } finally {
      window.location.pathname = "/login";
    }
  };

  const forgotPassword = async ({ email, setLoading }) => {
    setLoading(true);
    setErrorMessage(null);
    setErrorKey(null);

    try {
      await csrf();
      const params = new URLSearchParams({ email });
      await axiosLib.post(`/forgot-password?${params.toString()}`);
      return { messageKey: "common:authFeedback.passwordResetSent", isSuccess: true };
    } catch (error) {
      const normalizedError = normalizeAuthError(error);
      setErrorKey(normalizedError.general);
      return { messageKey: normalizedError.general, isSuccess: false };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async ({ ...props }) => {
    try {
      await csrf();
      const response = await axiosLib.post("/reset-password", props);
      return {
        messageKey: "common:authFeedback.passwordResetSuccess",
        message: response.data?.message,
        isSuccess: true,
      };
    } catch (error) {
      const normalizedError = normalizeAuthError(error);
      return {
        messageKey: normalizedError.general || "common:authFeedback.passwordResetError",
        message: error.response?.data?.message,
        isSuccess: false,
      };
    }
  };

  const changePassword = async ({ setLoading, setErrors, ...props }) => {
    setLoading(true);
    try {
      await csrf();
      const response = await axiosLib.post("/change-password", {
        id: user.id,
        ...props,
      });
      return { message: response.data.message, isSuccess: true };
    } catch (error) {
      const normalizedError = normalizeAuthError(error);
      setErrors(normalizedError.fields);
      return {
        messageKey:
          normalizedError.general || "common:authFeedback.changePasswordError",
        message: error.response?.data?.message,
        isSuccess: false,
      };
    } finally {
      setLoading(false);
    }
  };

  const userId = user ? user.id : null;

  useEffect(() => {
    if (middleware === "auth" && error) {
      logout();
    }
  }, [user, error]);

  useEffect(() => {
    if (error) {
      setErrorKey(AUTH_ERROR_KEYS.server);
    }
  }, [error]);

  const clearAuthError = useCallback(() => {
    setErrorMessage(null);
    setErrorKey(null);
  }, []);

  return {
    user,
    userId,
    login,
    logout,
    isLoading,
    errorMessage,
    errorKey,
    clearAuthError,
    forgotPassword,
    resetPassword,
    changePassword,
  };
};
