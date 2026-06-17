import React from "react";
import {
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ResponsiveSheet from "./ResponsiveSheet";

const ChangePasswordRequestModal = ({
  result,
  onClose,
  message,
  messageKey,
}) => {
  const { t } = useTranslation("common");

  const displayMessage = messageKey ? t(messageKey) : message;

  return (
    <ResponsiveSheet
      isOpen={Boolean(result)}
      onClose={onClose}
      title={
        result === "success"
          ? t("authFeedback.successfullyChanged")
          : t("authFeedback.requestError")
      }
      size="sm"
      zIndex={50}
      closeLabel={t("close")}
      bodyClassName="p-4 sm:p-6"
    >
      <div className="flex flex-col items-center">
        {result === "success" ? (
          <IoCheckmarkCircleOutline size={50} className="text-green-500" />
        ) : (
          <IoAlertCircleOutline size={50} className="text-red-500" />
        )}
        <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
          {displayMessage}
        </p>
      </div>

      <div className="mt-4 flex justify-center">
        {result === "success" ? (
          <Link to="/login">
            <button
              type="button"
              className="min-h-[44px] rounded bg-cyan-to-blue px-4 py-2 text-white transition-all duration-200 active:scale-95 dark:bg-cyan-700"
            >
              {t("authFeedback.goToLogin")}
            </button>
          </Link>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] rounded bg-red-500 px-4 py-2 text-white transition-all duration-200 active:scale-95 dark:bg-red-700"
          >
            {t("close")}
          </button>
        )}
      </div>
    </ResponsiveSheet>
  );
};

export default ChangePasswordRequestModal;
