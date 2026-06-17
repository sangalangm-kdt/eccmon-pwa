export const AUTH_ERROR_KEYS = {
  accountNotFound: "common:authErrors.accountNotFound",
  emailRequired: "common:authErrors.emailRequired",
  invalidCredentials: "common:authErrors.invalidCredentials",
  invalidEmail: "common:authErrors.invalidEmail",
  network: "common:authErrors.network",
  passwordConfirmationMismatch:
    "common:authErrors.passwordConfirmationMismatch",
  passwordRequired: "common:authErrors.passwordRequired",
  passwordTooShort: "common:authErrors.passwordTooShort",
  required: "common:authErrors.required",
  server: "common:authErrors.server",
};

const fieldErrorKeys = {
  affiliation: "common:reqAccValidation.affiliation",
  confirmPassword: AUTH_ERROR_KEYS.passwordConfirmationMismatch,
  currentPassword: "profile:changePassword.currentPassRequired",
  email: AUTH_ERROR_KEYS.emailRequired,
  firstName: "common:reqAccValidation.firstName",
  lastName: "common:reqAccValidation.lastName",
  newPassword: AUTH_ERROR_KEYS.passwordRequired,
  password: AUTH_ERROR_KEYS.passwordRequired,
  userId: "common:reqAccValidation.employeeId",
};

export const getValidationErrorKey = (field, value, formData = {}) => {
  const trimmedValue = typeof value === "string" ? value.trim() : value;

  if (!trimmedValue) {
    return fieldErrorKeys[field] || AUTH_ERROR_KEYS.required;
  }

  if (
    (field === "password" || field === "newPassword") &&
    trimmedValue.length < 8
  ) {
    return AUTH_ERROR_KEYS.passwordTooShort;
  }

  if (
    field === "confirmPassword" &&
    formData.newPassword !== formData.confirmPassword
  ) {
    return AUTH_ERROR_KEYS.passwordConfirmationMismatch;
  }

  return null;
};

export const normalizeAuthError = (error) => {
  if (!error?.response) {
    return { general: AUTH_ERROR_KEYS.network, fields: {} };
  }

  const status = error.response.status;
  const data = error.response.data || {};
  const message = `${data.error || data.message || ""}`.toLowerCase();
  const fields = {};

  Object.entries(data.errors || {}).forEach(([field, messages]) => {
    const firstMessage = Array.isArray(messages) ? messages[0] : messages;
    fields[field] = mapMessageToErrorKey(firstMessage, field);
  });

  if (Object.keys(fields).length > 0) {
    return { general: null, fields };
  }

  if (status === 401 || status === 403 || message.includes("credential")) {
    return { general: AUTH_ERROR_KEYS.invalidCredentials, fields };
  }

  if (status === 404 || message.includes("not found")) {
    return { general: AUTH_ERROR_KEYS.accountNotFound, fields };
  }

  if (status >= 500) {
    return { general: AUTH_ERROR_KEYS.server, fields };
  }

  return { general: mapMessageToErrorKey(message), fields };
};

export const mapMessageToErrorKey = (message = "", field = "") => {
  const normalized = `${message}`.toLowerCase();

  if (normalized.includes("email") && normalized.includes("required")) {
    return AUTH_ERROR_KEYS.emailRequired;
  }

  if (normalized.includes("password") && normalized.includes("required")) {
    return AUTH_ERROR_KEYS.passwordRequired;
  }

  if (normalized.includes("password") && normalized.includes("8")) {
    return AUTH_ERROR_KEYS.passwordTooShort;
  }

  if (
    normalized.includes("confirm") ||
    normalized.includes("match") ||
    normalized.includes("same")
  ) {
    return AUTH_ERROR_KEYS.passwordConfirmationMismatch;
  }

  if (
    normalized.includes("invalid") &&
    (normalized.includes("credential") || normalized.includes("password"))
  ) {
    return AUTH_ERROR_KEYS.invalidCredentials;
  }

  if (normalized.includes("not found") || normalized.includes("does not exist")) {
    return AUTH_ERROR_KEYS.accountNotFound;
  }

  if (normalized.includes("email") && normalized.includes("invalid")) {
    return AUTH_ERROR_KEYS.invalidEmail;
  }

  return fieldErrorKeys[field] || AUTH_ERROR_KEYS.server;
};
