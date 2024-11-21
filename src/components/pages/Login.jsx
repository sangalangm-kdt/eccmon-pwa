import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/auth/authSlice"; //nasa path po na to yung pagcconect sa server
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { t, i18n } = useTranslation(["login", "common"]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const authError = useSelector((state) => state.auth.error);

  // UseEffect to update error state when authError changes
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // UseEffect to update error message when language changes
  useEffect(() => {
    if (authError) {
      setError(t(authError));
    }
  }, [i18n.language, authError, t]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await dispatch(login({ email, password, t })).unwrap();

      if (response && response.error) {
        setError(response.error);
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(authError || error.message || t("common:anErrorOccured"));
      console.error("Login error:", error);
    }
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
              {t("login:login")}
            </h2>
          </div>

          <form className={width.responsive} onSubmit={handleSubmit}>
            <div
              className={`text-center text-base text-primaryText xs:text-sm xs:p-3 lg:text-base lg:p-0`}
            >
              <label>{t("login:loginDetails")}</label>
            </div>
            <div>
              {error && (
                <p
                  className={`${inputStyles.inputContainer} bg-red-200 text-red-500 w-full text-sm text-center`}
                >
                  {error}
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
                disabled={loading}
              >
                {loading ? t("common:loading") : t("login:signIn")}
              </button>
              <div className={`${inputStyles.container} `}>
                <label className="text-sm py-2">
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
