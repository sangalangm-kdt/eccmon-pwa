/* eslint-disable no-unused-vars */
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
import { useAuthentication } from "../../hooks/auth";

const Login = () => {
  const { t } = useTranslation(["login", "common"]);
  const { login } = useAuthentication({
    middleware: "guest",
    redirectIfAuthenticated: "/",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");

    login({
      setErrors,
      setStatus,
      email,
      password,
      remember: false,
    });
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen lg:bg-secondary xs:bg-none ">
      <div className="flex w-full max-w-md items-center sm:p-6 md:p-2 ">
        <div className={container.containerDiv}>
          <div className="flex justify-center items-center w-52 xs:mb-8 lg:mt-4">
            <Logo />
            <LogoText />
          </div>
          <div className={inputStyles.container}>
            <h2
              className={`text-3xl text-primaryText font-bold mb-8 xs:text-2xl`}
            >
              {t("login:login")}
            </h2>
          </div>

          <form className={width.responsive} onSubmit={handleSubmit}>
            <div
              className={`text-center text-base text-primaryText xs:text-sm xs:p-3 lg:text-md lg:mb-0`}
            >
              <label>{t("login:loginDetails")}</label>
            </div>
            <div>
              {errors && (
                <p
                  className={`${inputStyles.inputContainer} bg-red-200 text-red-500 w-full text-sm text-center`}
                >
                  {errors}
                </p>
              )}
            </div>
            <div className={inputStyles.inputContainer}>
              <label className={inputStyles.label}>{t("login:email")}</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputStyles.input}
                placeholder={t("login:enterEmail")}
                autoComplete="off"
              />
            </div>
            <div className={inputStyles.inputContainer}>
              <label className={inputStyles.label}>{t("login:password")}</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputStyles.input}
                placeholder={t("login:enterPassword")}
                autoComplete="off"
              />
            </div>
            <div className={`${inputStyles.container} ${link.color}`}>
              <a href="/forgotpass" className="hover:underline">
                {t("login:forgotPassword")}
              </a>
            </div>
            <div className={inputStyles.inputContainer}>
              <button
                type="submit"
                className={`${buttonStyles.primary} ${buttonStyles.base}`}
                // disabled={loading}
              >
                {t("login:signIn")}
              </button>
              <div className={`${inputStyles.container}`}>
                <label className="text-sm py-2 text-center">
                  {t("login:noAccount")}
                  <a href="blank" className="font-semibold hover:underline">
                    {t("login:requestNow")}
                  </a>
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
