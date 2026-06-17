import React from "react";
import { useTranslation } from "react-i18next";
import ResponsiveSheet from "./ResponsiveSheet";

const Modal = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation("common");

  return (
    <ResponsiveSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t("confirmDeletion.title")}
      size="sm"
      zIndex={50}
      closeLabel={t("close")}
      bodyClassName="p-4 sm:p-6"
    >
      <p className="text-sm text-gray-600 dark:text-gray-200">
        {t("confirmDeletion.message")}
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          className="min-h-[44px] rounded px-4 py-2 text-sm transition-all duration-200 active:scale-95 bg-gray-300 dark:bg-gray-600"
          onClick={onClose}
        >
          {t("confirmDeletion.cancel")}
        </button>
        <button
          type="button"
          className="min-h-[44px] rounded bg-red-400 px-4 py-2 text-sm text-white transition-all duration-200 active:scale-95"
          onClick={onConfirm}
        >
          {t("confirmDeletion.delete")}
        </button>
      </div>
    </ResponsiveSheet>
  );
};

export default Modal;
