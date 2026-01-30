// index.jsx
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

// ✅ PWA banner (JSX version, no globals)
const ServiceWorkerRegistration = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [updateSW, setUpdateSW] = useState(null);

  useEffect(() => {
    const update = registerSW({
      immediate: true,
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        setOfflineReady(true);
      },
      onRegisterError(err) {
        console.error("SW registration error:", err);
      },
    });

    setUpdateSW(() => update);
  }, []);

  // auto-hide offline toast
  useEffect(() => {
    if (!offlineReady) return;
    const id = window.setTimeout(() => setOfflineReady(false), 2500);
    return () => window.clearTimeout(id);
  }, [offlineReady]);

  if (!needRefresh && !offlineReady) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[9999] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      {offlineReady && !needRefresh && (
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Offline ready
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
              The app is cached and can work offline.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOfflineReady(false)}
            className="rounded-lg px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            OK
          </button>
        </div>
      )}

      {needRefresh && (
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              New version available
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
              Refresh to update to the latest version.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setNeedRefresh(false)}
              className="rounded-lg px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Later
            </button>

            <button
              type="button"
              onClick={async () => {
                if (updateSW)
                  await updateSW(true); // ✅ activates new SW + reload
                else window.location.reload();
              }}
              className="rounded-lg bg-cyan-500 px-3 py-1 text-xs font-semibold text-white hover:bg-cyan-600"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Rendering the app
if (!window.reactRoot) {
  if (import.meta.env.PROD) {
    console.info = function () {};
    console.warn = function () {};
    console.error = function () {};
  }

  const rootEl = document.getElementById("root");
  if (!rootEl) throw new Error("Root element #root not found");

  const root = ReactDOM.createRoot(rootEl);
  window.reactRoot = root;

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
