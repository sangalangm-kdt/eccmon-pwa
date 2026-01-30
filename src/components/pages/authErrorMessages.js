// If your backend sends specific strings, add regex rules here:
const backendAuthRules = [
  { match: /invalid|incorrect|credential/i, key: "invalidCredentials" },
  { match: /already logged in/i, key: "alreadyLoggedIn" },
];

export const mapAuthErrorMessage = (t, msg, fallbackKey = "unexpected") => {
  const normalized = String(msg ?? "").trim();
  if (!normalized) return t(`common:authErrors.${fallbackKey}`);

  const found = backendAuthRules.find((r) => r.match.test(normalized));
  if (found) return t(`common:authErrors.${found.key}`);

  // If backend already returns localized keys like "auth.invalidCredentials"
  // you can support that here later.
  return normalized; // fallback: show raw backend message if we can't map
};

export const mapAuthErrorByStatus = (t, status) => {
  if (!status) return t("common:authErrors.network");
  if (status === 409) return t("common:authErrors.alreadyLoggedIn");
  if (status === 401 || status === 403) return t("common:authErrors.invalidCredentials");
  if (status === 422) return t("common:authErrors.invalidCredentials");
  return t("common:authErrors.unexpected");
};