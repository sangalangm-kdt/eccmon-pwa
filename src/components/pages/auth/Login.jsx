import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import logoText from "../../assets/svg/logotext_revised3.svg";
import GuestAppChrome from "../../constants/GuestAppChrome";
import { useAuthentication } from "../../../hooks/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { AUTH_ERROR_KEYS } from "../../utils/authErrors";

const inputClassName =
  "ecc-touch-input w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-400 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-50 dark:placeholder:text-gray-500 md:border-gray-300 md:py-3 md:text-sm md:shadow-sm md:focus:ring-primary/25 md:dark:bg-gray-900/50";

const labelClassName =
  "mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-100";

const Login = () => {
  const { t, i18n } = useTranslation(["login", "common"]);
  const { login, errorKey, clearAuthError } = useAuthentication({
    middleware: "guest",
    redirectIfAuthenticated: "/",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    clearAuthError();
    setStatus(null);
    setFieldErrors({});
  }, [location.pathname, i18n.language]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus(null);
    setFieldErrors({});
    clearAuthError();

    const nextFieldErrors = {};
    if (!email) nextFieldErrors.email = AUTH_ERROR_KEYS.emailRequired;
    if (!password) nextFieldErrors.password = AUTH_ERROR_KEYS.passwordRequired;

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setLoading(true);
    login({
      setStatus,
      setErrors: () => {},
      setLoading: (loadingState) => setLoading(loadingState),
      email,
      password,
      remember: false,
    }).catch(() => {
      setLoading(false);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }

    clearAuthError();
    setStatus(null);
    setFieldErrors((prevErrors) => {
      const nextErrors = { ...prevErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  return (
    <GuestAppChrome>
      <div className="w-full max-w-md">
        <div className="border-none bg-transparent p-0 shadow-none md:rounded-2xl md:border md:border-gray-200/90 md:bg-white/95 md:p-8 md:shadow-xl md:shadow-gray-300/25 md:backdrop-blur-sm dark:md:border-gray-600/80 dark:md:bg-gray-800/95 dark:md:shadow-black/30">
          <div className="mb-2.5 flex justify-center md:mb-4 md:border-b md:border-gray-100 md:pb-4 dark:md:border-gray-700">
            <img
              src={logoText}
              alt="ECCMon"
              className="h-9 w-auto max-w-[11rem] object-contain sm:h-10 sm:max-w-[11.5rem] md:h-10 lg:h-11 lg:max-w-[13rem]"
            />
          </div>

          <div className="mb-3.5 text-center md:mb-4">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50 md:text-2xl">
              {t("login:signIn")}
            </h1>
            <p className="mt-1 text-sm leading-snug text-gray-600 dark:text-gray-300 md:mt-1.5 md:leading-relaxed">
              {t("login:loginDetails")}
            </p>
          </div>

          <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit} noValidate>
            {errorKey ? (
              <div
                className="rounded-xl bg-red-50 px-3 py-2.5 text-center text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300 md:border md:border-red-200 md:px-4 md:py-3 dark:md:border-red-900/50"
                role="alert"
              >
                {t(errorKey)}
              </div>
            ) : null}

            <div>
              <label htmlFor="login-email" className={labelClassName}>
                {t("login:email")}
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                className={inputClassName}
                placeholder={t("login:enterEmail")}
                autoComplete="email"
                aria-invalid={Boolean(fieldErrors.email)}
              />
              {fieldErrors.email ? (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {t(fieldErrors.email)}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="login-password" className={labelClassName}>
                {t("login:password")}
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                  className={`${inputClassName} pr-12`}
                  placeholder={t("login:enterPassword")}
                  autoComplete="current-password"
                  aria-invalid={Boolean(fieldErrors.password)}
                />
                <button
                  type="button"
                  className="ecc-touch-btn absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  aria-label={
                    passwordVisible ? "Hide password" : "Show password"
                  }
                >
                  {passwordVisible ? (
                    <IoEyeOffOutline size={20} />
                  ) : (
                    <IoEyeOutline size={20} />
                  )}
                </button>
              </div>
              {fieldErrors.password ? (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {t(fieldErrors.password)}
                </p>
              ) : null}
            </div>

            <div className="pt-0.5 text-center">
              <a
                href="/password-reset"
                className="text-sm font-medium text-primary hover:underline"
              >
                {t("login:forgotPassword")}
              </a>
            </div>

            <button
              type="submit"
              className="ecc-touch-btn flex min-h-[48px] w-full items-center justify-center rounded-xl bg-cyan-to-blue px-4 py-3.5 text-base font-semibold text-white transition-all hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 md:py-3 md:shadow-md md:shadow-cyan-500/20 md:disabled:shadow-none"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 animate-spin fill-white text-white/30"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span>{t("login:signingIn")}</span>
                </span>
              ) : (
                t("login:signIn")
              )}
            </button>

            <p className="pt-0.5 text-center text-sm text-gray-600 dark:text-gray-300">
              {t("login:noAccount")}
              <button
                type="button"
                className="ml-1 font-semibold text-primary hover:underline"
                onClick={() => navigate("/request-account")}
              >
                {t("login:requestNow")}
              </button>
            </p>
          </form>
        </div>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-gray-400 dark:text-gray-500 sm:mt-5">
          {t("login:kawasakiCopyright")}
        </p>
      </div>
    </GuestAppChrome>
  );
};

export default Login;
