import React, { useEffect, useMemo } from "react";
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

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const slideLeft = {
  initial: { x: -120, opacity: 0 },
  animate: { x: 0, opacity: 1 },
};

const slideUp = {
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

const spring = { type: "spring", stiffness: 120, damping: 16 };

const Home = () => {
  const { userId, user, errorMessage } = useAuthentication();
  const { t } = useTranslation("common");

  useEffect(() => {
    if (errorMessage) console.error("Authentication Error:", errorMessage);
  }, [errorMessage]);

  const employeeFirstname =
    (user?.first_name || "").trim() || t("unknownUser", "Unknown User");

  const greeting = useMemo(() => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return {
        message: t("greetings.goodAMorning"),
        iconSrc: morningIcon,
        alt: "Morning Icon",
        motion: {
          initial: { y: 24, opacity: 0 },
          animate: { y: 0, opacity: 1 },
        },
      };
    }

    if (currentHour < 18) {
      return {
        message: t("greetings.goodAfternoon"),
        iconSrc: afternoonIcon,
        alt: "Afternoon Icon",
        motion: {
          initial: { x: -24, opacity: 0 },
          animate: { x: 0, opacity: 1 },
        },
      };
    }

    return {
      message: t("greetings.goodEvening"),
      iconSrc: eveningIcon,
      alt: "Evening Icon",
      motion: {
        initial: { y: -24, opacity: 0 },
        animate: { y: 0, opacity: 1 },
      },
    };
  }, [t]);

  return (
    <motion.div
      className="min-h-screen bg-gray-100 pb-8 dark:bg-gray-800"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.25 }}
    >
      <Onboarding />

      {/* Top Logo Row */}
      <motion.div
        className="mx-auto flex w-full max-w-4xl items-center justify-center px-4 pt-4"
        variants={slideLeft}
        initial="initial"
        animate="animate"
        transition={spring}
      >
        <div className="flex w-full items-center justify-center gap-2 rounded-2xl p-3 shadow-sm backdrop-blur">
          {/* <img src={kawasakiLogo} alt="Kawasaki Logo" className="h-6" /> */}

          <img src={logoIcon} alt="App Icon" className="h-8 w-8" />
          <img src={logoText} alt="App Logo Text" className="h-6" />
        </div>
      </motion.div>

      {/* Greeting */}
      <motion.div
        className="mx-auto mt-3 flex w-full max-w-4xl items-center justify-between px-4 py-4"
        variants={slideLeft}
        initial="initial"
        animate="animate"
        transition={{ ...spring, delay: 0.05 }}
      >
        <div className="flex flex-col">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-50">
            {greeting.message}
          </p>
          <p className="text-2xl font-semibold text-gray-800 dark:text-gray-50">
            {employeeFirstname}
          </p>
        </div>

        <motion.img
          src={greeting.iconSrc}
          alt={greeting.alt}
          className="h-14 w-14"
          initial={greeting.motion.initial}
          animate={greeting.motion.animate}
          transition={spring}
        />
      </motion.div>

      {/* Content */}
      <div className="mx-auto w-full max-w-4xl px-2">
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={spring}
        >
          <InventorySummary userId={userId} />
        </motion.div>

        <motion.div
          id="history-summary"
          className="mt-2 w-full"
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ ...spring, delay: 0.15 }}
        >
          <HistorySummary />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
