import React, { useEffect, useState } from "react";

const InstallationButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is installed (running in standalone mode)
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
    setIsAppInstalled(isInstalled);

    // Restore deferred prompt from session storage, if available
    const storedPrompt = sessionStorage.getItem("deferredPrompt");
    if (storedPrompt) {
      setDeferredPrompt(JSON.parse(storedPrompt));
      setIsInstallable(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      sessionStorage.setItem("deferredPrompt", JSON.stringify(e));
      console.log("beforeinstallprompt event captured");
    };

    // Add listener for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      const promptEvent = deferredPrompt;
      promptEvent.prompt();

      const choiceResult = await promptEvent.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
        setDeferredPrompt(null);
        setIsInstallable(false);
        sessionStorage.removeItem("deferredPrompt");
      } else {
        console.log("User dismissed the install prompt");
        setIsInstallable(true); // Keep button visible for retry
      }
    }
  };

  // Don't show the install button if the app is already installed
  if (isAppInstalled) {
    return null;
  }

  return (
    <div>
      {isInstallable && (
        <button onClick={handleInstallClick}>Install App</button>
      )}
    </div>
  );
};

export default InstallationButton;
