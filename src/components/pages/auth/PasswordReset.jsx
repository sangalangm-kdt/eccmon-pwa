import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthentication } from "../../../hooks/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = () => {
  const { t } = useTranslation(["common", "login"]);
  const { forgotPassword, errorMessage } = useAuthentication({
    middleware: "guest",
    redirectIfAuthenticated: "/",
  });

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const trimmedEmail = useMemo(() => email.trim(), [email]);
  const emailValid = useMemo(() => EMAIL_RE.test(trimmedEmail), [trimmedEmail]);

  const emailError = useMemo(() => {
    if (!touched) return "";
    if (!trimmedEmail)
      return t("login:errors.emailRequired", "Email is required.");
    if (!emailValid)
      return t("login:errors.invalidEmail", "Please enter a valid email.");
    return "";
  }, [t, touched, trimmedEmail, emailValid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setSuccessMessage("");

    if (!trimmedEmail || !emailValid) return;

    // Your hook sets errorMessage internally; we show a local success banner too.
    try {
      await forgotPassword({ email: trimmedEmail, setLoading });
      // If your hook sets a success message in errorMessage, you can keep that too,
      // but having a dedicated success banner looks cleaner.
      setSuccessMessage(
        t(
          "common:authErrors.resetLinkSent",
          "Password reset link has been sent to your email.",
        ),
      );
    } catch {
      // no-op: hook already maps & sets errorMessage
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4 dark:bg-gray-800">
      <div className="w-full max-w-md rounded-2xl border border-gray-200/70 bg-white p-6 shadow-lg dark:border-gray-700/70 dark:bg-gray-900">
        <h1 className="text-center text-xl font-bold text-gray-800 dark:text-gray-100">
          {t("login:forgotPassword", "Forgot password?")}
        </h1>

        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          {t("login:forgotPasswordHelp", "You can reset your password here.")}
        </p>

        {/* Success banner */}
        {successMessage && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200">
            {successMessage}
          </div>
        )}

        {/* Error banner from hook */}
        {errorMessage && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-left text-sm font-medium text-gray-700 dark:text-gray-200">
              {t("login:email", "Email")}
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="you@global.kawasaki.com"
              className={`w-full rounded-lg border bg-transparent p-3 text-sm text-gray-800 outline-none transition dark:text-gray-100 ${
                emailError
                  ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-900/30"
                  : "border-gray-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:focus:ring-cyan-900/30"
              } dark:bg-gray-800`}
              autoComplete="off"
            />

            {emailError && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-300">
                {emailError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !!emailError}
            className={`w-full rounded-lg bg-cyan-to-blue px-4 py-3 text-sm font-semibold text-white transition ${loading || emailError ? "cursor-not-allowed opacity-60" : "hover:opacity-95"}`}
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin text-white/80"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    opacity="0.25"
                  />
                  <path
                    d="M22 12a10 10 0 0 1-10 10"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
                {t("login:resetting", "Resetting...")}
              </span>
            ) : (
              t("login:resetPassword", "Reset password")
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-gray-600 dark:text-gray-300">
          <Link
            to="/login"
            className="font-semibold text-cyan-500 hover:underline"
          >
            {t("login:backToLogin", "Back to login")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
