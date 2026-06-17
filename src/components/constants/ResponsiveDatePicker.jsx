import React, { useEffect, useId, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import { FaRegCalendar } from "react-icons/fa6";
import ResponsiveSheet from "./ResponsiveSheet";
import {
  DATE_INPUT_MAX_LENGTH,
  DATE_PICKER_DISPLAY_FORMAT,
  formatDateInputWhileTyping,
  formatDatePickerDisplay,
  getDatePickerLocale,
  validateDateInputString,
} from "../utils/datePickerConfig";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const SELECTION_CLOSE_DELAY_MS = 180;

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleChange = (event) => setPrefersReducedMotion(event.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
};

const ResponsiveDatePicker = ({
  selected,
  onChange,
  disabled = false,
  placeholder,
  minDate,
  maxDate,
  className = "",
  id,
  title,
}) => {
  const { t, i18n } = useTranslation(["date", "common", "qrScanner"]);
  const prefersReducedMotion = usePrefersReducedMotion();
  const errorId = useId();
  const inputRef = useRef(null);
  const closeTimerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [monthAnim, setMonthAnim] = useState(null);
  const [visibleMonth, setVisibleMonth] = useState(() => selected ?? new Date());
  const [inputValue, setInputValue] = useState(() =>
    formatDatePickerDisplay(selected),
  );
  const [showError, setShowError] = useState(false);

  const locale = getDatePickerLocale(i18n.language);
  const resolvedPlaceholder =
    placeholder ?? t("date:placeholder", { defaultValue: "YYYY-MM-DD" });
  const dialogTitle =
    title ?? t("date:pickDate", { defaultValue: "Select date" });
  const rangeOptions = { minDate, maxDate };

  const parseInputToDate = (value) =>
    validateDateInputString(value, rangeOptions).date;

  const commitValidDate = (date) => {
    if (!date) {
      onChange?.(null);
      setInputValue("");
      setShowError(false);
      return;
    }

    setInputValue(formatDatePickerDisplay(date));
    setShowError(false);
    setVisibleMonth(date);
    onChange?.(date);
  };

  useEffect(() => {
    setInputValue(formatDatePickerDisplay(selected));
    setShowError(false);
  }, [selected]);

  useEffect(() => {
    if (isOpen) {
      setVisibleMonth(selected ?? parseInputToDate(inputValue) ?? new Date());
      setMonthAnim(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selected]);

  useEffect(() => {
    if (!monthAnim) return undefined;

    const timer = window.setTimeout(() => setMonthAnim(null), 200);
    return () => window.clearTimeout(timer);
  }, [monthAnim]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

  const handleInputChange = (event) => {
    const formatted = formatDateInputWhileTyping(event.target.value);
    setInputValue(formatted);
    setShowError(false);

    if (formatted.length === DATE_INPUT_MAX_LENGTH) {
      const result = validateDateInputString(formatted, rangeOptions);
      if (result.valid) {
        commitValidDate(result.date);
      } else if (result.complete) {
        setShowError(true);
      }
    }
  };

  const handleInputBlur = () => {
    const trimmed = inputValue.trim();

    if (!trimmed) {
      commitValidDate(null);
      return;
    }

    const result = validateDateInputString(trimmed, rangeOptions);

    if (result.valid) {
      commitValidDate(result.date);
      return;
    }

    setShowError(true);
  };

  const openPicker = () => {
    if (disabled) return;
    setIsOpen(true);
  };

  const closePicker = () => {
    setIsOpen(false);
  };

  const handleSelect = (date) => {
    commitValidDate(date);

    if (prefersReducedMotion) {
      closePicker();
      return;
    }

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      closePicker();
      closeTimerRef.current = null;
    }, SELECTION_CLOSE_DELAY_MS);
  };

  const handleMonthChange = (date) => {
    if (!prefersReducedMotion) {
      const direction = date > visibleMonth ? "next" : "prev";
      setMonthAnim(direction);
    }

    setVisibleMonth(date);
  };

  const calendarClassName = [
    "eccmon-datepicker-calendar",
    monthAnim === "next" ? "eccmon-datepicker-calendar--month-next" : "",
    monthAnim === "prev" ? "eccmon-datepicker-calendar--month-prev" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const calendar = (
    <DatePicker
      inline
      selected={selected}
      onChange={handleSelect}
      onMonthChange={handleMonthChange}
      onYearChange={handleMonthChange}
      locale={locale}
      dateFormat={DATE_PICKER_DISPLAY_FORMAT}
      minDate={minDate}
      maxDate={maxDate}
      disabled={disabled}
      fixedHeight
      calendarClassName={calendarClassName}
    />
  );

  const overlay = (
    <ResponsiveSheet
      isOpen={isOpen}
      onClose={closePicker}
      title={dialogTitle}
      size="sm"
      zIndex={120}
      closeLabel={t("common:close")}
      bodyClassName="p-3 sm:p-4"
      ariaLabel={dialogTitle}
    >
      {calendar}
    </ResponsiveSheet>
  );

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`flex min-h-[44px] items-stretch overflow-hidden rounded border bg-white transition-colors duration-200 ease-out dark:bg-gray-700 ${
          showError
            ? "border-red-500 focus-within:ring-1 focus-within:ring-red-400"
            : "border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary dark:border-gray-600"
        } ${disabled ? "bg-gray-100 dark:bg-gray-800" : ""}`}
      >
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          disabled={disabled}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={resolvedPlaceholder}
          maxLength={DATE_INPUT_MAX_LENGTH}
          aria-invalid={showError}
          aria-describedby={showError ? errorId : undefined}
          className="min-h-[44px] min-w-0 flex-1 touch-manipulation bg-transparent px-3 py-2.5 text-base text-gray-800 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:text-gray-500 dark:text-gray-100 dark:placeholder:text-gray-500"
        />

        <button
          type="button"
          disabled={disabled}
          onClick={openPicker}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={t("date:openCalendar", { defaultValue: "Open calendar" })}
          className="flex min-h-[44px] min-w-[44px] shrink-0 touch-manipulation items-center justify-center border-l border-gray-200 px-3 text-gray-500 transition-all duration-200 ease-out active:scale-95 active:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:text-gray-300 dark:active:bg-gray-600"
        >
          <FaRegCalendar size={18} aria-hidden="true" />
        </button>
      </div>

      <p
        id={errorId}
        role="alert"
        className={`mt-1 text-sm text-red-500 transition-all duration-200 ease-out dark:text-red-400 ${
          showError ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {t("date:invalidDate", {
          defaultValue: "Please enter a valid date.",
        })}
      </p>

      {overlay}
    </div>
  );
};

export default ResponsiveDatePicker;
