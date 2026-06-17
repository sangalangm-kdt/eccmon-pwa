import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthentication } from "../../../../hooks/auth";
import {
  IoBookOutline,
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoChevronUpOutline,
  IoInformationCircleOutline,
  IoLanguageOutline,
  IoMoonOutline,
  IoSettingsOutline,
  IoSunnyOutline,
} from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { useTheme } from "../../../../context/theme-context";
import ToggleButton from "../../../constants/ToggleButton";
import { useNavigate } from "react-router-dom";

const SettingsCard = ({ title, children, className = "" }) => (
  <section
    className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-700 md:rounded-xl ${className}`}
  >
    {title ? (
      <h2 className="border-b border-gray-100 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-600 dark:text-gray-400">
        {title}
      </h2>
    ) : null}
    <div className="divide-y divide-gray-100 dark:divide-gray-600">{children}</div>
  </section>
);

const MenuRow = ({
  icon,
  label,
  onClick,
  right,
  disabled = false,
  className = "",
  type = "button",
}) => {
  const Component = type === "button" ? "button" : "div";

  return (
    <Component
      type={type === "button" ? "button" : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`ecc-touch-btn flex min-h-12 w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-200 dark:hover:bg-gray-600/50 dark:active:bg-gray-600 ${className}`}
    >
      <span className="flex size-5 shrink-0 items-center justify-center text-gray-500 dark:text-gray-300">
        {icon ?? <span className="size-5" aria-hidden="true" />}
      </span>
      <span className="min-w-0 flex-1 font-medium">{label}</span>
      {right}
    </Component>
  );
};

const SubMenuRow = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="ecc-touch-btn flex min-h-12 w-full items-center justify-between py-3 pl-12 pr-4 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50 active:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600/50"
  >
    <span>{label}</span>
    <IoChevronForwardOutline size={16} className="shrink-0 text-gray-400" />
  </button>
);

const ProfilePage = () => {
  const { t, i18n } = useTranslation("profile");
  const { logout, isLoading, user, errorMessage } = useAuthentication({
    middleware: "auth",
  });
  const { theme, toggleTheme } = useTheme();
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [isHelpSupportOpen, setIsHelpSupportOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (errorMessage) {
      console.error("Authentication Error:", errorMessage);
    }
  }, [errorMessage]);

  const employeeFirstname = user?.first_name || t("unknownUser");
  const employeeLastname = user?.last_name || "";
  const employeeIdNo = user?.user_id || "N/A";
  const affiliation = user?.affiliation?.trim();
  const fullName = [employeeFirstname, employeeLastname].filter(Boolean).join(" ");

  const profileIcon =
    `${employeeFirstname[0] ?? ""}${employeeLastname[0] ?? ""}`.toUpperCase() ||
    "?";

  const version = import.meta.env.VITE_APP_VERSION;
  const currentLanguageLabel =
    i18n.language === "ja"
      ? t("menuSection.languageJapanese")
      : t("menuSection.languageEnglish");

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleLanguage = (isJapanese) => {
    const nextLanguage = isJapanese ? "ja" : "en";
    i18n.changeLanguage(nextLanguage);
    localStorage.setItem("languageState", nextLanguage);
  };

  const profileDetails = (
    <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400 md:mt-2.5 md:text-base lg:mt-3">
      <span>
        {t("profileSection.employeeId")} {employeeIdNo}
      </span>
      {affiliation ? (
        <>
          <span
            className="mx-1.5 text-gray-300 dark:text-gray-600"
            aria-hidden="true"
          >
            •
          </span>
          <span>
            {t("profileSection.affiliation")} {affiliation}
          </span>
        </>
      ) : null}
    </p>
  );

  const settingsCards = (
    <>
      <SettingsCard title={t("menuSection.account")}>
          <div>
            <MenuRow
              icon={<IoSettingsOutline size={20} />}
              label={t("menuSection.accountSettings.account")}
              onClick={() => setIsAccountSettingsOpen((prev) => !prev)}
              right={
                isAccountSettingsOpen ? (
                  <IoChevronUpOutline size={18} className="text-gray-400" />
                ) : (
                  <IoChevronDownOutline size={18} className="text-gray-400" />
                )
              }
            />
            {isAccountSettingsOpen ? (
              <div className="border-t border-gray-100 bg-gray-50/80 dark:border-gray-600 dark:bg-gray-800/40">
                <SubMenuRow
                  label={t("menuSection.accountSettings.information")}
                  onClick={() => handleNavigation("/update-info")}
                />
                <SubMenuRow
                  label={t("menuSection.accountSettings.changePass")}
                  onClick={() => handleNavigation("/change-password")}
                />
              </div>
            ) : null}
          </div>

          <div>
            <MenuRow
              icon={<IoLanguageOutline size={20} />}
              label={t("menuSection.language")}
              onClick={() => setIsLanguageOpen((prev) => !prev)}
              right={
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  {currentLanguageLabel}
                  {isLanguageOpen ? (
                    <IoChevronUpOutline size={16} />
                  ) : (
                    <IoChevronDownOutline size={16} />
                  )}
                </span>
              }
            />
            {isLanguageOpen ? (
              <div className="border-t border-gray-100 bg-gray-50/80 dark:border-gray-600 dark:bg-gray-800/40">
                <button
                  type="button"
                  onClick={() => toggleLanguage(false)}
                  className={`ecc-touch-btn flex min-h-12 w-full items-center py-3 pl-12 pr-4 text-left text-sm transition-colors hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-gray-600/50 ${
                    i18n.language === "en"
                      ? "font-medium text-cyan-600 dark:text-cyan-400"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {t("menuSection.languageEnglish")}
                </button>
                <button
                  type="button"
                  onClick={() => toggleLanguage(true)}
                  className={`ecc-touch-btn flex min-h-12 w-full items-center py-3 pl-12 pr-4 text-left text-sm transition-colors hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-gray-600/50 ${
                    i18n.language === "ja"
                      ? "font-medium text-cyan-600 dark:text-cyan-400"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {t("menuSection.languageJapanese")}
                </button>
              </div>
            ) : null}
          </div>

          <MenuRow
            icon={
              theme === "light" ? (
                <IoSunnyOutline size={20} />
              ) : (
                <IoMoonOutline size={20} />
              )
            }
            label={
              theme === "light"
                ? t("menuSection.theme.dark")
                : t("menuSection.theme.light")
            }
            type="div"
            right={
              <ToggleButton
                isToggledInitially={theme === "dark"}
                onToggle={toggleTheme}
              />
            }
          />
        </SettingsCard>

        <SettingsCard title={t("menuSection.supportAndApp")}>
          <div>
            <MenuRow
              icon={<IoBookOutline size={20} />}
              label={t("menuSection.helpSupport")}
              onClick={() => setIsHelpSupportOpen((prev) => !prev)}
              right={
                isHelpSupportOpen ? (
                  <IoChevronUpOutline size={18} className="text-gray-400" />
                ) : (
                  <IoChevronDownOutline size={18} className="text-gray-400" />
                )
              }
            />
            {isHelpSupportOpen ? (
              <div className="border-t border-gray-100 bg-gray-50/80 dark:border-gray-600 dark:bg-gray-800/40">
                <SubMenuRow
                  label={t("menuSection.faq")}
                  onClick={() => handleNavigation("/faq")}
                />
                <SubMenuRow
                  label={t("menuSection.userGuidelines")}
                  onClick={() => handleNavigation("/user-guidelines")}
                />
                <SubMenuRow
                  label={t("menuSection.reportBugs")}
                  onClick={() => handleNavigation("/report-bugs")}
                />
              </div>
            ) : null}
          </div>

          <MenuRow
            icon={<IoInformationCircleOutline size={20} />}
            label={t("menuSection.aboutEccMon")}
            onClick={() => handleNavigation("/user-guidelines")}
            right={
              <IoChevronForwardOutline size={16} className="text-gray-400" />
            }
          />

          <MenuRow
            icon={null}
            label={t("menuSection.version")}
            type="div"
            className="cursor-default hover:bg-transparent active:bg-transparent dark:hover:bg-transparent"
            right={
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {version}
              </span>
            }
          />

          <p className="px-4 py-3 text-center text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">
            {t("menuSection.copyright", { year: new Date().getFullYear() })}
          </p>
        </SettingsCard>

        <SettingsCard>
          <MenuRow
            icon={<TbLogout2 size={20} />}
            label={isLoading ? `${t("menuSection.logout")}...` : t("menuSection.logout")}
            onClick={handleLogout}
            disabled={isLoading}
            className="text-red-600 hover:bg-red-50 active:bg-red-100 dark:text-red-400 dark:hover:bg-red-950/30 dark:active:bg-red-950/50"
          />
        </SettingsCard>
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-800">
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pb-24 pt-4 md:max-w-3xl md:pb-8 md:pt-20 lg:max-w-6xl lg:px-8 lg:pt-24 xl:max-w-7xl">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(300px,380px)_minmax(0,1fr)] lg:items-start lg:gap-6">
          <section className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-700 lg:min-h-[420px] lg:self-stretch">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-cyan-50 via-sky-50/70 to-transparent md:h-32 lg:h-40 dark:from-cyan-950/50 dark:via-sky-950/30 dark:to-transparent"
              aria-hidden="true"
            />

            <div className="relative flex h-full flex-col items-center justify-center gap-5 px-5 py-6 text-center md:flex-row md:items-center md:gap-6 md:px-6 md:py-7 md:text-left lg:flex-col lg:px-8 lg:py-10 lg:text-center xl:py-12">
              <div className="relative shrink-0">
                <div
                  className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-cyan-200/70 via-sky-100/50 to-blue-100/40 blur-[1px] lg:-inset-3 dark:from-cyan-800/35 dark:via-sky-900/25 dark:to-blue-900/20"
                  aria-hidden="true"
                />
                <div className="relative flex h-[88px] w-[88px] items-center justify-center rounded-full bg-cyan-to-blue text-2xl font-bold text-white shadow-md ring-2 ring-white dark:ring-gray-700 md:h-24 md:w-24 md:text-[1.75rem] lg:h-28 lg:w-28 lg:text-3xl">
                  {profileIcon}
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center lg:w-full lg:flex-none">
                <h1 className="text-xl font-bold leading-tight text-gray-900 dark:text-gray-50 md:text-2xl lg:text-2xl xl:text-3xl">
                  {fullName}
                </h1>
                {profileDetails}
              </div>
            </div>
          </section>

          <div className="flex min-w-0 flex-col gap-4 lg:gap-5">{settingsCards}</div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
