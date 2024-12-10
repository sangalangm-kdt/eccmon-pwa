import React from "react";
import { useTranslation } from "react-i18next";
import { inputContainerClass } from "../styles/components";

const Cycle = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full ">
      <label className="text-sm text-primaryText font-semibold">
        {t("qrScanner:cycle")}
      </label>
      <div className="border rounded">
        <input type="text" className={inputContainerClass} />
      </div>
    </div>
  );
};

export default Cycle;
