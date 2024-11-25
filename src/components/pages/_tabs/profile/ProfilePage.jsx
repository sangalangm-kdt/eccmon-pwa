import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../../../features/auth/authSlice";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("common");
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="lg:mt-28 lg:p-4">
      <button onClick={handleLogout} className="text-black">
        {t("common:logout")}
      </button>
    </div>
  );
};

export default ProfilePage;
