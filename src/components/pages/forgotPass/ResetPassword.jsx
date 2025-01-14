import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuthentication } from "../../../hooks/auth";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const { token } = useParams();
  console.log(token, email);

  const { resetPassword } = useAuthentication({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const submitForm = () => {
    resetPassword({
      token: token,
      email: email,
      password: password,
      password_confirmation: confirmPassword,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    submitForm();
    // navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <div className="rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="mb-2 text-xl font-bold text-gray-700">Reset password</h1>
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
            Confirm password
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
            className="w-full rounded bg-cyan-to-blue p-2 text-white hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
        {message && <p className="mt-4 text-green-500">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
