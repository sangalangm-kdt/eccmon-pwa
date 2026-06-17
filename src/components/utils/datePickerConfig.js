import { registerLocale } from "react-datepicker";
import { enUS, ja } from "date-fns/locale";

registerLocale("en", enUS);
registerLocale("ja", ja);

export const DATE_PICKER_DISPLAY_FORMAT = "yyyy-MM-dd";
export const DATE_INPUT_MAX_LENGTH = 10;
const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const getDatePickerLocale = (language) =>
  language?.startsWith("ja") ? "ja" : "en";

const toComparableDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export const isValidDateParts = (year, month, day) => {
  if (!Number.isInteger(year) || year < 1000 || year > 9999) return false;
  if (!Number.isInteger(month) || month < 1 || month > 12) return false;
  if (!Number.isInteger(day) || day < 1 || day > 31) return false;

  const parsed = new Date(year, month - 1, day);
  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  );
};

/** Auto-insert hyphens while the user types digits (YYYY-MM-DD). */
export const formatDateInputWhileTyping = (raw) => {
  const digits = `${raw}`.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
};

export const isDateWithinRange = (date, minDate, maxDate) => {
  if (!date || Number.isNaN(date.getTime())) return false;

  const value = toComparableDay(date);
  if (minDate && value < toComparableDay(minDate)) return false;
  if (maxDate && value > toComparableDay(maxDate)) return false;
  return true;
};

export const validateDateInputString = (value, { minDate, maxDate } = {}) => {
  const trimmed = `${value ?? ""}`.trim();

  if (!trimmed) {
    return { valid: true, date: null, complete: true, error: false };
  }

  if (!DATE_INPUT_PATTERN.test(trimmed)) {
    return { valid: false, date: null, complete: trimmed.length >= DATE_INPUT_MAX_LENGTH, error: true };
  }

  const [year, month, day] = trimmed.split("-").map(Number);

  if (!isValidDateParts(year, month, day)) {
    return { valid: false, date: null, complete: true, error: true };
  }

  const date = new Date(year, month - 1, day);

  if (!isDateWithinRange(date, minDate, maxDate)) {
    return { valid: false, date: null, complete: true, error: true };
  }

  return { valid: true, date, complete: true, error: false };
};

/** Controlled YYYY-MM-DD display — never uses device locale formatting. */
export const formatDatePickerDisplay = (date) => {
  if (!date || Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const parseDatePickerValue = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "string") {
    const datePart = value.split("T")[0]?.trim();
    if (!datePart) return null;

    const result = validateDateInputString(datePart);
    return result.valid ? result.date : null;
  }

  return null;
};
