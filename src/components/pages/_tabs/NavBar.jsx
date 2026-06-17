import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPage } from "../../../features/page/pageSlice";
import { navbarStyles } from "../../styles/header";
import logo from "../../assets/svg/logo.svg";
import InstallationButton from "../../constants/InstallationButton";
import LanguageSwitcher from "../../constants/LanguageSwitcher";
import { languagess } from "../../styles/header";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthentication } from "../../../hooks/auth";
import { PiQrCodeBold } from "react-icons/pi";
import { RiUser6Line, RiHome6Line } from "react-icons/ri";
import { motion } from "framer-motion"; // Import Framer Motion

const topNavLinkBase =
  "inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 md:text-base";

const topNavStandardLink = ({ isActive }) =>
  `${topNavLinkBase} ${
    isActive
      ? "border-b-2 border-primary text-primary"
      : "text-secondaryText hover:text-primary"
  }`;

const topNavScanLink = ({ isActive }) =>
  `inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 md:text-base ${
    isActive
      ? "bg-primary text-white shadow-sm"
      : "border-2 border-primary bg-primary/5 text-primary hover:bg-primary/10"
  }`;

const NavBar = () => {
  const currentPage = useSelector((state) => state.page.currentPage);
  const dispatch = useDispatch();
  const { t } = useTranslation("common");
  const location = useLocation();
  const { user } = useAuthentication();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname.slice(1);
    dispatch(setPage(path));
  }, [location, dispatch]);

  const handleLogoClick = () => {
    if (user) {
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  if (currentPage === "scanned-result") {
    return null;
  }

  if (
    location.pathname === "/login" ||
    location.pathname === "/request-account" ||
    location.pathname === "/password-reset"
  ) {
    return null;
  }

  return (
    <div className="fixed top-0 z-50 flex w-full flex-col">
      {!user && (
        <div>
          <div className={`${languagess.container} dark:bg-gray-800`}>
            <div
              className={`${languagess.languageSwitcher} dark:text-gray-200 xs:mb-2 lg:mb-0 lg:text-xs`}
            >
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
      {currentPage === "login" ? (
        <div>
          <nav className={`${navbarStyles.topNavbar} dark:bg-gray-800`}>
            <div className={navbarStyles.navbarContainer}>
              <div className="m-2 flex flex-row justify-between">
                <img
                  src={logo}
                  alt="Logo"
                  className={navbarStyles.logo}
                  onClick={handleLogoClick}
                />
                <div>
                  <InstallationButton />
                </div>
              </div>
            </div>
          </nav>
        </div>
      ) : (
        <>
          <div>
            <nav
              className={`${navbarStyles.topNavbar} hidden dark:bg-gray-900 md:flex`}
            >
              <div className={navbarStyles.navbarContainer}>
                <div className="flex min-h-[56px] w-full items-center justify-between gap-4 px-2 py-2">
                  <img
                    src={logo}
                    alt="Logo"
                    className={navbarStyles.logo}
                    onClick={handleLogoClick}
                  />
                  {user && (
                    <ul className="flex flex-1 items-center justify-center gap-6 lg:gap-8">
                      <li>
                        <NavLink
                          id="home-link"
                          to="/"
                          aria-label={t("home")}
                          className={topNavStandardLink}
                        >
                          <RiHome6Line className="size-5 shrink-0" aria-hidden />
                          {t("home")}
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          id="qrscanner-link"
                          to="/qrscanner"
                          aria-label={t("scanQr")}
                          className={topNavScanLink}
                        >
                          <PiQrCodeBold className="size-5 shrink-0" aria-hidden />
                          {t("scanQr")}
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          id="profile-link"
                          to="/profile"
                          aria-label={t("profile")}
                          className={topNavStandardLink}
                        >
                          <RiUser6Line className="size-5 shrink-0" aria-hidden />
                          {t("profile")}
                        </NavLink>
                      </li>
                    </ul>
                  )}
                  <div className="shrink-0">
                    <InstallationButton />
                  </div>
                </div>
              </div>
            </nav>
          </div>
          {user ? (
            <div>
              <nav className={navbarStyles.bottomNavbar}>
                <div className={navbarStyles.bottomNavbarInner}>
                  <NavLink
                    id="home-link"
                    to="/"
                    aria-label={t("home")}
                    className={navbarStyles.bottomNavbarButton}
                  >
                    {({ isActive }) => (
                      <RiHome6Line
                        className={`${navbarStyles.bottomNavIcon} ${
                          isActive
                            ? "text-primary"
                            : "text-gray-500 dark:text-gray-50"
                        }`}
                        aria-hidden
                      />
                    )}
                  </NavLink>

                  <NavLink
                    id="qrscanner-link"
                    to="/qrscanner"
                    aria-label={t("scanQr")}
                    className={`${navbarStyles.bottomNavbarButton} items-end`}
                  >
                    {({ isActive }) => (
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: isActive ? 1.05 : 1 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        whileTap={{ scale: 0.95 }}
                        className={navbarStyles.qrContainer}
                      >
                        <PiQrCodeBold
                          className={navbarStyles.qrIcon}
                          aria-hidden
                        />
                      </motion.div>
                    )}
                  </NavLink>

                  <NavLink
                    id="profile-link"
                    to="/profile"
                    aria-label={t("profile")}
                    className={navbarStyles.bottomNavbarButton}
                  >
                    {({ isActive }) => (
                      <RiUser6Line
                        className={`${navbarStyles.bottomNavIcon} ${
                          isActive
                            ? "text-primary"
                            : "text-gray-500 dark:text-gray-100"
                        }`}
                        aria-hidden
                      />
                    )}
                  </NavLink>
                </div>
              </nav>
            </div>
          ) : (
            <div>
              <nav
                className={`${navbarStyles.topNavbar} dark:bg-gray-800 sm:flex md:hidden lg:hidden`}
              >
                <div className={navbarStyles.navbarContainer}>
                  <div className="m-2 flex flex-row justify-between">
                    <img
                      src={logo}
                      alt="Logo"
                      className={navbarStyles.logo}
                      onClick={handleLogoClick}
                    />
                    <div>
                      <InstallationButton />
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NavBar;
