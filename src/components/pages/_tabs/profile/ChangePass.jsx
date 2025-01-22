import React, { useState } from "react";
import { IoArrowBack, IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../../../../hooks/auth";

const ChangePass = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { changePassword } = useAuthentication();
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear errors as user types
  };

  const validateForm = () => {
    const newErrors = {};

    // Check if current password is provided
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required.";
    }

    // Check if new password is provided
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required.";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword =
        "New password must be at least 8 characters long.";
    }

    // Check if confirm password is provided
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password.";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      changePassword({
        current_password: formData.currentPassword,
        password: formData.newPassword,
        password_confirmation: formData.confirmPassword,
      });
      // Simulate a password update (e.g., API call)

      setSuccessMessage("Your password has been updated successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
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
      <div className="flex w-full items-center justify-start rounded-b-xl py-6 shadow-md dark:bg-gray-700">
        <button
          onClick={handleBackToProfile}
          className="flex items-center justify-center gap-1 rounded-full p-2"
        >
          <IoArrowBack className="text-gray-700 dark:text-gray-100" />
          <p className="text-sm text-gray-700 dark:text-gray-100">Back</p>
        </button>
        <h1 className="ml-18 flex-grow font-medium text-gray-700 dark:text-gray-100">
          Change Password
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-grow flex-col gap-4 px-4 text-sm"
      >
        {/* Current Password Field */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="currentPassword"
            className="text-gray-600 dark:text-gray-50"
          >
            Current password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="current-password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full gap-2 rounded border p-2 text-gray-700 outline-none focus:border-0.5 focus:border-primary dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Enter current password"
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

        {/* New Password Field */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="newPassword"
            className="text-gray-600 dark:text-gray-50"
          >
            New password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              id="new-password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full rounded border p-2 outline-none focus:border-0.5 focus:border-primary dark:border-gray-400 dark:bg-gray-800 dark:text-gray-50"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("newPassword")}
              className="absolute right-3 top-3"
            >
              {showNewPassword ? (
                <IoEyeOffOutline className="text-gray-60 dark:text-gray-50" />
              ) : (
                <IoEyeOutline className="text-gray-600 dark:text-gray-50" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-red-500">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm New Password Field */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="confirmNewPassword"
            className="text-gray-600 dark:text-gray-50"
          >
            Confirm new password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-new-password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded border p-2 outline-none focus:border-0.5 focus:border-primary dark:border-gray-400 dark:bg-gray-800 dark:text-gray-50"
              placeholder="Confirm new password"
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

        {/* Submit Button at the Bottom */}
        <div className="mb-10 mt-auto">
          <button
            type="submit"
            className="hover:bg-primary-dark w-full rounded bg-cyan-to-blue py-4 text-white focus:bg-cyan-to-blue-active focus:outline-none"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePass;
