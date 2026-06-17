import React from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import ResponsiveSheet from "./ResponsiveSheet";

const ResetPasswordSuccessModal = ({ onClose }) => {
  const { t } = useTranslation("common");

  return (
    <ResponsiveSheet
      isOpen
      onClose={onClose}
      title={t("success")}
      size="sm"
      zIndex={50}
      closeLabel={t("close")}
      bodyClassName="p-4 text-center sm:p-6"
    >
      <IoCheckmarkCircle className="mx-auto text-green-500" size={50} />
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        {t("authFeedback.passwordResetSuccess")}
      </p>

      <button
        type="button"
        onClick={onClose}
        className="mt-4 min-h-[44px] w-full rounded bg-cyan-to-blue p-2 text-white transition-all duration-200 active:scale-95"
      >
        {t("done")}
      </button>
    </ResponsiveSheet>
  );
};

export default ResetPasswordSuccessModal;
