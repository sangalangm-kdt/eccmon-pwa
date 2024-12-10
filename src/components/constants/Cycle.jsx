import React from "react";
import { useTranslation } from "react-i18next";
import { inputContainerClass } from "../styles/components";

const Cycle = ({ cycle, setCycle }) => {
  const { t } = useTranslation();
  return (
    <div className="w-full ">
      <label className="text-sm text-primaryText font-semibold">
        {t("qrScanner:cycle")}
      </label>
      <div className="border rounded">
        <input
          type="number"
          className="border w-full p-2 rounded"
          value={cycle}
          onChange={(e) => {
            setCycle(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default Cycle;
