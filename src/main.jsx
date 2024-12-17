import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import store from "./state/store";
import { Provider } from "react-redux";

// Import the PWA registration utility from vite-plugin-pwa
import { registerSW } from "virtual:pwa-register";

const ServiceWorkerRegistration = () => {
  useEffect(() => {
    // Register the service worker to enable PWA functionality
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
        },
      });
    } else {
      console.log("Service worker is not supported in this browser.");
    }
  }, []); // Empty dependency array ensures this runs once when the app mounts

  return null; // This component doesn't need to render anything
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ServiceWorkerRegistration />
        <App />
      </I18nextProvider>
    </Provider>
  </React.StrictMode>
);
