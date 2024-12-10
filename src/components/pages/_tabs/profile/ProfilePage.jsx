import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthentication } from "../../../../hooks/auth";

const ProfilePage = () => {
  const { t } = useTranslation("common");
  const { logout } = useAuthentication({ middleware: "auth" });

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-cyan-to-blue w-full h-52 relative">
        <div className="flex-col text-white font-semibold w-full p-4 text-lg">
          Profile
        </div>
      </div>
      <div className="bg-green-100 flex-grow">
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
