import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TextInput } from "../../constants/TextInput";
import GuestAppChrome from "../../constants/GuestAppChrome";
import { useAuthentication } from "../../../hooks/auth";
import { getValidationErrorKey } from "../../utils/authErrors";

const primaryButtonClassName =
  "ecc-touch-btn flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-cyan-to-blue px-4 py-3 text-base font-semibold text-white transition-all hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [messageKey, setMessageKey] = useState("");
  const [errorKey, setErrorKey] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation(["common", "login"]);

  const { forgotPassword } = useAuthentication({
    middleware: "guest",
    redirectIfAuthenticated: "/",
  });

  useEffect(() => {
    setMessageKey("");
    setErrorKey("");
    setFieldErrors({});
  }, [location.pathname, i18n.language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessageKey("");
    setErrorKey("");
    setFieldErrors({});

    const emailError = getValidationErrorKey("email", email);
    if (emailError) {
      setFieldErrors({ email: emailError });
      return;
    }

    const result = await forgotPassword({ email, setLoading });
    if (result?.isSuccess) {
      setMessageKey(result.messageKey);
    } else {
      setErrorKey(result?.messageKey || "common:authErrors.server");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setMessageKey("");
    setErrorKey("");
    setFieldErrors((prevErrors) => {
      const nextErrors = { ...prevErrors };
      delete nextErrors.email;
      return nextErrors;
    });
  };

  return (
    <GuestAppChrome>
      <div className="w-full max-w-[30rem]">
        <div className="border-none bg-transparent p-0 shadow-none md:rounded-2xl md:border md:border-gray-200/90 md:bg-white/95 md:p-8 md:shadow-xl md:shadow-gray-300/25 md:backdrop-blur-sm dark:md:border-gray-600/80 dark:md:bg-gray-800/95 dark:md:shadow-black/30">
          <div className="mb-4 text-center md:mb-5">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50 md:text-2xl">
              {t("authFeedback.forgotPasswordTitle")}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {t("authFeedback.forgotPasswordDescription")}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {errorKey ? (
              <div
                className="rounded-xl bg-red-50 px-3 py-2.5 text-center text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300 md:border md:border-red-200 md:px-4 md:py-3 dark:md:border-red-900/50"
                role="alert"
              >
                {t(errorKey)}
              </div>
            ) : null}

            {messageKey ? (
              <div
                className="rounded-xl bg-green-50 px-3 py-2.5 text-center text-sm font-medium text-green-700 dark:bg-green-950/40 dark:text-green-300 md:border md:border-green-200 md:px-4 md:py-3 dark:md:border-green-900/50"
                role="status"
              >
                {t(messageKey)}
              </div>
            ) : null}

            <TextInput
              variant="auth"
              label={t("authFeedback.emailAddress")}
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder={t("reqAcc.enterEmail")}
              error={fieldErrors.email ? t(fieldErrors.email) : ""}
            />

            <button
              type="submit"
              className={primaryButtonClassName}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  <span>{t("authFeedback.sendingResetLink")}</span>
                </span>
              ) : (
                t("authFeedback.sendResetLink")
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-300">
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              {t("authFeedback.backToSignIn")}
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-gray-400 dark:text-gray-500 sm:mt-5">
          {t("login:kawasakiCopyright")}
        </p>
      </div>
    </GuestAppChrome>
  );
};

export default ForgotPassword;
