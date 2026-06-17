import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoArrowBack } from "react-icons/io5";

const FullScreenSheet = ({
  isOpen,
  onClose,
  title,
  stickyContent,
  children,
  zIndex = 110,
  closeLabel = "Back",
  ariaLabel,
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

  return createPortal(
    <div
      className="fixed inset-0 flex flex-col bg-white dark:bg-gray-800"
      style={{ zIndex, height: "100dvh", maxHeight: "100dvh" }}
      role="dialog"
      aria-modal="true"
      aria-label={resolvedLabel}
    >
      <header
        className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-3 py-3 dark:border-gray-600 dark:bg-gray-800"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center gap-1 rounded-lg px-2 text-cyan-500 transition-all duration-200 ease-out active:scale-95 active:bg-gray-100 dark:active:bg-gray-700"
          aria-label={closeLabel}
        >
          <IoArrowBack size={20} />
          <span className="text-sm font-medium">{closeLabel}</span>
        </button>

        <h1 className="min-w-0 flex-1 truncate text-center text-base font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h1>

        <span className="min-w-[44px] shrink-0" aria-hidden="true" />
      </header>

      {stickyContent ? (
        <div className="shrink-0 border-b border-gray-200 bg-white px-3 py-3 dark:border-gray-600 dark:bg-gray-800">
          {stickyContent}
        </div>
      ) : null}

      <div className="ecc-scroll ecc-scroll-subtle min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pb-[env(safe-area-inset-bottom)]">
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default FullScreenSheet;
