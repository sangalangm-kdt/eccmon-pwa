/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LinkBroken from "../../assets/svg/link-broken.svg";
// import { useAuthentication } from "../../hooks/auth";

const NotFoundPage = () => {
  const { t } = useTranslation("common");
  // const { user } = useAuthentication();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <img
          src={LinkBroken}
          className="xs:w-36 lg:w-48"
          alt={t("notFound.imageAlt")}
        />
        <label className="items-center justify-center text-lg font-light text-primary opacity-50">
          {t("notFound.title")}
        </label>
      </div>
      <div className="mt-2">
        <Link to="/" className="text-sm text-secondaryText underline">
          {t("notFound.backLink")}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
