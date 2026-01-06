import React, { useEffect } from "react";
import InventorySummary from "./InventorySummary";
import HistorySummary from "./HistorySummary";
import Onboarding from "../tutorials/Onboarding";
import { useAuthentication } from "../../../../hooks/auth";
import { motion } from "framer-motion";
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

  const employeeFirstname = user?.first_name || "Unknown User";

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return {
        message: t("greetings.goodAMorning"),
        icon: (
          <motion.img
            src={morningIcon}
            alt="Morning Icon"
            className="h-14 w-14"
            initial={{ y: 100 }} // Slide from below
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        ),
      };
    } else if (currentHour < 18) {
      return {
        message: t("greetings.goodAfternoon"),
        icon: (
          <motion.img
            src={afternoonIcon}
            alt="Afternoon Icon"
            className="h-14 w-14"
            initial={{ x: -100 }} // Slide from left
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        ),
      };
    } else {
      return {
        message: t("greetings.goodEvening"),
        icon: (
          <motion.img
            src={eveningIcon}
            alt="Evening Icon"
            className="h-14 w-14"
            initial={{ y: -100 }} // Slide from above
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        ),
      };
    }
  };

  const { message, icon } = getGreeting();

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-800">
      <Onboarding />

      {/* Slide-in animation for logo */}
      <motion.div
        className="flex w-full items-center justify-center p-3"
        initial={{ x: -200 }} // Start from the left
        animate={{ x: 0 }} // Slide to the original position
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="flex flex-row items-center gap-1 rounded p-4">
          <img src={kawasakiLogo} alt="kawasaki-icon" className="h-5" />

          <hr className="mx-2 flex-grow border border-t border-gray-400" />
          <img src={logoIcon} alt="icon" className="h-5 w-5" />
          <img src={logoText} alt="logo-text" className="h-6" />
        </div>
      </motion.div>

      {/* Slide-in animation for greeting text */}
      <motion.div
        className="flex w-full flex-row justify-between px-4 py-4"
        initial={{ x: -200 }} // Start from the left
        animate={{ x: 0 }} // Slide to the original position
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="flex flex-col">
          <p className="text-xl font-medium text-gray-700 dark:text-gray-50">
            {message}
          </p>
          <p className="text-2xl font-semibold text-gray-700 dark:text-gray-50">
            {employeeFirstname}
          </p>
        </div>
        {icon}
      </motion.div>

      {/* Slide-in animation for content (InventorySummary and HistorySummary) */}
      <motion.div
        className="h-full w-full"
        initial={{ opacity: 0 }} // Start with 0 opacity
        animate={{ opacity: 1 }} // Fade to full opacity
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <motion.div
          initial={{ y: 100 }} // Slide from below
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <InventorySummary userId={userId} />
        </motion.div>

        <motion.div
          initial={{ y: 100 }} // Slide from below
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          id="history-summary"
          className="w-full p-2"
        >
          <HistorySummary />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
