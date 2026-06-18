import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { IoCheckmark, IoChevronDown } from "react-icons/io5";
import { transformStatusOptions } from "../utils/selectUtils";

const normalizeStatus = (status) => String(status ?? "").trim().toLowerCase();

const getNoMatchesMessage = (language) =>
  String(language).toLowerCase().startsWith("ja")
    ? "\u8a72\u5f53\u3059\u308b\u5de5\u7a0b\u304c\u3042\u308a\u307e\u305b\u3093"
    : "No operations found";

const getMenuPosition = (inputElement) => {
  if (!inputElement || typeof window === "undefined") return null;

  const rect = inputElement.getBoundingClientRect();
  const viewportPadding = 8;
  const maxMenuHeight = 256;
  const width = Math.min(rect.width, window.innerWidth - viewportPadding * 2);
  const left = Math.min(
    Math.max(rect.left, viewportPadding),
    window.innerWidth - width - viewportPadding,
  );
  const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
  const height = Math.max(96, Math.min(maxMenuHeight, spaceBelow));
  const top = Math.min(
    rect.bottom + 4,
    window.innerHeight - height - viewportPadding,
  );

  return {
    left,
    top: Math.max(top, viewportPadding),
    width,
    maxHeight: height,
  };
};

const StatusDropdown = ({
  options = [],
  selectedStatus,
  setSelectedStatus,
  disabled,
}) => {
  const { t, i18n } = useTranslation();
  const inputId = useId();
  const listboxId = `${inputId}-listbox`;
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [menuPosition, setMenuPosition] = useState(null);

  const statusOptions = useMemo(() => {
    const transformedOptions = transformStatusOptions(options, t);

    return transformedOptions.filter(
      (option, index, list) =>
        index ===
        list.findIndex(
          (item) =>
            normalizeStatus(item.value) === normalizeStatus(option.value),
        ),
    );
  }, [options, t]);

  const selectedOption = useMemo(
    () =>
      statusOptions.find(
        (option) =>
          normalizeStatus(option.value) === normalizeStatus(selectedStatus),
      ) ?? null,
    [selectedStatus, statusOptions],
  );

  const filteredOptions = useMemo(() => {
    const query = normalizeStatus(searchQuery);
    if (!query) return statusOptions;

    return statusOptions.filter((option) => {
      const label = normalizeStatus(option.label);
      const value = normalizeStatus(option.value);
      return label.includes(query) || value.includes(query);
    });
  }, [searchQuery, statusOptions]);

  const displayValue = isOpen ? searchQuery : selectedOption?.label ?? "";
  const noMatchesMessage = getNoMatchesMessage(i18n.language);

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchQuery("");
    setActiveIndex(-1);
  };

  const openDropdown = () => {
    if (disabled || statusOptions.length === 0) return;
    setIsOpen(true);
  };

  const selectOption = (option) => {
    setSelectedStatus(option.value);
    closeDropdown();
    inputRef.current?.blur();
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const updatePosition = () => {
      setMenuPosition(getMenuPosition(inputRef.current));
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (
        inputRef.current?.contains(event.target) ||
        menuRef.current?.contains(event.target)
      ) {
        return;
      }

      closeDropdown();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [searchQuery]);

  if (options.length === 0) {
    return (
      <select
        id="status-select"
        disabled
        className="w-full rounded border bg-gray-100 px-2 py-2.5 text-base text-gray-500 dark:bg-gray-600 dark:text-gray-300 md:min-h-0 md:text-sm"
      >
        <option value="">{t("qrScanner:noOptionsAvailable")}</option>
      </select>
    );
  }

  const handleKeyDown = (event) => {
    if (disabled) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeDropdown();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      openDropdown();
      setActiveIndex((currentIndex) => {
        if (filteredOptions.length === 0) return -1;
        return currentIndex < filteredOptions.length - 1
          ? currentIndex + 1
          : 0;
      });
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      openDropdown();
      setActiveIndex((currentIndex) => {
        if (filteredOptions.length === 0) return -1;
        return currentIndex > 0
          ? currentIndex - 1
          : filteredOptions.length - 1;
      });
      return;
    }

    if (event.key === "Enter") {
      if (!isOpen) {
        event.preventDefault();
        openDropdown();
        return;
      }

      if (activeIndex >= 0 && filteredOptions[activeIndex]) {
        event.preventDefault();
        selectOption(filteredOptions[activeIndex]);
      }
    }
  };

  const menu =
    isOpen && menuPosition && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={menuRef}
            id={listboxId}
            role="listbox"
            className="rounded-md border border-gray-200 bg-white py-1 text-sm shadow-xl dark:border-gray-500 dark:bg-gray-600"
            style={{
              position: "fixed",
              left: menuPosition.left,
              top: menuPosition.top,
              width: menuPosition.width,
              maxHeight: menuPosition.maxHeight,
              overflowY: "auto",
              overflowX: "hidden",
              zIndex: 9999,
            }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const isSelected =
                  normalizeStatus(option.value) ===
                  normalizeStatus(selectedStatus);
                const isActive = index === activeIndex;

                return (
                  <button
                    key={option.value}
                    id={`${listboxId}-option-${index}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`flex min-h-[48px] w-full items-center justify-between gap-3 px-4 py-3 text-left text-base transition-colors md:text-sm ${
                      isSelected
                        ? "bg-primary text-white"
                        : isActive
                          ? "bg-gray-100 text-primaryText dark:bg-gray-700 dark:text-gray-100"
                          : "text-primaryText hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectOption(option)}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {option.label}
                    </span>
                    {isSelected && (
                      <IoCheckmark
                        aria-hidden="true"
                        className="h-5 w-5 shrink-0"
                      />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="min-h-[48px] px-4 py-3 text-base text-gray-500 dark:text-gray-200 md:text-sm">
                {noMatchesMessage}
              </div>
            )}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="relative w-full">
        <input
          ref={inputRef}
          id="status-select"
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={
            isOpen && activeIndex >= 0
              ? `${listboxId}-option-${activeIndex}`
              : undefined
          }
          value={displayValue}
          disabled={disabled}
          placeholder={t("qrScanner:selectAStatus")}
          className="min-h-[48px] w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 pr-10 text-base text-primaryText outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100 dark:placeholder:text-gray-300 dark:focus:border-cyan-300 md:text-sm"
          onFocus={openDropdown}
          onClick={openDropdown}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setActiveIndex(-1);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-100"
        >
          <IoChevronDown
            className={`h-5 w-5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
      {menu}
    </>
  );
};

export default StatusDropdown;
