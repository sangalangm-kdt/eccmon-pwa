import React, { useState } from "react";
import { IoArrowBack, IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../../../../hooks/auth";
import Loader from "../../../constants/Loader";
import Preloader from "../../../constants/preloader/Preloader";
import { useTranslation } from "react-i18next";
import ChangePasswordRequestModal from "../../../constants/ChangePasswordRequestModal";

const ChangePass = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { changePassword } = useAuthentication();
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState("");
  const [message, setMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation("profile");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword =
        t("changePassword.currentPass") +
        " " +
        t("isRequired", { ns: "common" });
    }

    if (!formData.newPassword) {
      newErrors.newPassword =
        t("changePassword.newPass") + " " + t("isRequired", { ns: "common" });
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = t("changePassword.enterNewPass");
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        t("changePassword.confirmPass") +
        " " +
        t("isRequired", { ns: "common" });
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t("changePassword.enterConfirmPass");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        const requestResult = await changePassword({
          current_password: formData.currentPassword,
          password: formData.newPassword,
          password_confirmation: formData.confirmPassword,
          setErrors,
          setLoading,
        });

        const requestStatus = requestResult.isSuccess ? "success" : "fail";
        setResult(requestStatus);

        if (requestStatus === "success") {
          setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }

        setMessage(requestResult.message);
      } catch (err) {
        console.error("Password change failed:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackToProfile = () => {
    navigate("/profile");
  };

  const togglePasswordVisibility = (field) => {
    if (field === "currentPassword") {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (field === "newPassword") {
      setShowNewPassword(!showNewPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
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
          <p className="text-sm text-gray-700 dark:text-gray-100">
            {t("back", { ns: "common" })}
          </p>
        </button>
        <h1 className="flex-1 text-center font-medium text-gray-700 dark:text-gray-100 xs:mr-16">
          {t("changePassword.title")}
        </h1>
      </div>
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-grow flex-col gap-4 px-4 text-sm"
      >
        {/* Current Password */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="currentPassword"
            className="text-gray-600 dark:text-gray-50"
          >
            {t("changePassword.currentPass")}
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="current-password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full rounded border p-2 text-gray-700 outline-none dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100"
              placeholder={t("changePassword.enterCurrentPass")}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("currentPassword")}
              className="absolute right-3 top-3"
            >
              {showCurrentPassword ? (
                <IoEyeOffOutline className="text-gray-600 dark:text-gray-50" />
              ) : (
                <IoEyeOutline className="text-gray-600 dark:text-gray-50" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-xs text-red-500">{errors.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="newPassword"
            className="text-gray-600 dark:text-gray-50"
          >
            {t("changePassword.newPass")}
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              id="new-password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full rounded border p-2 outline-none dark:border-gray-400 dark:bg-gray-800 dark:text-gray-50"
              placeholder={t("changePassword.enterNewPass")}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("newPassword")}
              className="absolute right-3 top-3"
            >
              {showNewPassword ? (
                <IoEyeOffOutline className="text-gray-600 dark:text-gray-50" />
              ) : (
                <IoEyeOutline className="text-gray-600 dark:text-gray-50" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-red-500">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="confirmPassword"
            className="text-gray-600 dark:text-gray-50"
          >
            {t("changePassword.confirmPass")}
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-new-password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded border p-2 outline-none dark:border-gray-400 dark:bg-gray-800 dark:text-gray-50"
              placeholder={t("changePassword.enterConfirmPass")}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirmPassword")}
              className="absolute right-3 top-3"
            >
              {showConfirmPassword ? (
                <IoEyeOffOutline className="text-gray-600 dark:text-gray-50" />
              ) : (
                <IoEyeOutline className="text-gray-600 dark:text-gray-50" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="mb-10 mt-auto">
          <button
            type="submit"
            className="hover:bg-primary-dark w-full rounded bg-cyan-to-blue py-4 text-white focus:outline-none"
          >
            {loading ? (
              <Loader label={t("updating", { ns: "common" })} />
            ) : (
              t("updatePassword", { ns: "common" })
            )}
          </button>
        </div>
      </form>
      {/* Success Modal */}
      {/* {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-50">
              {t("success", { ns: "common" })}
            </h2>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
              {t("passwordUpdated", { ns: "common" })}
            </p>
            <button
              onClick={closeSuccessModal}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {t("backToLogin", { ns: "common" })}
            </button>
          </div>
        </div>
      )} */}

      <ChangePasswordRequestModal
        result={result}
        onClose={() => setResult("")}
        message={message}
      />

      {/* Preloader Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 dark:bg-gray-900">
          <Preloader isLoading={loading} />
        </div>
      )}
    </div>
  );
};

export default ChangePass;
