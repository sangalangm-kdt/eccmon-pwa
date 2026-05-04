import i18next from "i18next";

const useTranslationUtils = (...namespaces) => {
  const getTranslation = (key) => {
    for (const namespace of namespaces) {
      const translation = i18next.t(`${namespace}:${key}`);
      if (translation !== key) {
        return translation;
      }
    }
    return key;
  };

  return new Proxy(
    {},
    {
      get: (target, prop) => {
        return getTranslation(prop);
      },
    },
  );
};

export default useTranslationUtils;
