import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { modal } from "../styles/header";

const InstallationButton = () => {
  const { t } = useTranslation("common");
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandaloneMode = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsStandalone(true);
      }
    };

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      console.log("beforeinstallprompt event fired:", e);

      // Ensure the event has a prompt function
      if (e && typeof e.prompt === "function") {
        setDeferredPrompt(e);
        sessionStorage.setItem("deferredPrompt", true); // Save state
      } else {
        console.error(
          "beforeinstallprompt event is invalid or missing prompt method"
        );
      }
    };

    const handleAppInstalled = () => {
      // console.log("App installed");
      setIsInstalled(true);
      sessionStorage.removeItem("deferredPrompt"); // Clear state
    };

    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
      setIsSafari(true);
      // console.log("Safari browser detected");
    }

    // Add event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check standalone mode
    checkStandaloneMode();

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt && typeof deferredPrompt.prompt === "function") {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          // console.log("PWA installation accepted");
          sessionStorage.removeItem("deferredPrompt");
        } else {
          // console.log("PWA installation dismissed");
        }
        setDeferredPrompt(null);
      });
    } else {
      console.error("No valid deferredPrompt available");
    }
  };

  const handleSafariInstallClick = () => {
    setShowModal(true);
    // console.log("Safari install button clicked");
  };

  const closeModal = () => {
    setShowModal(false);
    // console.log("Modal closed");
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // // Debugging outputs
  // console.log("Deferred Prompt:", deferredPrompt);
  // console.log("isInstalled:", isInstalled);
  // console.log("isStandalone:", isStandalone);
  // console.log("isSafari:", isSafari);

  // Return nothing if the app is already installed or running in standalone mode
  if (isInstalled || isStandalone) return null;

  return (
    <div>
      {/* Safari-specific modal for installation instructions */}
      {isSafari && (
        <>
          <button
            onClick={handleSafariInstallClick}
            className={`${modal.modalContent}`}
            aria-label={t("installApp")}
          >
            {t("installApp")}
          </button>
          {showModal && (
            <div
              className={`${modal.modalBackground}`}
              onClick={handleModalClick}
            >
              <div className={`${modal.modalContainer}`}>
                <span className={`${modal.exitButton}`} onClick={closeModal}>
                  ×
                </span>
                <p className="text-lg font-bold">{t("installAppSafari")}</p>
                <p className="ml-2 whitespace-pre-line mt-5 text-sm">
                  {t("installAppSafariInstructions")}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Non-Safari browsers (e.g., Chrome, Edge) */}
      {!isSafari && deferredPrompt && (
        <button
          onClick={handleInstallClick}
          className={`${modal.modalContent}`}
          aria-label={t("installApp")}
        >
          {t("installApp")}
        </button>
      )}
    </div>
  );
};

export default InstallationButton;
