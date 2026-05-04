import React from "react";
import { AddStatusIcon } from "../assets/icons";
import { useTranslation } from "react-i18next";

const AddIcon = () => {
  const { t } = useTranslation("qrScanner");
  return (
    <div className="flex items-center justify-center flex-col h-">
      <AddStatusIcon className="" />
      <p>{t("qrScanner:selectAStatus")}</p>
    </div>
  );
};

export default AddIcon;
