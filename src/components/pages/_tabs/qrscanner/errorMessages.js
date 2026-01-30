export const backendMessageMap = [
  { match: /already exists/i, key: "eccAlreadyExists", severity: "warning" },
  {
    match: /does not exist|not exist|not found/i,
    key: "cylinderNotFound",
    severity: "info",
  },
  { match: /disposed/i, key: "alreadyDisposed", severity: "error" },
  {
    match: /no storage permission|no permission/i,
    key: "noStoragePermission",
    severity: "error",
  },
  { match: /saved successfully/i, key: "savedSuccessfully", severity: "success" },
  { match: /updated successfully/i, key: "updatedSuccessfully", severity: "success" },
];

export const mapBackendMessage = (t, msg) => {
  const normalized = String(msg ?? "").trim();
  if (!normalized) {
    return { key: "unknownError", severity: "info", text: "" };
  }

  const found = backendMessageMap.find(({ match }) => match.test(normalized));

  if (found) {
    return {
      key: found.key,
      severity: found.severity,
      // IMPORTANT: this must exist in i18n or it will show the key
      text: t(`qrScanner:backend.${found.key}`),
    };
  }

  return {
    key: "unknownError",
    severity: "info",
    text: normalized, // fallback raw message
  };
};