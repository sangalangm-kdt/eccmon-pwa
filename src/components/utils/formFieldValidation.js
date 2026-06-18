export const hasFieldValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
};

/** Case 0 is a valid selection. */
export const isCaseSelected = (value) =>
  value !== null && value !== undefined && `${value}`.trim() !== "";

export const getOrderNoValue = (order) => {
  if (order === null || order === undefined) return "";
  if (typeof order === "string" || typeof order === "number") {
    return `${order}`.trim();
  }
  return `${order.name ?? order.order_number ?? order.orderNumber ?? order.label ?? order.value ?? order.id ?? ""}`.trim();
};

/**
 * Validates a dropdown/select field.
 * Continue is blocked only when the field is required, options exist, and nothing is selected.
 */
export const validateSelectionField = ({
  required,
  hasOptions,
  value,
  missingSelectionMessageKey,
}) => {
  const showUnconfiguredMessage = Boolean(required && !hasOptions);

  // No options configured: nothing to select — validation passes.
  if (!hasOptions) {
    return {
      valid: true,
      blockReasonKey: null,
      showUnconfiguredMessage: false,
    };
  }

  if (!required) {
    return {
      valid: true,
      blockReasonKey: null,
      showUnconfiguredMessage,
    };
  }

  if (!hasFieldValue(value)) {
    return {
      valid: false,
      blockReasonKey: missingSelectionMessageKey,
      showUnconfiguredMessage: false,
    };
  }

  return {
    valid: true,
    blockReasonKey: null,
    showUnconfiguredMessage: false,
  };
};

export const pickContinueBlockReason = (...checks) => {
  const failed = checks.find((check) => check?.blockReasonKey);
  return failed?.blockReasonKey ?? null;
};

export const hasAvailableOptions = (options) =>
  Array.isArray(options) && options.length > 0;

/**
 * Returns message keys for invalid required fields, in display order.
 * Each entry: [messageKey, isValid]
 */
export const getMissingRequiredFieldKeys = (fieldEntries) =>
  fieldEntries
    .filter(([, isValid]) => !isValid)
    .map(([messageKey]) => messageKey);

/** Alias for getMissingRequiredFieldKeys */
export const getMissingRequiredFields = getMissingRequiredFieldKeys;

/**
 * Dev helper: returns human-readable field names that are still invalid.
 * Do not log in production UI.
 */
export const missingRequiredFields = (fieldEntries) =>
  fieldEntries.filter(([, isValid]) => !isValid).map(([messageKey]) => messageKey);

export const getContinueDisabledMessage = (missingKeys, translate) => {
  if (!missingKeys.length) return null;
  return translate(missingKeys[0]);
};
