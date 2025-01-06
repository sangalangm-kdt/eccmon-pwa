import React, { useEffect } from "react";
import introJs from "intro.js";
import logo from "../../assets/svg/logo.svg";
import logoText from "../../assets/svg/logotext_revised3.svg";
import "intro.js/minified/introjs.min.css";

const Onboarding = () => {
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
               <p class="ml-1 text-lg font-medium ">Welcome to ECCMon!</p>
                <p class="text-sm text-center"> Let's get started with this tutorial.</p>
              </div>`,
            tooltipClass:
              "bg-gray-800 text-primaryText p-4 rounded-lg shadow-xl",
            highlightClass: "ring-4 ring-primary",
          },
          {
            element: "#inventory-summary",
            intro:
              "This section gives you an overview of your current inventory status.",
          },
          {
            element: "#history-summary",
            intro: "Here you can view a summary of your activity history.",
          },
        ],
        showProgress: true,
        showBullets: false,
        progressAnimation: true,
      });

      // Manually override the color of the progress bar
      intro.onafterchange(() => {
        const progressBar = document.querySelector(".introjs-progress");
        if (progressBar) {
          progressBar.style.backgroundColor = "#cfeeff"; // Custom color
          progressBar.style.height = "6px"; // Adjust height if needed
        }
      });

      intro.start();
      intro.oncomplete(() => {
        localStorage.setItem("homeTutorialCompleted", "true");
      });
    }
  }, []);

  return null; // This component doesn't render anything itself, it just triggers the tutorial.
};

export default Onboarding;
