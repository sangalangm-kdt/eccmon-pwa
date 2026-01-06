// index.js
import React, { StrictMode, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { ThemeProvider } from "./context/theme-context";
import { I18nextProvider } from "react-i18next";
import i18n from "./locales/i18n";
import store from "./state/store";

import { registerSW } from "virtual:pwa-register";

// Initialize PWA registration
const ServiceWorkerRegistration = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      registerSW({
        onOfflineReady() {
          console.log("The PWA is ready to work offline.");
        },
        onNeedRefresh() {
          console.log("Content needs to be refreshed.");
        },
        onUpdated() {
          console.log("The PWA has been updated.");
          setIsUpdateAvailable(true);
        },
      });
    }
  }, []);

  return isUpdateAvailable ? (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 p-4 text-white">
      <span>New content is available! Please refresh to update.</span>
      <button
        onClick={() => window.location.reload()}
        className="rounded bg-blue-800 px-4 py-2"
      >
        Refresh
      </button>
    </div>
  ) : null;
};

// Rendering the app with the WebSocketProvider
if (!window.reactRoot) {
  if (import.meta.env.PROD) {
    console.log = function () {};
    console.info = function () {};
    console.warn = function () {};
    console.error = function () {};
  }

  const root = ReactDOM.createRoot(document.getElementById("root"));
  window.reactRoot = root; // Store it globally
  root.render(
    <StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <I18nextProvider i18n={i18n}>
            <ServiceWorkerRegistration />
            <App />
          </I18nextProvider>
        </ThemeProvider>
      </Provider>
    </StrictMode>,
  );
} else {
  console.warn(
    "React root is already initialized. Skipping re-initialization.",
  );
}
