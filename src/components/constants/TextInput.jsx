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
}) => (
  <div className="mb-2">
    <label
      className="text-sm font-medium text-primaryText dark:text-gray-200"
      htmlFor={name}
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full rounded-md border p-2 text-primaryText focus:border-2 focus:border-primary focus:outline-none dark:bg-gray-600 dark:text-gray-200"
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);
// components/EmailInput.jsx

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
        className="mt-1 block w-full rounded-md border p-2"
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
}) => (
  <div className="mb-2">
    <label className="font-semibold text-primaryText dark:text-gray-100">
      {label}
    </label>
    <Select
      options={options}
      placeholder={placeholder}
      value={options.find((option) => option.value === value)}
      onChange={(e) => onChange(e, fieldName)}
      styles={customSelectStyles(isDarkMode)}
    />

    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);
