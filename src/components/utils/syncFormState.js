export const isSameFormFields = (prev, next, keys) => {
  if (!prev && !next) return true;
  if (!prev || !next) return false;
  return keys.every((key) => prev[key] === next[key]);
};

export const setFormDataIfChanged = (setData, next, keys) => {
  setData((prev) => (isSameFormFields(prev, next, keys) ? prev : next));
};

export const setStateIfChanged = (setter, next) => {
  if (!setter) return;
  setter((prev) => (prev === next ? prev : next));
};
