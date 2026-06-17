export const parseLocationsFromResponse = (response) => {
  const raw =
    response?.data?.data ?? response?.data ?? response ?? [];
  return Array.isArray(raw) ? raw : [];
};

export const normalizeLocationsList = (locations) => {
  if (locations === undefined || locations === null) return [];
  if (Array.isArray(locations)) return locations;

  const nested = locations?.data;
  return Array.isArray(nested) ? nested : [];
};

const isInvalidLocationName = (value) => {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) return true;
  if (/^(true|false)$/i.test(trimmed)) return true;
  if (/^\d+(\.\d+)?$/.test(trimmed)) return true;
  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}(?:[ T]\d{1,2}:\d{2}(?::\d{2})?)?$/.test(trimmed)) {
    return true;
  }
  if (/^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}$/.test(trimmed)) {
    return true;
  }

  return false;
};

export const locationToAffiliationOption = (location) => {
  if (location === null || location === undefined) return null;
  if (typeof location === "boolean" || typeof location === "number") return null;

  if (typeof location === "string") {
    const trimmed = location.trim();
    return isInvalidLocationName(trimmed)
      ? null
      : { value: trimmed, label: trimmed };
  }

  const value =
    location.name || location.location || location.affiliation || "";
  const trimmed = String(value).trim();
  return isInvalidLocationName(trimmed)
    ? null
    : { value: trimmed, label: trimmed };
};

export const buildAffiliationOptions = (locations) => {
  const list = normalizeLocationsList(locations);
  const seen = new Set();

  return list
    .map(locationToAffiliationOption)
    .filter((option) => {
      if (!option || seen.has(option.value)) return false;
      seen.add(option.value);
      return true;
    });
};

export const resolveAffiliationOptions = ({
  locations,
  affiliationError,
  isAffiliationLoading,
}) => {
  if (isAffiliationLoading) {
    return {
      options: [],
      showLoadError: false,
    };
  }

  if (affiliationError) {
    return {
      options: [],
      showLoadError: true,
    };
  }

  return {
    options: buildAffiliationOptions(locations),
    showLoadError: false,
  };
};
