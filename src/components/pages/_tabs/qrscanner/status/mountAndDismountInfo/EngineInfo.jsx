import React, { useEffect, useState } from "react";
import SiteNameOptions from "../../../../../constants/SiteNameOptions";
import { useTranslation } from "react-i18next";

const EngineInfo = ({
  site,
  setSite,
  engineNum,
  setEngineNum,
  opHours,
  setOpHours,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col p-2">
      <div className="flex flex-col w-full">
        <label className="font-semibold">{t("qrScanner:engineInfo")}</label>
        <SiteNameOptions setSite={setSite} />
      </div>
      <div>
        <label>{t("qrScanner:engineNo")}</label>
        <input
          value={engineNum}
          className="w-full p-2 rounded border"
          type="text"
          placeholder={t("qrScanner:enterNumber")}
          onChange={(e) => setEngineNum(e.target.value)}
        />
      </div>
      <div>
        <label>Operating hours</label>
        <input
          className="w-full p-2 rounded border"
          type="number"
          value={opHours}
          onChange={(e) => setOpHours(e.target.value)}
        />
      </div>
    </div>
  );
};

export default EngineInfo;
