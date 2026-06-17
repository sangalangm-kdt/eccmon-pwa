import React from "react";
import { useTranslation } from "react-i18next";
import GuestAppChrome from "../GuestAppChrome";
import "./preloader.scss";
import LogoPreloader from "./logo.svg";

const Preloader = () => {
  const { t } = useTranslation("common");

  return (
    <GuestAppChrome>
      <div className="flex flex-col items-center gap-5 sm:gap-6">
        <div className="container-logo">
          <div className="📦">
            <img src={LogoPreloader} className="logo-preloader" alt="" />
          </div>
          {[...Array(5)].map((_, index) => (
            <div className="📦" key={index} />
          ))}
        </div>
        <p
          className="text-sm font-medium text-gray-600 dark:text-gray-300"
          role="status"
          aria-live="polite"
        >
          {t("loading")}
        </p>
      </div>
    </GuestAppChrome>
  );
};

export default Preloader;
