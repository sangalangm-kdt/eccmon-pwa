import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useTranslationUtils from "../../components/utils/useTranslationUtils"; // Import the utility
import {
  buttonStyles,
  container,
  inputStyles,
  link,
  margin,
  padding,
  textStyles,
  width,
} from "../styles/main";

import { Logo, LogoText } from "../assets/Logo";
import { useAuthentication } from "../../hooks/auth";

const Login = () => {
  const { t } = useTranslation(["login", "common"]);
  const utils = useTranslationUtils("login"); // Use the utility with the 'login' namespace
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
      <div className="flex w-full max-w-md items-center sm:p-6 md:p-2 lg:p-0">
        <div className={container.containerDiv}>
          <div className={`${padding.responsive} ${inputStyles.container}`}>
            <Logo />
            <LogoText />
          </div>
          <div className={inputStyles.container}>
            <h2 className={`${textStyles.heading} ${margin.responsive}`}>
              {utils.Login} {/* Access translations directly */}
            </h2>
          </div>

          <form className={width.responsive} onSubmit={handleSubmit}>
            <div
              className={`text-center text-base text-primaryText xs:text-sm xs:p-3 lg:text-base lg:p-0`}
            >
              <label>{utils.LoginDetails}</label>{" "}
              {/* Access translation directly */}
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
              <label className={inputStyles.label}>{utils.Email}</label>{" "}
              {/* Access translation directly */}
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputStyles.input}
                placeholder={utils.EnterEmail}
                autoComplete="off"
              />
            </div>
            <div className={inputStyles.inputContainer}>
              <label className={inputStyles.label}>{utils.Password}</label>{" "}
              {/* Access translation directly */}
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputStyles.input}
                placeholder={utils.EnterPassword}
                autoComplete="off"
              />
            </div>
            <div className={`${inputStyles.container} ${link.color}`}>
              <a href="/forgotpass" className="hover:underline">
                {utils.ForgotPassword} {/* Access translation directly */}
              </a>
            </div>
            <div className={inputStyles.inputContainer}>
              <button
                type="submit"
                className={`${buttonStyles.primary} ${buttonStyles.base}`}
              >
                {utils.SignIn} {/* Access translation directly */}
              </button>
              <div className={`${inputStyles.container} `}>
                <label className="text-base py-2 text-center">
                  {utils.NoAccount} {/* Access translation directly */}
                  <a href="blank" className="font-semibold hover:underline">
                    {utils.RequestNow} {/* Access translation directly */}
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
