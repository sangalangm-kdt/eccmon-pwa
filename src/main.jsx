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
    // Register service worker with the Vite PWA plugin
    registerSW({
      onSuccess() {
        console.log("Service worker registered successfully.");
      },
      onError(error) {
        console.error("Service worker registration failed: ", error);
      },
    });
  }, []);

  return null;
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        {/* Service worker registration */}
        <ServiceWorkerRegistration />
        <App />
      </I18nextProvider>
    </Provider>
  </React.StrictMode>
);
