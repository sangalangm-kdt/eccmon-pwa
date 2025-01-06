import React, { useEffect } from "react";
import introJs from "intro.js";
import logo from "../../assets/svg/logo.svg";
import logoText from "../../assets/svg/logotext_revised3.svg";
import { useTranslation } from "react-i18next"; // Import i18next hook
import "intro.js/minified/introjs.min.css";

const Onboarding = () => {
  const { t } = useTranslation("common"); // Get the translation function

  useEffect(() => {
    if (!localStorage.getItem("homeTutorialCompleted")) {
      const intro = introJs();

      intro.setOptions({
        steps: [
          {
            element: "#intro",
            title: ` <div class="flex items-center justify-center font-bold"> 
                  <img src="${logo}" alt="ECCMon Logo" class="w-8 h-8 mb-4 "/>
                  <img src="${logoText}" alt="ECCMon Logo" class="ml-2 w-20 h-20 mb-4 "/>
              </div>`,
            intro: `
            <div class="flex flex-col items-center">
             <p class="ml-1 text-lg font-bold ">${t("welcomeToECCMon")}</p> 
              <p class="text-md text-center"> ${t("getStarted")}</p> 
            </div>`,
            tooltipClass:
              "bg-gray-800 text-primaryText p-4 rounded-lg shadow-xl",
            highlightClass: "ring-4 ring-primary",
          },
          {
            element: "#inventory-summary",
            intro: t("inventoryOverview"),
          },
          {
            element: "#history-summary",
            intro: t("historySummary"),
          },
        ],
        showProgress: true,
        showBullets: false,
        progressAnimation: true,
      });

      intro.onbeforechange(() => {
        const nextButton = document.querySelector(".introjs-nextbutton");
        const prevButton = document.querySelector(".introjs-prevbutton");

        if (nextButton) {
          nextButton.style.backgroundColor = "#00bfff";
        }

        if (prevButton) {
          prevButton.style.backgroundColor = "#fefefe"; // Customize the back button
        }
      });

      intro.oncomplete(() => {
        localStorage.setItem("homeTutorialCompleted", "true");
      });

      // When user clicks "X" button or closes the tutorial
      intro.onexit(() => {
        localStorage.setItem("homeTutorialCompleted", "true");
      });

      intro.start();
    }
  }, [t]); // Add translation function as dependency

  return null; // This component doesn't render anything itself, it just triggers the tutorial.
};

export default Onboarding;
