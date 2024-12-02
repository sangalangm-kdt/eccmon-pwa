import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthentication } from "../../../../hooks/auth";

const ProfilePage = () => {
  const { t } = useTranslation("common");
  const { logout } = useAuthentication({ middleware: "auth" });

  // User data state (For example purposes, adjust as needed)
  const [name, setName] = useState("Jane Doe");
  const [email, setEmail] = useState("janedoe@outlook.com");
  const [label, setLabel] = useState("");

  const handleLogout = () => {
    logout();
  };

  const handleImageChange = () => {
    // Handle image change functionality (e.g., open file picker)
    console.log("Change Profile Picture");
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
