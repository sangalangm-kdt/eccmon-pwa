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
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col w-full p-2">
      <label className="font-semibold">{t("qrScanner:additionalInfo")}</label>
      <div>
        <label>Mounting position on engine</label>
        <MountingPositionSelect
          mountPos={mountPos}
          setMountPos={setMountPos}
          disabled={disabled}
        />
      </div>
      <div>
        <label>Completion date</label>
        <DateField date={date} setDate={setDate} disabled={disabled} />
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
