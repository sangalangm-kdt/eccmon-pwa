import React, { useEffect, useState } from "react";
import DateField from "../../../../../constants/DateField";
import MountingPositionSelect from "../../../../../constants/MountingPositionSelect";
import { useTranslation } from "react-i18next";

const AdditionalInfo = ({
  mountPos,
  setMountPos,
  date,
  setDate,
  cycle,
  setCycle,
  disabled,
  showAlert,
  setShowAlert,
}) => {
  const { t } = useTranslation("qrScanner");

  return (
    <div className="flex flex-col w-full p-2">
      <label className="font-semibold">{t("qrScanner:additionalInfo")}</label>
      <div>
        <label>
          Mounting position on engine{" "}
          <strong className="text-red-500">*</strong>
        </label>
        <MountingPositionSelect
          mountPos={mountPos}
          setMountPos={setMountPos}
          disabled={disabled}
        />
        {showAlert && !mountPos && (
          <p className="text-red-600 text-xs">
            {t("validation.engineNumberRequired")}
          </p>
        )}
      </div>
      <div>
        <label>
          Completion date <strong className="text-red-500">*</strong>
        </label>
        <DateField date={date} setDate={setDate} disabled={disabled} />
        {showAlert && !date && (
          <p className="text-red-600 text-xs">
            {t("validation.completionDateRequired")}
          </p>
        )}
      </div>
      <div>
        <label>Cycle</label>
        <input
          className="w-full rounded p-2 border"
          type="number"
          value={cycle}
          onChange={(e) => setCycle(e.target.value)}
          disabled={true}
        />
      </div>
    </div>
  );
};

export default AdditionalInfo;
