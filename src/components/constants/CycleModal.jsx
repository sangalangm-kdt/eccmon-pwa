import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoReturnUpBackOutline, IoHome } from "react-icons/io5";
import { GrPowerCycle } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import ResponsiveSheet from "./ResponsiveSheet";

const CycleModal = ({ selectedStatus, cycle: savedCycle, data, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const cylinderData = location.state?.data;

  const hasSavedCycle =
    savedCycle !== undefined &&
    savedCycle !== null &&
    `${savedCycle}`.trim() !== "";
  const baseCycle = Number(hasSavedCycle ? savedCycle : data?.cycle) || 1;

  const cycle =
    !hasSavedCycle &&
    cylinderData?.status === "Dismounted" &&
    selectedStatus === "Storage"
      ? baseCycle + 1
      : baseCycle;

  const handleBackToQR = () => {
    navigate("/qrscanner");
  };

  const handleGoToHome = () => {
    navigate("/");
  };

  return (
    <ResponsiveSheet
      isOpen
      onClose={onClose}
      title={t("qrScanner:label.currentCycle")}
      size="sm"
      zIndex={50}
      closeLabel={t("common:close")}
      bodyClassName="p-4 sm:p-6"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="p-2">
          <GrPowerCycle size={32} color="#41c88b" />
        </div>

        <div className="mt-2 w-full rounded-lg bg-gray-100 py-2 text-center shadow-inner dark:bg-gray-700">
          <p className="text-lg font-bold text-gray-700 dark:text-gray-200">
            {cycle}
          </p>
        </div>

        <div className="flex w-full flex-row items-center justify-between gap-2 pt-6 text-sm">
          <button
            type="button"
            onClick={handleBackToQR}
            className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-gray-100 p-3 text-gray-600 transition-all duration-200 active:scale-95 dark:bg-gray-800 dark:text-gray-100"
          >
            <IoReturnUpBackOutline size={16} />
            <p className="ml-2 font-medium">{t("qrScanner:label.backToQR")}</p>
          </button>
          <button
            type="button"
            onClick={handleGoToHome}
            className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-primary p-3 text-white transition-all duration-200 active:scale-95"
          >
            <IoHome size={16} />
            <p className="ml-2 font-medium">{t("qrScanner:label.goToHome")}</p>
          </button>
        </div>
      </div>
    </ResponsiveSheet>
  );
};

export default CycleModal;
