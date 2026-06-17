import React from "react";
import { useNavigate } from "react-router-dom";
import { IoReturnUpBackOutline, IoHome } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import ResponsiveSheet from "./ResponsiveSheet";

const DisposalErrorModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoBack = () => {
    navigate("/qrscanner");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <ResponsiveSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t("errorNetwork")}
      size="sm"
      zIndex={50}
      closeLabel={t("close")}
      bodyClassName="p-4 sm:p-6"
    >
      <p className="text-center text-gray-600 dark:text-gray-300">
        {t("disposalStatus")} - {t("noCylinderDataScanned")}
      </p>

      <div className="flex w-full flex-row items-center justify-between gap-2 pt-6 text-sm">
        <button
          type="button"
          onClick={handleGoBack}
          className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-gray-100 p-3 text-gray-600 transition-all duration-200 active:scale-95 dark:bg-gray-800 dark:text-gray-100"
        >
          <IoReturnUpBackOutline size={16} />
          <p className="ml-2 font-medium">{t("backToScan")}</p>
        </button>
        <button
          type="button"
          onClick={handleGoHome}
          className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-primary p-3 text-white transition-all duration-200 active:scale-95"
        >
          <IoHome size={16} />
          <p className="ml-2 font-medium">{t("home")}</p>
        </button>
      </div>
    </ResponsiveSheet>
  );
};

export default DisposalErrorModal;
