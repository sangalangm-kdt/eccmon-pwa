import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { modal } from "../styles/header";

const InstallationButton = () => {
  const { t } = useTranslation("common");
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isIncognito, setIsIncognito] = useState(false);

  useEffect(() => {
    const handleAppInstalled = () => {
      setIsInstalled(true);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    const handleBeforeInstallPrompt = (e) => {
      // console.log("beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Detect if the user is on Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
      setIsSafari(true);
    }

    // Detect if the user is in incognito mode
    const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
    if (fs) {
      fs(
        window.TEMPORARY,
        100,
        () => setIsIncognito(false),
        () => setIsIncognito(true),
      );
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
      });
    }
  };

  const handleSafariInstallClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (isInstalled) return null;

  return (
    <div>
      {isSafari && (
        <button
          onClick={handleSafariInstallClick}
          className={`${modal.modalContent}`}
        >
          {t("installApp")}
        </button>
      )}
      {isSafari && showModal && (
        <div className={`${modal.modalBackground}`} onClick={handleModalClick}>
          <div className={`${modal.modalContainer}`}>
            <span className={`${modal.exitButton}`} onClick={closeModal}>
              ×
            </span>
            <p className="text-lg font-bold ">{t("installAppSafari")}</p>
            <p>{t("installAppSafariInstructions")}</p>
          </div>
        </div>
      )}
      {!isSafari && deferredPrompt && !isIncognito && (
        <button
          onClick={handleInstallClick}
          className={`${modal.modalContent}`}
        >
          {t("installApp")}
        </button>
      )}
      {isIncognito && <p>{t("incognitoModeNotSupported")}</p>}
    </div>
  );
};

export default InstallationButton;
