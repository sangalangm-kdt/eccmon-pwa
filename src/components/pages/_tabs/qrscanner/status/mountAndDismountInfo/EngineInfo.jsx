import React from "react";
import SiteNameOptions from "../../../../../constants/SiteNameOptions";
import { useTranslation } from "react-i18next";

const EngineInfo = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col p-2">
      <div className="flex flex-col w-full">
        <label className="font-semibold">{t("qrScanner:engineInfo")}</label>
        <SiteNameOptions />
      </div>
      <div>
        <label>{t("qrScanner:engineNo")}</label>
        <input
          className="w-full p-2 rounded border"
          type="text"
          placeholder={t("qrScanner:enterNumber")}
        />
      </div>
      <div>
        <label>{t("qrScanner:operatingHours")}</label>
        <input className="w-full p-2 rounded border" />
      </div>
    </div>
  );
};

export default EngineInfo;
