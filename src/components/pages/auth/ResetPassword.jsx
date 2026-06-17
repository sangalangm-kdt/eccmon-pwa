import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthentication } from "../../../hooks/auth";
import ResetPasswordSuccessModal from "../../constants/ResetPasswordModal";
import { getValidationErrorKey } from "../../utils/authErrors";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [messageKey, setMessageKey] = useState("");
  const [errorKey, setErrorKey] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const { token } = useParams();
  const { t, i18n } = useTranslation("common");

  const { resetPassword } = useAuthentication({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  useEffect(() => {
    setMessageKey("");
    setErrorKey("");
    setFieldErrors({});
    setIsModalOpen(false);
  }, [location.pathname, i18n.language]);

  const handleInputChange = (setter, field) => (event) => {
    setter(event.target.value);
    setMessageKey("");
    setErrorKey("");
    setFieldErrors((prevErrors) => {
      const nextErrors = { ...prevErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessageKey("");
    setErrorKey("");
    setFieldErrors({});

    if (!token || !email) {
      setErrorKey("common:authFeedback.passwordResetLinkInvalid");
      return;
    }

    const validationErrors = {};
    const passwordError = getValidationErrorKey("password", password);
    const confirmPasswordError = getValidationErrorKey("confirmPassword", confirmPassword, {
      newPassword: password,
      confirmPassword,
    });

    if (passwordError) validationErrors.password = passwordError;
    if (confirmPasswordError) validationErrors.confirmPassword = confirmPasswordError;

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    if (password !== confirmPassword) {
      setFieldErrors({
        confirmPassword: "common:authErrors.passwordConfirmationMismatch",
      });
      return;
    }

    const result = await resetPassword({
      token,
      email,
      password,
      password_confirmation: confirmPassword,
    });

    if (result.isSuccess) {
      setMessageKey("common:authFeedback.passwordResetSuccess");
      setIsModalOpen(true);
      setTimeout(() => navigate("/"), 2000);
    } else {
      setErrorKey(result.messageKey || "common:authFeedback.passwordResetError");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <div className="rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="mb-2 text-xl font-bold text-gray-700">
          {t("authFeedback.resetPasswordTitle")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">
            {t("authFeedback.resetPasswordDescription")}
          </p>

          <label className="block text-left text-sm text-gray-600">
            {t("reqAcc.password")}
          </label>
          <input
            type="password"
            placeholder={t("reqAcc.enterPassword")}
            value={password}
            onChange={handleInputChange(setPassword, "password")}
            className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-cyan-400"
          />
          {fieldErrors.password && (
            <p className="text-left text-xs text-red-500">
              {t(fieldErrors.password)}
            </p>
          )}

          <label className="block text-left text-sm text-gray-600">
            {t("authFeedback.confirmPassword")}
          </label>
          <input
            type="password"
            placeholder={t("authFeedback.enterConfirmPassword")}
            value={confirmPassword}
            onChange={handleInputChange(setConfirmPassword, "confirmPassword")}
            className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-cyan-400"
          />
          {fieldErrors.confirmPassword && (
            <p className="text-left text-xs text-red-500">
              {t(fieldErrors.confirmPassword)}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded bg-cyan-to-blue p-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {t("authFeedback.submit")}
          </button>
        </form>

        {errorKey && <p className="mt-4 text-sm text-red-500">{t(errorKey)}</p>}
        {messageKey && (
          <p className="mt-4 text-sm text-green-500">{t(messageKey)}</p>
        )}
      </div>
      {isModalOpen && (
        <ResetPasswordSuccessModal onClose={() => navigate("/")} />
      )}
    </div>
  );
};

export default ResetPassword;
