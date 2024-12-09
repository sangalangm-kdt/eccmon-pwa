import React from "react";
import { useTranslation } from "react-i18next";

const Cycle = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full ">
      <label className="text-sm text-primaryText font-semibold">
        {t("qrScanner:cycle")}
      </label>
      <input type="text" className="border w-full p-2 rounded" />
    </div>
  );
};

export default Cycle;
