export const logLaravelValidationError = (label, error, payload) => {
  const errors = error.response?.data?.errors;

  console.error(label, {
    message: error.response?.data?.message,
    errors,
    payload,
  });

  if (errors && typeof errors === "object") {
    console.table(errors);
  }
};

const FIELD_MESSAGE_KEYS = {
  serial_number: "qrScanner:errors.serialNumberRequired",
  location: "qrScanner:validation.locationRequired",
  status: "qrScanner:validation.dateRequired",
  user_id: "common:authErrors.server",
  is_disposed: "qrScanner:errors.disposedReadOnly",
  case: "qrScanner:validation.caseRequired",
  cycle: "qrScanner:label.cycle",
};

export const getLaravelValidationMessage = (error, t) => {
  const errors = error.response?.data?.errors;

  if (errors && typeof errors === "object") {
    const firstField = Object.keys(errors)[0];
    const firstMessages = errors[firstField];
    const firstMessage = Array.isArray(firstMessages)
      ? firstMessages[0]
      : firstMessages;

    if (firstMessage && typeof firstMessage === "string") {
      const normalized = firstMessage.toLowerCase();

      if (normalized.includes("unique") || normalized.includes("already been taken")) {
        return t("qrScanner:errors.serialAlreadyExists", {
          defaultValue: "This serial number is already registered.",
        });
      }

      if (normalized.includes("required")) {
        if (firstField === "serial_number") {
          return t("qrScanner:errors.serialNumberRequired", {
            defaultValue:
              "Serial number is required to update this cylinder. Please rescan the cylinder and try again.",
          });
        }

        const key = FIELD_MESSAGE_KEYS[firstField];
        if (key) return t(key);
      }

      return firstMessage;
    }
  }

  const message = error.response?.data?.message;
  if (message && typeof message === "string") {
    const normalized = message.toLowerCase();
    if (
      normalized.includes("serial number") &&
      normalized.includes("required")
    ) {
      return t("qrScanner:errors.serialNumberRequired", {
        defaultValue:
          "Serial number is required to update this cylinder. Please rescan the cylinder and try again.",
      });
    }

    return message;
  }

  return t("qrScanner:errors.saveFailed", {
    defaultValue: "Failed to save cylinder. Please review the form and try again.",
  });
};
