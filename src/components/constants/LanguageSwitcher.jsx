import React from "react";
import { useTranslation } from "react-i18next";
import { languagess } from "../styles/header";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = React.useState(i18n.language);

  const languages = [
    { id: "en", label: "English(US)" },
    { id: "ja", label: "日本語" },
  ];

  const changeLanguage = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <select
      value={language}
      onChange={changeLanguage}
      className={`${languagess.languageSwitcher}`}
    >
      {languages.map((lang) => (
        <option
          key={lang.id}
          value={lang.id}
          className="bg-white text-primaryText"
        >
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
