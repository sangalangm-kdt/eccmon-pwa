import React, { useEffect } from "react";
import InventorySummary from "./InventorySummary";
import HistorySummary from "./HistorySummary";
import Onboarding from "../tutorials/Onboarding";
import { useAuthentication } from "../../../../hooks/auth";
import logoIcon from "../../../assets/svg/logo.svg";
import logoText from "../../../assets/svg/logotext_revised3.svg";
import morningIcon from "../../../assets/morning.png";
import afternoonIcon from "../../../assets/afternoon.png";
import eveningIcon from "../../../assets/evening.png";
import { useTranslation } from "react-i18next";
import kawasakiLogo from "../../../assets/kawasaki-png-kawasaki-logo-1612.png";

const Home = () => {
  const { userId, user, errorMessage } = useAuthentication();
  const { t } = useTranslation("common");

  useEffect(() => {
    if (errorMessage) {
      console.error("Authentication Error:", errorMessage);
    }
  }, [errorMessage]);

  const employeeFirstname = user?.first_name || t("unknownUser");

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return {
        message: t("greetings.goodAMorning"),
        icon: (
          <img
            src={morningIcon}
            alt="Morning Icon"
            className="h-11 w-11 md:h-16 md:w-16"
          />
        ),
      };
    }
    if (currentHour < 18) {
      return {
        message: t("greetings.goodAfternoon"),
        icon: (
          <img
            src={afternoonIcon}
            alt="Afternoon Icon"
            className="h-11 w-11 md:h-16 md:w-16"
          />
        ),
      };
    }
    return {
      message: t("greetings.goodEvening"),
      icon: (
        <img
          src={eveningIcon}
          alt="Evening Icon"
          className="h-11 w-11 md:h-16 md:w-16"
        />
      ),
    };
  };

  const { message, icon } = getGreeting();

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-800">
      <Onboarding />

      <main className="mx-auto w-full max-w-6xl px-4 py-3 pb-24 sm:px-6 md:pb-8 lg:px-8">
        <div className="flex w-full items-center justify-start py-1 md:py-3">
          <div className="flex flex-row items-center gap-1 py-0.5 md:p-4">
            <img src={kawasakiLogo} alt="kawasaki-icon" className="h-5 md:h-6" />
            <hr className="mx-2 flex-grow border border-t border-gray-400" />
            <img src={logoIcon} alt="icon" className="h-5 w-5 md:h-6 md:w-6" />
            <img src={logoText} alt="logo-text" className="h-6 md:h-7" />
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-3 py-2 md:py-4">
          <div className="min-w-0 flex flex-col justify-center">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-50 md:text-2xl">
              {message}
            </p>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-50 md:text-3xl">
              {employeeFirstname}
            </p>
          </div>
          <div className="flex shrink-0 items-center self-center">{icon}</div>
        </div>

        <div className="w-full">
          <div className="flex w-full flex-col gap-4 md:gap-6">
            <section className="min-w-0 w-full">
              <InventorySummary userId={userId} />
            </section>

            <section className="min-w-0 w-full" id="history-summary">
              <HistorySummary />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
