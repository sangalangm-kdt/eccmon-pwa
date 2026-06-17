import React from "react";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";
import ResponsiveSheet from "./ResponsiveSheet";

const OptionBottomSheet = ({
  isOpen,
  onClose,
  title,
  searchValue = "",
  onSearchChange,
  searchPlaceholder,
  showSearch = true,
  children,
}) => {
  const { t } = useTranslation(["qrScanner", "common"]);

  return (
    <ResponsiveSheet
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      zIndex={100}
      closeLabel={t("qrScanner:close")}
      showCloseButton={false}
      bodyClassName="px-2 py-2"
      header={
        <div className="shrink-0 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="min-w-0 pr-2 text-base font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] shrink-0 rounded-full p-2 text-gray-500 transition-all duration-200 ease-out active:scale-95 active:bg-gray-100 dark:text-gray-200 dark:active:bg-gray-700"
              aria-label={t("qrScanner:close")}
            >
              <IoClose size={22} />
            </button>
          </div>

          {showSearch ? (
            <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-700">
              <input
                type="search"
                value={searchValue}
                onChange={(event) => onSearchChange?.(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2.5 text-base text-gray-800 outline-none focus:ring-1 focus:ring-cyan-400 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
          ) : null}
        </div>
      }
    >
      {children}
    </ResponsiveSheet>
  );
};

export default OptionBottomSheet;
