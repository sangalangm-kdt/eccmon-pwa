import React from "react";
// import { useDispatch } from "react-redux";
// import { logout } from "../../../../features/auth/authSlice";
import { useTranslation } from "react-i18next";
import { useAuthentication } from "../../../../hooks/auth";

const ProfilePage = () => {
  // const dispatch = useDispatch();
  const { t } = useTranslation("common");
  const { logout } = useAuthentication({ middleware: "auth" });
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="lg:mt-28 lg:p-8">
      <button onClick={handleLogout} className="text-black">
        {t("common:logout")}
      </button>
    </div>
  );
};

export default ProfilePage;
