import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

export const SHEET_SIZES = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
};

const ResponsiveSheet = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnBackdrop = true,
  showCloseButton = true,
  zIndex = 100,
  ariaLabel,
  header,
  bodyClassName = "",
  panelClassName = "",
  closeLabel = "Close",
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resolvedLabel = ariaLabel ?? title;
  const sizeClass = SHEET_SIZES[size] ?? SHEET_SIZES.md;

  return createPortal(
    <div
      className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-4"
      style={{ zIndex }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-label={closeLabel}
        tabIndex={-1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={resolvedLabel}
        className={`relative flex max-h-[90vh] w-[calc(100vw-24px)] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl max-sm:animate-slideUp dark:bg-gray-800 sm:w-full sm:animate-responsive-sheet-in sm:rounded-2xl ${sizeClass} pb-[env(safe-area-inset-bottom)] ${panelClassName}`}
        onClick={(event) => event.stopPropagation()}
      >
        {header ??
          (title ? (
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-600">
              <h2 className="min-w-0 pr-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h2>
              {showCloseButton ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] min-w-[44px] shrink-0 rounded-full p-2 text-gray-500 transition-all duration-200 ease-out active:scale-95 active:bg-gray-100 dark:text-gray-200 dark:active:bg-gray-700"
                  aria-label={closeLabel}
                >
                  <IoClose size={22} />
                </button>
              ) : null}
            </div>
          ) : null)}

        <div
          className={`ecc-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain ${bodyClassName}`}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ResponsiveSheet;
