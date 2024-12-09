import React from "react";
import { useTranslation } from "react-i18next";

const Cycle = ({cycle, setCycle}) => {
  const { t } = useTranslation();
  return (
    <div className="w-full ">
      <label className="text-sm text-primaryText font-semibold">
        {t("qrScanner:cycle")}
      </label>
      <input type="number" className="border w-full p-2 rounded" value={cycle} onChange={(e) => {setCycle(e.target.value)}} />
    </div>
  );
};

export default Cycle;
