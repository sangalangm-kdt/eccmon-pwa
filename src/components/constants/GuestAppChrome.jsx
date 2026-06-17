import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import logo from "../assets/svg/logo.svg";
import InstallationButton from "./InstallationButton";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTheme } from "../../context/theme-context";

const themeToggleClassName =
  "ecc-touch-btn flex size-10 shrink-0 items-center justify-center rounded-full border border-gray-200/80 bg-white/80 text-gray-700 transition-colors hover:bg-white dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:hover:bg-gray-700 sm:size-11 sm:border-gray-200/90 sm:bg-white/90 sm:shadow-sm lg:size-12";

const pwaButtonClassName =
  "ecc-touch-btn inline-flex h-10 min-w-[40px] items-center justify-center rounded-md bg-primary px-3 text-xs font-semibold text-white transition-all hover:brightness-105 active:scale-[0.98] sm:h-11 sm:px-4 sm:text-sm lg:h-12 lg:px-5";

const GuestAppChrome = ({ children, className = "" }) => {
  const { t } = useTranslation(["profile", "common"]);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50/50 to-cyan-50/70 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
      <div
        className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl dark:bg-cyan-500/10 md:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-24 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl dark:bg-blue-600/10 md:block"
        aria-hidden="true"
      />

      <header className="relative z-10 shrink-0 pb-2 pt-[max(1rem,env(safe-area-inset-top))] md:pb-3">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <img
            src={logo}
            alt="ECCMon"
            className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11 lg:h-12 lg:w-12"
          />

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className={themeToggleClassName}
              aria-label={
                theme === "light"
                  ? t("profile:menuSection.theme.dark")
                  : t("profile:menuSection.theme.light")
              }
            >
              {theme === "light" ? (
                <IoMoonOutline
                  className="size-[18px] sm:size-5 lg:size-[22px]"
                  aria-hidden="true"
                />
              ) : (
                <IoSunnyOutline
                  className="size-[18px] sm:size-5 lg:size-[22px]"
                  aria-hidden="true"
                />
              )}
            </button>
            <InstallationButton buttonClassName={pwaButtonClassName} />
          </div>
        </div>
      </header>

      <main
        className={`relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-2 pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] md:max-w-none md:py-6 md:pb-6 ${className}`}
      >
        {children}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-10 shrink-0 border-t border-gray-200/70 bg-white/90 px-4 py-2 backdrop-blur-md dark:border-gray-700/70 dark:bg-gray-900/90 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-6 md:relative md:border-t md:py-3 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
          <LanguageSwitcher variant="guest" />
        </div>
      </footer>
    </div>
  );
};

GuestAppChrome.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default GuestAppChrome;
