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
    const handleAppInstalled = () => {
      setIsInstalled(true);
      console.log("App has been installed");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("Beforeinstallprompt event fired");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if the app is running in standalone mode (iOS or Android PWA)
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone
    ) {
      setIsStandalone(true);
      console.log("App is running in standalone mode");
    }

    // Detect Safari browser (both iOS and macOS)
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
      setIsSafari(true);
      console.log("Safari browser detected");
    }

    // Detect Android browser
    const isAndroid = userAgent.includes("android");
    console.log("isAndroid:", isAndroid);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("PWA installation accepted");
        } else {
          console.log("PWA installation dismissed");
        }
        setDeferredPrompt(null);
      });
    }
  };

  const handleSafariInstallClick = () => {
    setShowModal(true);
    console.log("Safari install button clicked");
  };

  const closeModal = () => {
    setShowModal(false);
    console.log("Modal closed");
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (isInstalled || isStandalone) return null;

  return (
    <div>
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
