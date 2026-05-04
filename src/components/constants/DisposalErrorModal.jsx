import React from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { IoReturnUpBackOutline, IoHome } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const DisposalErrorModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleGoBack = () => {
    navigate("/qrscanner");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div
        className="relative bg-white rounded-lg shadow-lg w-96 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
        >
          <IoClose size={20} />
        </button>

        {/* Modal Content */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-center text-red-500">
            {t("errorNetwork")}
          </h2>
          <p className="text-gray-600 mt-4 text-center">
            {t("disposalStatus")} - {t("noCylinderDataScanned")}
          </p>

          {/* Buttons */}
          <div className="flex flex-row w-full justify-between items-center text-sm pt-6">
            <button
              onClick={handleGoBack}
              className="flex w-full bg-gray-100 p-3 rounded-lg mr-2 items-center justify-center text-gray-600 hover:bg-gray-200 transition"
            >
              <IoReturnUpBackOutline size={16} />
              <p className="ml-2 font-medium">{t("backToScan")}</p>
            </button>
            <button
              onClick={handleGoHome}
              className="flex w-full bg-blue-500 p-3 rounded-lg text-white justify-center hover:bg-blue-600 transition"
            >
              <IoHome size={16} />
              <p className="ml-2 font-medium">{t("home")}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisposalErrorModal;
