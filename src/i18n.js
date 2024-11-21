import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import loginEN from "./locales/en/login";
import loginJA from "./locales/ja/login.json";
import commonEN from "./locales/en/common.json";
import commonJA from "./locales/ja/common.json";
import qrScannerEN from "./locales/en/qrscanner.json";
import qrScannerJA from "./locales/ja/qrscanner.json";

const resources = {
  en: {
    common: commonEN,
    login: loginEN,
    qrScanner: qrScannerEN,
  },
  ja: {
    common: commonJA,
    login: loginJA,
    qrScanner: qrScannerJA,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
