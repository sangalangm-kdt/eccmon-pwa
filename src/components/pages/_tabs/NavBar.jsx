import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPage } from "../../../features/page/pageSlice";
import { navbarStyles } from "../../styles/header";
import logo from "../../assets/svg/logo.svg";
import InstallationButton from "../../constants/InstallationButton";
import LanguageSwitcher from "../../constants/LanguageSwitcher";
import { languagess } from "../../styles/header";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthentication } from "../../../hooks/auth";
import { PiQrCodeBold } from "react-icons/pi";
import { RiUser6Line, RiHome6Line } from "react-icons/ri";
const NavBar = () => {
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const currentPage = useSelector((state) => state.page.currentPage);
  const dispatch = useDispatch();
  const { t } = useTranslation("common");
  const location = useLocation();
  const { user } = useAuthentication();

  useEffect(() => {
    const path = location.pathname.slice(1);
    dispatch(setPage(path));
  }, [location, dispatch]);

  if (currentPage === "scanned-result") {
    return null;
  }
  return (
    <div className="flex flex-col fixed w-full top-0 z-50">
      {!user && (
        <div>
          <div className={`${languagess.container} `}>
            <div className={`${languagess.languageSwitcher}`}>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
      {currentPage === "login" ? (
        <div>
          <nav className={`${navbarStyles.topNavbar}`}>
            <div className={navbarStyles.navbarContainer}>
              <div className="flex flex-row justify-between m-2">
                <img src={logo} alt="Logo" className={navbarStyles.logo} />
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
              className={`${navbarStyles.topNavbar} sm:flex lg:flex md:flex xs:hidden`}
            >
              <div className={navbarStyles.navbarContainer}>
                <div className="flex flex-row justify-between m-2">
                  <NavLink to="/">
                    <img src={logo} alt="Logo" className={navbarStyles.logo} />
                  </NavLink>

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
                className={`${navbarStyles.bottomNavbar} xs:flex sm:hidden lg:hidden md:hidden `}
              >
                <div className={navbarStyles.navbarContainer}>
                  <ul className="flex justify-center">
                    <li className={navbarStyles.bottomNavbarButton}>
                      <NavLink
                        id="home-link"
                        to="/"
                        aria-label="Home"
                        className={({ isActive }) =>
                          isActive ? `${navbarStyles.activeLink}` : ""
                        }
                      >
                        {({ isActive }) => (
                          <div className="flex flex-col items-center font-medium text-tiny">
                            <button className="flex flex-col items-center p-1">
                              <RiHome6Line
                                className={`${navbarStyles.iconContainer} ${
                                  isActive ? "fill-primary" : "text-gray-500"
                                }`}
                              />
                              {/* {t("common:home")} */}
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
                        className={({ isActive }) =>
                          isActive ? `${navbarStyles.activeLink}` : ""
                        }
                      >
                        {({ isActive }) => (
                          <div
                            className={`flex flex-col items-center ${navbarStyles.qrContainer}`}
                          >
                            <button className="flex flex-col items-center p-1 focus:bg-gray-100">
                              <PiQrCodeBold
                                className={` rounded-full size-6 text-white ${
                                  isActive ? "fill-primary" : ""
                                }`}
                              />
                            </button>
                          </div>
                        )}
                      </NavLink>
                    </li>
                    <li className={navbarStyles.bottomNavbarButton}>
                      <NavLink
                        id="profile-link"
                        to="/profile"
                        aria-label="Profile"
                        className={({ isActive }) =>
                          isActive ? `${navbarStyles.activeLink}` : ""
                        }
                      >
                        {({ isActive }) => (
                          <div className="flex flex-col items-center font-medium text-tiny">
                            <button className="flex flex-col items-center p-1">
                              <RiUser6Line
                                className={`${navbarStyles.iconContainer} ${
                                  isActive ? "fill-primary" : "text-gray-500"
                                }`}
                              />
                              {/* {t("common:profile")} */}
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
                className={`${navbarStyles.topNavbar} sm:flex md:hidden lg:hidden`}
              >
                <div className={navbarStyles.navbarContainer}>
                  <div className="flex flex-row justify-between m-2">
                    <img src={logo} alt="Logo" className={navbarStyles.logo} />
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
