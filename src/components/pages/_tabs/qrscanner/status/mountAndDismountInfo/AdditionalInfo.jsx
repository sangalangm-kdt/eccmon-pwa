import React from "react";
import DateField from "../../../../../constants/DateField";
import MountingPositionSelect from "../../../../../constants/MountingPositionSelect";
import { useTranslation } from "react-i18next";

const AdditionalInfo = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col w-full p-2">
      <label className="font-semibold">{t("qrScanner:additionalInfo")}</label>
      <div>
        <label>{t("qrScanner:mountingPosition")}</label>
        <MountingPositionSelect />
      </div>
      <div>
        <label>{t("qrScanner:completionDate")}</label>
        <DateField />
      </div>
      <div>
        <label>{t("qrScanner:cycle")}</label>
        <input className="w-full rounded p-2 border" type="number" />
      </div>
    </div>
  );
};

export default AdditionalInfo;
