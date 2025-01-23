// components/TextInput.jsx

import React from "react";
import { IoLocationOutline } from "react-icons/io5";
export const TextInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
}) => (
  <div className="mb-1">
    <label className="text-sm font-semibold text-primaryText" htmlFor={name}>
      {label}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full rounded-md border p-2"
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);
// components/EmailInput.jsx

export const EmailInput = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
}) => (
  <div className="mb-4">
    <label className="text-sm font-semibold text-primaryText" htmlFor={name}>
      {label}
    </label>
    <input
      type="email"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full rounded border p-2 text-sm focus:ring-1 focus:ring-primary"
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

export const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
}) => (
  <div className="mb-4">
    <label className="text-sm font-semibold text-primaryText" htmlFor={name}>
      {label}
    </label>
    <input
      type="password"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full rounded-md border p-2"
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

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
