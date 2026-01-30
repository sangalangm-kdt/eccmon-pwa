import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import {
  buttonStyles,
  container,
  inputStyles,
  link,
  width,
  colors,
} from "../styles/main";

import { LogoText } from "../assets/Logo";
import kawasakiLogo from "../assets/kawasaki-png-kawasaki-logo-1612.png";
import { useAuthentication } from "../../hooks/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation(["login", "common"]);
  const { login, errorMessage } = useAuthentication({
    middleware: "guest",
    redirectIfAuthenticated: "/",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus(null);
    setAlert("");

    if (!email && !password) {
      setAlert(t("login:errors.emailPasswordRequired"));
      return;
    }
    if (!email) {
      setAlert(t("login:errors.emailRequired"));
      return;
    }
    if (!password) {
      setAlert(t("login:errors.passwordRequired"));
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

    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);

    if (alert) setAlert("");
    if (status) setStatus(null);
  };

  return (
    <div className={`min-h-screen w-full ${colors.page}`}>
      {/* ✅ NOT vertically centered; let it flow + scroll if needed */}
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-6 sm:px-6">
        {/* ✅ Scrollable card with safe bottom padding for your bottom language bar */}
        <div
          className={`${container.containerDiv} max-h-[calc(100vh-120px)] w-full overflow-y-auto px-6 py-8 pb-28 xs:px-5 xs:py-7`}
        >
          {/* Header */}
          <div className="flex w-52 items-center justify-center gap-1 xs:mb-6 lg:mt-2">
            <img src={kawasakiLogo} alt="kawasaki-icon" className="h-9" />
            <hr className="mx-2 flex-grow border border-gray-300 dark:border-gray-600" />
            <LogoText />
          </div>

          <div className={inputStyles.container}>
            <h2 className="mb-6 text-3xl font-bold text-gray-800 dark:text-gray-100 xs:text-2xl">
              {t("login:login")}
            </h2>
          </div>

          <form className={width.responsive} onSubmit={handleSubmit}>
            <div className="text-center text-base text-gray-700 dark:text-gray-100 xs:p-3 xs:text-sm lg:text-md">
              <label>{t("login:loginDetails")}</label>
            </div>

            {/* ✅ backend / auth error */}
            {errorMessage && (
              <p
                className={`${inputStyles.inputContainer} ${inputStyles.errorBanner}`}
              >
                {errorMessage}
              </p>
            )}

            {/* Email */}
            <div className={inputStyles.inputContainer}>
              <label className={inputStyles.label}>{t("login:email")}</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                className={inputStyles.input}
                placeholder={t("login:enterEmail")}
                autoComplete="off"
              />
              {alert && !email && (
                <p className="text-xs text-red-600 dark:text-red-300">
                  {t("login:errors.emailRequired")}
                </p>
              )}
            </div>

            {/* Password */}
            <div className={inputStyles.inputContainer}>
              <label className={inputStyles.label}>{t("login:password")}</label>

              <div className="relative w-full">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                  className={inputStyles.input}
                  placeholder={t("login:enterPassword")}
                  autoComplete="off"
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
                  onClick={() => setPasswordVisible((v) => !v)}
                >
                  {passwordVisible ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>

              {alert && !password && (
                <p className="text-xs text-red-600 dark:text-red-300">
                  {t("login:errors.passwordRequired")}
                </p>
              )}
            </div>

            <div className={`${inputStyles.container} ${link.color}`}>
              <a href="/password-reset" className="hover:underline">
                {t("login:forgotPassword")}
              </a>
            </div>

            {/* Submit */}
            <div className={inputStyles.inputContainer}>
              <button
                className={`${loading ? buttonStyles.disabled : `${buttonStyles.primary} ${buttonStyles.base}`}`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
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
                    <span className="text-sm">
                      {t("login:signingIn") || "Signing in"}
                    </span>
                  </div>
                ) : (
                  <span>{t("login:signIn")}</span>
                )}
              </button>

              {/* ✅ This will no longer be hidden */}
              <div
                className={`${inputStyles.container} py-2 text-center text-sm text-gray-700 dark:text-gray-100`}
              >
                <label className="5 py-2 text-center text-sm">
                  {t("login:noAccount")}
                  <button
                    className="ml-1 font-semibold text-cyan-400 hover:underline"
                    type="button"
                    onClick={() => navigate("/request-account")}
                  >
                    {t("login:requestNow")}
                  </button>
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
