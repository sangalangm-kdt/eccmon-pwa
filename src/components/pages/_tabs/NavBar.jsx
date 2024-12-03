import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPage } from "../../../features/page/pageSlice";
import { navbarStyles } from "../../styles/header";
import logo from "../../assets/svg/logo.svg";
import InstallationButton from "../../constants/InstallationButton";
import LanguageSwitcher from "../../constants/LanguageSwitcher";
import { languagess } from "../../styles/header";
import { useTranslation } from "react-i18next";
import { HomeIcon, ProfileIcon, QRScanIcon } from "../../assets/icons";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthentication } from "../../../hooks/auth";

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

  // useEffect(() => {
  //   console.log(currentPage);
  //   console.log(user);
  // }, [location]);

  if (currentPage === "scanned-result") {
    return null;
  }
  return (
    <div className="flex flex-col fixed w-full top-0 z-50">
      {!user && (
        <div
          className={`${languagess.container} ${languagess.languageSwitcher}`}
        >
          <LanguageSwitcher />
        </div>
      )}
      {currentPage === "login" ? (
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
      ) : (
        <>
          <nav
            className={`${navbarStyles.topNavbar} sm:flex lg:flex md:flex xs:hidden`}
          >
            <div className={navbarStyles.navbarContainer}>
              <div className="flex flex-row justify-between m-2">
                <NavLink to="/">
                  {" "}
                  <img src={logo} alt="Logo" className={navbarStyles.logo} />
                </NavLink>

                {user && (
                  <div>
                    <ul className="flex space-x-4">
                      <li className={navbarStyles.navbarLink}>
                        <NavLink
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
          {user ? (
            <>
              <nav
                className={`${navbarStyles.bottomNavbar} xs:flex lg:hidden md:hidden`}
              >
                <div className={navbarStyles.navbarContainer}>
                  <ul className="flex justify-center space-x-8">
                    <li className={navbarStyles.bottomNavbarButton}>
                      <NavLink
                        to="/"
                        aria-label="Home"
                        className={({ isActive }) =>
                          isActive ? `${navbarStyles.activeLink}` : ""
                        }
                      >
                        {({ isActive }) => (
                          <div className="flex flex-col items-center font-medium text-sm">
                            <HomeIcon
                              className={`${navbarStyles.iconContainer} ${
                                isActive ? "fill-primary" : ""
                              }`}
                            />
                            {t("common:home")}
                          </div>
                        )}
                      </NavLink>
                    </li>
                    <li className={navbarStyles.bottomNavbarButton}>
                      <NavLink
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
                            <QRScanIcon
                              className={`${navbarStyles.iconContainer} 
                               ${isActive ? "fill-primary" : ""}`}
                            />
                          </div>
                        )}
                      </NavLink>
                    </li>
                    <li className={navbarStyles.bottomNavbarButton}>
                      <NavLink
                        to="/profile"
                        aria-label="Profile"
                        className={({ isActive }) =>
                          isActive ? `${navbarStyles.activeLink}` : ""
                        }
                      >
                        {({ isActive }) => (
                          <div className="flex flex-col items-center font-medium text-sm">
                            <ProfileIcon
                              className={`${navbarStyles.iconContainer} ${
                                isActive ? "fill-primary" : ""
                              }`}
                            />
                            {t("common:profile")}
                          </div>
                        )}
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </nav>
            </>
          ) : (
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
          )}
        </>
      )}
    </div>
  );
};

export default NavBar;
