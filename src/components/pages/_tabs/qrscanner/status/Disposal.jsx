import React, { useState, useEffect } from "react";
import DateField from "../../../../constants/DateField"; // Assuming DateField component is working as expected
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const Disposal = ({ setData, disabled }) => {
  // const [disposalDate, setDisposalDate] = useState(""); // Disposal date state
  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  const { t } = useTranslation();

  const location = useLocation();
  const cylinderData = location.state?.data;
  // const [isDisposed, setIsDisposed] = useState(0); // Automatically set to 0 (not disposed) or 1 (disposed)

  useEffect(() => {
    setData({
      serialNumber: cylinderData?.serialNumber,
      location: "None",
      dateDone: date,
      cycle: cylinderData?.cycle,
    });
  }, [date]);

  return (
    <div className="flex flex-col bg-white rounded-lg pb-1">
      <div className=" p-2 w-full ">
        <h2 className="font-semibold mb-6">{t("qrScanner:disposalStatus")}</h2>
        <div className="text-sm">
          <label>{t("qrScanner:disposalDate")}</label>

          <DateField date={date} setDate={setDate} disabled={disabled} />
        </div>
      </div>
    </div>
  );
};

export default Disposal;
