import React, { useEffect, useMemo, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import OptionBottomSheet from "./OptionBottomSheet";

const getOptionLabel = (option) =>
  option?.label ?? option?.name ?? option?.value ?? "";

const getOptionValue = (option) =>
  option?.value ?? option?.name ?? option?.label ?? "";

const getOptionKey = (option, index) =>
  option?.id ?? `${getOptionValue(option)}-${index}`;

const groupOptionsByLetter = (options) =>
  options.reduce((groups, option) => {
    const label = getOptionLabel(option);
    const firstLetter = label?.charAt(0)?.toUpperCase();
    if (!firstLetter) return groups;
    if (!groups[firstLetter]) groups[firstLetter] = [];
    groups[firstLetter].push(option);
    return groups;
  }, {});

const OptionRow = ({ label, selected, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`flex min-h-12 w-full items-center rounded-lg px-3 text-left text-sm transition-colors ${
      selected
        ? "bg-cyan-50 font-medium text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-200"
        : "text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
    }`}
  >
    {label}
  </button>
);

const SearchableOptionField = ({
  label,
  value,
  displayValue,
  placeholder,
  title,
  searchPlaceholder,
  options = [],
  onChange,
  disabled = false,
  required = false,
  error,
  groupByLetter = false,
  isLoading = false,
  loadingContent = null,
  showSearch = true,
  emptySearchMessage,
  onOptionsAvailabilityChange,
  showUnconfiguredMessage = false,
}) => {
  const { t } = useTranslation("qrScanner");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const hasOptions = options.length > 0;
  const canOpen = !disabled && !isLoading && hasOptions;
  const shownValue = displayValue ?? value;

  useEffect(() => {
    onOptionsAvailabilityChange?.(!isLoading && hasOptions);
  }, [hasOptions, isLoading, onOptionsAvailabilityChange]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const query = searchTerm.trim().toLowerCase();
    return options.filter((option) =>
      getOptionLabel(option).toLowerCase().includes(query),
    );
  }, [options, searchTerm]);

  const groupedOptions = useMemo(() => {
    if (!groupByLetter || searchTerm.trim()) return null;
    return groupOptionsByLetter(filteredOptions);
  }, [filteredOptions, groupByLetter, searchTerm]);

  const handleOpen = () => {
    if (!canOpen) return;
    setSearchTerm("");
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleSelect = (option) => {
    onChange(getOptionValue(option));
    handleClose();
  };

  const renderListContent = () => {
    if (isLoading) {
      return (
        loadingContent ?? (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-300">
            {t("loadingOptions")}
          </p>
        )
      );
    }

    if (!hasOptions) {
      return (
        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-300">
          {t("noOptionsAvailable")}
        </p>
      );
    }

    if (searchTerm.trim() && filteredOptions.length === 0) {
      return (
        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-300">
          {t(emptySearchMessage ?? "noMatchingSiteFound")}
        </p>
      );
    }

    if (groupedOptions) {
      return Object.keys(groupedOptions)
        .sort()
        .map((letter) => (
          <div key={letter} className="mb-3">
            <p className="sticky top-0 z-10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              {letter}
            </p>
            <div className="space-y-1">
              {groupedOptions[letter].map((option, index) => (
                <OptionRow
                  key={getOptionKey(option, index)}
                  label={getOptionLabel(option)}
                  selected={getOptionValue(option) === value}
                  onSelect={() => handleSelect(option)}
                />
              ))}
            </div>
          </div>
        ));
    }

    return (
      <div className="space-y-1">
        {filteredOptions.map((option, index) => (
          <OptionRow
            key={getOptionKey(option, index)}
            label={getOptionLabel(option)}
            selected={getOptionValue(option) === value}
            onSelect={() => handleSelect(option)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-2 flex w-full flex-col">
      {label && (
        <label className="text-sm font-semibold text-primaryText dark:text-gray-100">
          {label}
          {required && <strong className="text-red-500"> *</strong>}
        </label>
      )}

      {isLoading ? (
        <div className="mt-1">{loadingContent}</div>
      ) : (
        <div className="relative w-full">
          <input
            className={`w-full rounded border bg-transparent px-2 py-2.5 pr-10 text-sm dark:bg-gray-600 ${
              disabled || !hasOptions
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer"
            }`}
            type="text"
            placeholder={placeholder}
            value={shownValue || ""}
            readOnly
            onClick={handleOpen}
            disabled={disabled}
          />

          <button
            type="button"
            className={`absolute right-2 top-1/2 -translate-y-1/2 transform ${
              canOpen ? "" : "cursor-not-allowed opacity-50"
            }`}
            onClick={handleOpen}
            disabled={!canOpen}
            aria-label={title}
          >
            <FaChevronRight className="text-primaryText dark:text-gray-50" />
          </button>
        </div>
      )}

      {!hasOptions && !isLoading && showUnconfiguredMessage && (
        <p className="mt-1 text-xs text-amber-600 dark:text-amber-300">
          {t("noSiteNamesConfigured")}
        </p>
      )}

      {!hasOptions && !isLoading && !showUnconfiguredMessage && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">
          {t("noOptionsAvailable")}
        </p>
      )}

      {error}

      <OptionBottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title={title}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={searchPlaceholder}
        showSearch={showSearch && hasOptions}
      >
        {renderListContent()}
      </OptionBottomSheet>
    </div>
  );
};

export default SearchableOptionField;
