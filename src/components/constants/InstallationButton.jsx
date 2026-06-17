import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";
import { modal } from "../styles/header";

const PwaInstallModal = ({
  isOpen,
  onClose,
  isSafari,
  canNativeInstall,
  onInstall,
}) => {
  const { t } = useTranslation("common");

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const showInstallAction = canNativeInstall || isSafari;
  const installLabel = isSafari
    ? t("pwaInstall.addToHomeScreen")
    : t("pwaInstall.install");

  const handleInstallClick = () => {
    if (canNativeInstall) {
      onInstall();
      return;
    }

    if (isSafari) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55"
        onClick={onClose}
        aria-label={t("close")}
        tabIndex={-1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwa-install-title"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="ecc-touch-btn absolute right-3 top-3 flex size-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
          aria-label={t("close")}
        >
          <IoClose size={22} aria-hidden="true" />
        </button>

        <h2
          id="pwa-install-title"
          className="pr-10 text-lg font-bold text-gray-900 dark:text-gray-50"
        >
          {t("pwaInstall.title")}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {t("pwaInstall.message")}
        </p>

        {isSafari ? (
          <p className="mt-4 whitespace-pre-line rounded-xl bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-700 dark:bg-gray-900/50 dark:text-gray-200">
            {t("installAppSafariInstructions")}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="ecc-touch-btn min-h-[44px] rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            {t("close")}
          </button>

          {showInstallAction ? (
            <button
              type="button"
              onClick={handleInstallClick}
              className="ecc-touch-btn min-h-[44px] rounded-xl bg-cyan-to-blue px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-105 active:scale-[0.99]"
            >
              {installLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
};

const InstallationButton = ({ buttonClassName }) => {
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

      if (e && typeof e.prompt === "function") {
        setDeferredPrompt(e);
        sessionStorage.setItem("deferredPrompt", true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      sessionStorage.removeItem("deferredPrompt");
      setShowModal(false);
    };

    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
      setIsSafari(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    checkStandaloneMode();

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleNativeInstall = useCallback(() => {
    if (!deferredPrompt || typeof deferredPrompt.prompt !== "function") {
      return;
    }

    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        sessionStorage.removeItem("deferredPrompt");
      }
      setDeferredPrompt(null);
      closeModal();
    });
  }, [deferredPrompt, closeModal]);

  if (isInstalled || isStandalone) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className={buttonClassName ?? modal.modalContent}
        aria-label={t("pwaInstall.title")}
      >
        {t("installApp")}
      </button>

      <PwaInstallModal
        isOpen={showModal}
        onClose={closeModal}
        isSafari={isSafari}
        canNativeInstall={Boolean(deferredPrompt)}
        onInstall={handleNativeInstall}
      />
    </>
  );
};

InstallationButton.propTypes = {
  buttonClassName: PropTypes.string,
};

export default InstallationButton;
