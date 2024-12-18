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
  const [shouldShowButton, setShouldShowButton] = useState(true);

  useEffect(() => {
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShouldShowButton(false);
      console.log("App has been installed");
    };

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      console.log("Beforeinstallprompt event captured:", e);
      setDeferredPrompt(e);
    };

    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone
    ) {
      setIsStandalone(true);
      setShouldShowButton(false);
      console.log("App is running in standalone mode");
    } else {
      setIsStandalone(false);
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
      setIsSafari(true);
      console.log("Safari browser detected");
    } else {
      setIsSafari(false);
    }

    console.log({
      isInstalled,
      isStandalone,
      isSafari,
      shouldShowButton,
    });

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isInstalled, isStandalone, isSafari, shouldShowButton]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the PWA installation");
      } else {
        console.log("User dismissed the PWA installation");
      }
      setDeferredPrompt(null);
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

  console.log("Render state:", {
    isInstalled,
    isStandalone,
    shouldShowButton,
    isSafari,
    deferredPrompt,
  });

  if (isInstalled || isStandalone || !shouldShowButton) return null;

  return (
    <div>
      {/* Safari specific handling */}
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

      {/* For other browsers (non-Safari) */}
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
