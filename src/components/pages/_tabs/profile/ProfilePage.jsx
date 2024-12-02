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
    <div className="flex flex-col mt-12 h-screen bg-white p-4">
      {/* Profile Section */}
      <div className="w-full max-w-sm bg-white rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-start space-x-4">
          <img
            src="https://via.placeholder.com/100" // Replace with actual image URL
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
          <div>
            <h2 className="text-xl font-semibold">{name}</h2>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>
      </div>

      {/* Logout Button with Bottom Border */}
      <div className="mt-4 ml-4">
        <button 
          onClick={handleLogout} 
          className="text-primaryText flex items-center border-b border-red-500 pb-1">

        
          {t("common:logout")}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
