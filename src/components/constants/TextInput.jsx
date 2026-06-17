// components/TextInput.jsx

import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import Select from "react-select";
import { customSelectStyles } from "../utils/selectUtils";

export const TextInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  type,
  variant = "default",
}) => {
  const labelClassName =
    variant === "auth"
      ? "mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-100"
      : "text-sm font-medium text-primaryText dark:text-gray-200";

  const inputClassName =
    variant === "auth"
      ? "ecc-touch-input w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-400 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-50 dark:placeholder:text-gray-500 md:border-gray-300 md:py-3 md:text-sm md:shadow-sm md:focus:ring-primary/25 md:dark:bg-gray-900/50"
      : "ecc-touch-input mt-1 block w-full rounded-md border p-2 text-base text-primaryText focus:border-2 focus:border-primary focus:outline-none dark:bg-gray-600 dark:text-gray-200 md:min-h-0 md:text-sm";

  return (
    <div className={variant === "auth" ? "mb-3" : "mb-2"}>
      <label className={labelClassName} htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={variant === "auth" ? inputClassName : `${inputClassName} mt-1`}
        aria-invalid={Boolean(error)}
      />
      {error ? (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}
    </div>
  );
};

export const LocationInput = ({
  label,
  name,
  value,
  onChange,
  error,
  onLocationClick,
  locationSuggestions,
  onLocationSelect,
}) => (
  <div className="relative mb-4">
    <label className="text-sm font-semibold text-primaryText" htmlFor={name}>
      {label}
    </label>
    <div className="flex items-center gap-2">
      <IoLocationOutline
        className="cursor-pointer text-gray-600"
        size={24}
        onClick={onLocationClick}
      />
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder="Enter location"
        className="ecc-touch-input mt-1 block w-full rounded-md border p-2 text-base md:min-h-0 md:text-sm"
      />
    </div>
    {locationSuggestions.length > 0 && (
      <ul className="absolute z-10 mt-2 w-full rounded-md border bg-white shadow-md">
        {locationSuggestions.map((suggestion) => (
          <li
            key={suggestion.place_id}
            className="cursor-pointer p-2 text-xs hover:bg-gray-200"
            onClick={() => onLocationSelect(suggestion)}
          >
            {suggestion.display_name}
          </li>
        ))}
      </ul>
    )}
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);
const isDarkMode = document.documentElement.classList.contains("dark");

export const RegisterSelection = ({
  label,
  options,
  value,
  onChange,
  fieldName,
  error,
  placeholder,
  variant = "default",
  isLoading = false,
  isDisabled = false,
  loadingMessage = "",
  emptyMessage = "",
  errorMessage = "",
}) => {
  const labelClassName =
    variant === "auth"
      ? "mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-100"
      : "font-semibold text-primaryText dark:text-gray-100";

  const safeOptions = options ?? [];
  const selectedValue =
    safeOptions.find((option) => option.value === value) ?? null;

  return (
    <div className={variant === "auth" ? "mb-3" : "mb-2"}>
      <label className={labelClassName}>{label}</label>
      <div className={variant === "auth" ? "mt-1" : ""}>
        <Select
          options={safeOptions}
          placeholder={placeholder}
          value={selectedValue}
          onChange={(e) => onChange(e, fieldName)}
          styles={customSelectStyles(isDarkMode)}
          isLoading={isLoading}
          isDisabled={isDisabled || isLoading}
          noOptionsMessage={() => emptyMessage || "No options"}
        />
      </div>
      {isLoading && loadingMessage ? (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400" role="status">
          {loadingMessage}
        </p>
      ) : null}
      {errorMessage ? (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
          {errorMessage}
        </p>
      ) : null}
      {!isLoading && !errorMessage && emptyMessage ? (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      ) : null}
      {error ? (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}
    </div>
  );
};
