import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  buttonStyles,
  container,
  inputStyles,
  link,
  width,
} from "../styles/main";

import { Logo, LogoText } from "../assets/Logo";
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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous error
    setStatus(null);
    setAlert(""); // Reset alert

    // Check if email or password is empty
    if (!email || !password) {
      setAlert(t("login:emailPasswordRequired")); // Show alert if either field is empty
      return;
    }

    // Call the login function
    setLoading(true); // Start loading
    login({
      setStatus,
      setErrors: () => {},
      setLoading: (loadingState) => setLoading(loadingState),
      email,
      password,
      remember: false,
    }).catch(() => {
      setLoading(false); // Reset loading if login fails
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }

    // Hide error message when user starts typing
    if (errorMessage) {
      // Only reset the errorMessage if the user starts typing
      setStatus(null);
    }

    // Hide alert message when user starts typing
    if (alert) {
      setAlert("");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center dark:bg-gray-700 xs:bg-none sm:bg-secondary lg:bg-secondary dark:lg:bg-gray-700">
      <div className="flex w-full max-w-md items-center sm:p-6 md:p-2">
        <div className={container.containerDiv}>
          <div className="flex w-52 items-center justify-center gap-1 xs:mb-8 lg:mt-4">
            <img src={kawasakiLogo} alt="kawasaki-icon" className="h-9" />
            <hr className="mx-2 flex-grow border border-t border-gray-400" />
            <LogoText />
          </div>
          <div className={inputStyles.container}>
            <h2
              className={`mb-8 text-3xl font-bold text-primaryText dark:text-gray-200 xs:text-2xl`}
            >
              {t("login:login")}
            </h2>
          </div>

          <form className={width.responsive} onSubmit={handleSubmit}>
            <div
              className={`text-center text-base text-primaryText dark:text-gray-50 xs:p-3 xs:text-sm lg:mb-0 lg:text-md`}
            >
              <label>{t("login:loginDetails")}</label>
            </div>

            <div>
              {/* Display the errorMessage from useAuthentication */}
              {errorMessage && (
                <p
                  className={`${inputStyles.inputContainer} w-full bg-red-200 text-center text-sm text-red-500`}
                >
                  {t("login:error:emailAndPassIncorrect")}
                </p>
              )}
            </div>

            {/* Email Input */}
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
              {/* Display alert message for missing email */}
              {alert && !email && (
                <p className="text-xs text-red-500">Email is required.</p>
              )}
            </div>

            {/* Password Input */}
            <div className={inputStyles.inputContainer}>
              <label className={inputStyles.label}>{t("login:password")}</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                className={inputStyles.input}
                placeholder={t("login:enterPassword")}
                autoComplete="off"
              />
              {/* Display alert message for missing password */}
              {alert && !password && (
                <p className="text-xs text-red-500">Password is required.</p>
              )}
            </div>

            <div className={`${inputStyles.container} ${link.color}`}>
              <a href="/password-reset" className="hover:underline">
                {t("login:forgotPassword")}
              </a>
            </div>

            <div className={inputStyles.inputContainer}>
              <button
                className={`${
                  loading
                    ? `${buttonStyles.disabled}`
                    : `${buttonStyles.primary} ${buttonStyles.base}`
                }`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
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
                    <span className="ms-2 text-sm">Signing in</span>
                  </div>
                ) : (
                  <span>{t("login:signIn")}</span>
                )}
              </button>
              <div className={`${inputStyles.container}`}>
                <label className="py-2 text-center text-sm">
                  {t("login:noAccount")}
                  <button
                    className="ml-1 font-semibold hover:underline"
                    type="button"
                    onClick={() => navigate("/request-account")} // Use navigate here
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
