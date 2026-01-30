import React, { useEffect, useState } from "react";
import DateField from "../../../../constants/DateField";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const buildNowLocalDateTime = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

const Disposal = ({ setData, disabled, setIsComplete }) => {
  const [date, setDate] = useState(buildNowLocalDateTime);
  const { t } = useTranslation();
  const location = useLocation();
  const cylinderData = location.state?.data;

  useEffect(() => {
    const serialNumber = cylinderData?.serialNumber ?? "";
    const cycle = cylinderData?.cycle ?? ""; // keep as "" if missing

    setData((prev) => ({
      ...prev,
      serialNumber,
      status: "Disposal", // ✅ important
      location: "None",
      dateDone: date, // disposal date
      cycle,
    }));

    setIsComplete(Boolean(date));
  }, [date, cylinderData, setData, setIsComplete]);

  return (
    <div className="flex flex-col rounded-lg bg-white pb-1 dark:bg-gray-500">
      <div className="w-full p-2">
        <h2 className="mb-6 font-semibold">{t("qrScanner:disposalStatus")}</h2>

        <div className="text-sm">
          <label className="mb-1 block">{t("qrScanner:disposalDate")}</label>
          <DateField date={date} setDate={setDate} disabled={disabled} />
        </div>
      </div>
    </div>
  );
};

export default Disposal;
