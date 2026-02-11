import useSWR from "swr";
import { useEffect, useMemo, useState, useCallback } from "react";
import axiosLib from "../lib/axios";
import { useTranslation } from "react-i18next";
import {
  mapAuthErrorByStatus,
  mapAuthErrorMessage,
} from "../components/pages/authErrorMessages";

export const useAuthentication = ({
  middleware,
  redirectIfAuthenticated,
} = {}) => {
  const { t } = useTranslation(["common", "login"]);
  const [errorMessage, setErrorMessage] = useState(null);

  const isGuest = middleware === "guest";
  const isAuth = middleware === "auth";

  const fetchUser = useCallback(async () => {
    try {
      const res = await axiosLib.get("/api/user");
      return res.data;
    } catch (err) {
      const status = err?.response?.status;

      // ✅ Normal for guest routes (login/register): user is not signed in
      if (status === 401 || status === 419) return null;

      // ✅ Let SWR have the error (for protected routes handling)
      throw err;
    }
  }, []);

  const {
    data: user,
    error,
    mutate,
    isLoading,
  } = useSWR("/api/user", fetchUser, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });

  const csrf = () => axiosLib.get("/sanctum/csrf-cookie");

  const login = async ({ setStatus, setErrors, setLoading, ...props }) => {
    setLoading(true);
    setStatus?.(null);
    setErrors?.({});

    try {
      await csrf();
      await axiosLib.post("/login", props);

      setErrorMessage(null);
      await mutate(); // refresh user
      setLoading(false);
    } catch (err) {
      setLoading(false);

      const status = err?.response?.status;
      const backendMsg =
        err?.response?.data?.error || err?.response?.data?.message;

      const msg = backendMsg
        ? mapAuthErrorMessage(t, backendMsg)
        : mapAuthErrorByStatus(t, status);

      setErrorMessage(msg);
    }
  };

  const logout = async () => {
    try {
      await axiosLib.post("/logout");
    } catch {
      // ignore
    } finally {
      // Clear SWR cache immediately
      await mutate(null, false);

      // Hard redirect to reset app state + avoid back button showing protected pages
      window.location.replace("/login");
    }
  };

  const forgotPassword = async ({ email, setLoading }) => {
    setLoading(true);

    try {
      await csrf();
      await axiosLib.post(`/forgot-password?email=${email}`);

      setErrorMessage(
        t(
          "common:authErrors.resetLinkSent",
          "Password reset link has been sent to your email.",
        ),
      );
    } catch (err) {
      const status = err?.response?.status;
      setErrorMessage(mapAuthErrorByStatus(t, status));
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (props) => {
    await csrf();
    return axiosLib.post("/reset-password", props);
  };

  const changePassword = async ({ setLoading, setErrors, ...props }) => {
    setLoading(true);

    try {
      await csrf();
      const response = await axiosLib.post("/change-password", {
        id: user?.id,
        ...props,
      });

      setLoading(false);
      return { message: response.data.message, isSuccess: true };
    } catch (err) {
      const backendMsg = err?.response?.data?.message;
      setErrors?.({
        updatePassword: backendMsg || t("common:authErrors.unexpected"),
      });
      setLoading(false);
      return { message: backendMsg, isSuccess: false };
    }
  };

  const userId = user ? user.id : null;

  // ✅ Handle SWR user-fetch error ONLY on protected routes
  useEffect(() => {
    if (!error) return;

    const status = error?.response?.status;

    // If protected route and auth expired, logout
    if (isAuth && (status === 401 || status === 419)) {
      logout();
      return;
    }

    // Only show fetch-user errors on protected routes (not login page)
    if (isAuth) {
      setErrorMessage(mapAuthErrorByStatus(t, status));
    }
  }, [error, isAuth, t]);

  // ✅ Optional: redirect logged-in user away from guest pages
  useEffect(() => {
    if (!isGuest) return;
    if (!redirectIfAuthenticated) return;
    if (user) window.location.pathname = redirectIfAuthenticated;
  }, [isGuest, redirectIfAuthenticated, user]);

  return {
    user,
    userId,
    login,
    logout,
    isLoading,
    errorMessage,
    forgotPassword,
    resetPassword,
    changePassword,
  };
};
