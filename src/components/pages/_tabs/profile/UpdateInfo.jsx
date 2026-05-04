import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../../../../hooks/auth";
import { useTranslation } from "react-i18next";

const UpdateInfo = () => {
  const navigate = useNavigate();
  const {} = useAuthentication();
  const { t } = useTranslation("information");
  const { user } = useAuthentication();

  const [formData, setFormData] = useState({
    userId: user.user_id,
    lastName: user.last_name,
    firstName: user.first_name,
    email: user.email,
    affiliation: user.affiliation, // Added affiliation field
  });

  console.log(user);
  const handleBackToProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="flex h-screen flex-col justify-between">
      {/* Header */}
      <div className="flex w-full items-center justify-start rounded-b-xl py-6 shadow-md dark:bg-gray-700">
        <button
          onClick={handleBackToProfile}
          className="flex items-center justify-center gap-1 rounded-full p-2"
        >
          <IoArrowBack className="text-gray-700 dark:text-gray-100" />
          <p className="text-sm text-gray-700 dark:text-gray-100">Back</p>
        </button>
        <h1 className="flex-1 text-center text-sm font-medium text-gray-700 dark:text-gray-100 xs:mr-14">
          {t("information")}
        </h1>
      </div>

      <div className="mt-8 flex flex-grow flex-col gap-6 px-4 text-sm">
        {/* Account Details */}
        <div className="rounded-lg border p-4 dark:border-gray-500">
          <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-100">
            {t("accountDetails")}
          </h2>

          {/* Employee ID */}
          <div className="flex flex-col gap-2">
            <label htmlFor="userId" className="text-gray-600 dark:text-gray-50">
              {t("employeeId")}
            </label>
            <input
              id="userId"
              name="userId"
              className="w-full rounded border bg-gray-100 p-2 text-gray-400 outline-none dark:border-gray-400 dark:bg-gray-900 dark:text-gray-400"
              readOnly
              value={formData.userId}
            />
          </div>

          {/* Email */}
          <div className="mt-4 flex flex-col gap-2">
            <label htmlFor="email" className="text-gray-600 dark:text-gray-50">
              {t("email")}
            </label>
            <input
              id="email"
              name="email"
              className="w-full rounded border bg-gray-100 p-2 text-gray-400 outline-none dark:border-gray-400 dark:bg-gray-900 dark:text-gray-400"
              readOnly
              value={formData.email}
            />
          </div>

          {/* Affiliation */}
          <div className="mt-4 flex flex-col gap-2">
            <label
              htmlFor="affiliation"
              className="text-gray-600 dark:text-gray-50"
            >
              {t("affiliation")}
            </label>
            <input
              id="affiliation"
              name="affiliation"
              className="w-full rounded border bg-gray-100 p-2 text-gray-400 outline-none dark:border-gray-400 dark:bg-gray-900 dark:text-gray-400"
              readOnly
              value={formData.affiliation}
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="rounded-lg border p-4 dark:border-gray-500">
          <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-100">
            {t("personalInformation")}
          </h2>

          {/* Last Name */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="lastName"
              className="text-gray-600 dark:text-gray-50"
            >
              {t("lastName")}
            </label>
            <input
              id="lastName"
              name="lastName"
              className="w-full rounded border bg-gray-100 p-2 text-gray-400 outline-none dark:border-gray-400 dark:bg-gray-900 dark:text-gray-400"
              placeholder={t("enterLastName")}
              readOnly
              value={formData.lastName}
            />
          </div>

          {/* First Name */}
          <div className="mt-4 flex flex-col gap-2">
            <label
              htmlFor="firstName"
              className="text-gray-600 dark:text-gray-50"
            >
              {t("firstName")}
            </label>
            <input
              id="firstName"
              name="firstName"
              className="w-full rounded border bg-gray-100 p-2 text-gray-400 outline-none dark:border-gray-400 dark:bg-gray-900 dark:text-gray-400"
              placeholder={t("enterFirstName")}
              readOnly
              value={formData.firstName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateInfo;
