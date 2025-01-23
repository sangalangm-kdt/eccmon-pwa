import React from "react";
import { useTranslation } from "react-i18next";
import { inputContainerClass } from "../styles/components";

const Cycle = ({ cycle, setCycle, disabled }) => {
  const { t } = useTranslation();
  return (
    <div className="w-full">
      <label className="text-sm font-semibold text-primaryText">
        {t("qrScanner:cycle")}
      </label>
      <div className="rounded">
        <input
          type="number"
          className="w-full rounded border p-2 dark:bg-gray-600"
          value={cycle}
          onChange={(e) => {
            setCycle(e.target.value);
          }}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default Cycle;
