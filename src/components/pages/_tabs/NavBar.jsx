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
              className={`${navbarStyles.topNavbar} dark:bg-gray-900 xs:hidden sm:flex md:flex lg:flex`}
            >
              <div className={navbarStyles.navbarContainer}>
                <div className="m-2 flex flex-row justify-between">
                  <img
                    src={logo}
                    alt="Logo"
                    className={navbarStyles.logo}
                    onClick={handleLogoClick}
                  />
                  {user && (
                    <div>
                      <ul className="flex space-x-4">
                        <li className={navbarStyles.navbarLink}>
                          <NavLink
                            id="home-link"
                            to="/"
                            aria-label="Home"
                            className={({ isActive }) =>
                              isActive ? `${navbarStyles.activeLink}` : ""
                            }
                          >
                            {t("common:home")}
                          </NavLink>
                        </li>
                        <li className={navbarStyles.navbarLink}>
                          <NavLink
                            id="qrscanner-link"
                            to="/qrscanner"
                            aria-label="QR Scanner"
                            className={({ isActive }) =>
                              isActive ? `${navbarStyles.activeLink}` : ""
                            }
                          >
                            {t("scanner")}
                          </NavLink>
                        </li>
                        <li className={navbarStyles.navbarLink}>
                          <NavLink
                            id="profile-link"
                            to="/profile"
                            aria-label="Profile"
                            className={({ isActive }) =>
                              isActive ? `${navbarStyles.activeLink}` : ""
                            }
                          >
                            {t("common:profile")}
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                  )}
                  <div>
                    <InstallationButton />
                  </div>
                </div>
              </div>
            </nav>
          </div>
          {user ? (
            <div>
              <nav
                className={`${navbarStyles.bottomNavbar} dark:border-none dark:bg-gray-900 xs:flex sm:hidden md:hidden lg:hidden`}
              >
                <div className={navbarStyles.navbarContainer}>
                  <ul className="flex justify-center">
                    <li className={navbarStyles.bottomNavbarButton}>
                      <NavLink id="home-link" to="/" aria-label="Home">
                        {({ isActive }) => (
                          <div className="flex flex-col items-center text-tiny font-medium">
                            <button className="flex flex-col items-center p-1">
                              <RiHome6Line
                                className={`${navbarStyles.iconContainer} ${
                                  isActive
                                    ? "fill-primary"
                                    : "text-gray-500 dark:text-gray-50"
                                }`}
                              />
                            </button>
                          </div>
                        )}
                      </NavLink>
                    </li>
                    <li className={navbarStyles.bottomNavbarButton}>
                      <NavLink
                        id="qrscanner-link"
                        to="/qrscanner"
                        aria-label="QR Scanner"
                      >
                        {({ isActive }) => (
                          <motion.div
                            initial={{ scale: 1 }}
                            animate={{ scale: isActive ? 1.2 : 1 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className={`flex flex-col items-center ${navbarStyles.qrContainer} focus:bg-cyan-to-blue`}
                          >
                            <button className="flex flex-col items-center p-1">
                              <PiQrCodeBold
                                className={`size-6 rounded-full text-white ${
                                  isActive ? "fill-primary" : ""
                                }`}
                              />
                            </button>
                          </motion.div>
                        )}
                      </NavLink>
                    </li>
                    <li className={navbarStyles.bottomNavbarButton}>
                      <NavLink
                        id="profile-link"
                        to="/profile"
                        aria-label="Profile"
                      >
                        {({ isActive }) => (
                          <div className="flex flex-col items-center text-tiny font-medium">
                            <button className="flex flex-col items-center p-1">
                              <RiUser6Line
                                className={`${navbarStyles.iconContainer} ${
                                  isActive
                                    ? "fill-primary"
                                    : "text-gray-500 dark:text-gray-100"
                                }`}
                              />
                            </button>
                          </div>
                        )}
                      </NavLink>
                    </li>
                  </ul>
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
