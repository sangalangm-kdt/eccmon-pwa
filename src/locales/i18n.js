import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import loginEN from "./en/login";
import loginJA from "./ja/login.json";
import commonEN from "./en/common";
import commonJA from "./ja/common.json";
import qrScannerEN from "./en/qrscanner";
import qrScannerJA from "./ja/qrscanner.json";
import dateEN from "./en/date.json";
import dateJA from "./ja/date.json";
import profileEN from "./en/profile.json";
import profileJA from "./ja/profile.json";
import textSectionEN from "./en/textSection.json";
import textSectionJA from "./ja/textSection.json";
import reportBugsEN from "./en/reportBugs.json";
import reportBugsJA from "./ja/reportBugs.json";
import informationEN from "./en/information.json";
import informationJA from "./ja/information.json";

const resources = {
  en: {
    common: commonEN,
    login: loginEN,
    qrScanner: qrScannerEN,
    date: dateEN,
    profile: profileEN,
    textSection: textSectionEN,
    reportBugs: reportBugsEN,
    information: informationEN,
  },
  ja: {
    common: commonJA,
    login: loginJA,
    qrScanner: qrScannerJA,
    date: dateJA,
    profile: profileJA,
    textSection: textSectionJA,
    reportBugs: reportBugsJA,
    information: informationJA,
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
