import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import loginEN from "./locales/en/login";
import loginJA from "./locales/ja/login.json";
import commonEN from "./locales/en/common";
import commonJA from "./locales/ja/common.json";
import qrScannerEN from "./locales/en/qrscanner";
import qrScannerJA from "./locales/ja/qrscanner.json";
import dateEN from "./locales/en/date.json";
import dateJA from "./locales/ja/date.json";

const resources = {
  en: {
    common: commonEN,
    login: loginEN,
    qrScanner: qrScannerEN,
    date: dateEN,
  },
  ja: {
    common: commonJA,
    login: loginJA,
    qrScanner: qrScannerJA,
    date: dateJA,
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
