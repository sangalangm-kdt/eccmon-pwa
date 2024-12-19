import React, { useEffect, useState } from "react";

const InstallationButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is installed (running in standalone mode)
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
    setIsAppInstalled(isInstalled);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
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
      } else {
        console.log("User dismissed the install prompt");
        // Re-enable the install button if dismissed
        setIsInstallable(true);
      }

      setDeferredPrompt(null);
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
