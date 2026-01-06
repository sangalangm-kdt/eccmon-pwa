import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuthentication } from "../../../hooks/auth";
import ResetPasswordSuccessModal from "../../constants/ResetPasswordModal";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const { token } = useParams();

  const { resetPassword } = useAuthentication({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token || !email) {
      setError("Invalid password reset link.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      setMessage("Password reset successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <div className="rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="mb-2 text-xl font-bold text-gray-700">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">
            You can now change your password.
          </p>

          <label className="block text-left text-sm text-gray-600">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-cyan-400"
          />

          <label className="block text-left text-sm text-gray-600">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-cyan-400"
          />

          <button
            type="submit"
            className="w-full rounded bg-cyan-to-blue p-2 text-white hover:bg-blue-600 disabled:opacity-50"
            disabled={
              !password || !confirmPassword || password !== confirmPassword
            }
            onClick={() => setIsModalOpen(true)}
          >
            Submit
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        {message && <p className="mt-4 text-sm text-green-500">{message}</p>}
      </div>
      {isModalOpen && (
        <ResetPasswordSuccessModal onClose={() => navigate("/")} />
      )}
    </div>
  );
};

export default ResetPassword;
