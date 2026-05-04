import React from "react";
import {
  IoClose,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";

const AccountRequestModal = ({ result, onClose, message }) => {
  if (!result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex flex-col items-center">
          {result === "success" ? (
            <IoCheckmarkCircleOutline size={50} className="text-green-500" />
          ) : (
            <IoAlertCircleOutline size={50} className="text-red-500" />
          )}
          <h2 className="mt-2 text-xl font-semibold text-gray-700 dark:text-white">
            {result === "success" ? "Request Submitted!" : "Error Occurred"}
          </h2>
          <p className="mt-1 text-center text-gray-600 dark:text-gray-300">
            {message}
          </p>
        </div>

        <div className="mt-4 flex justify-center">
          {result === "success" ? (
            <Link to="/login">
              <button className="rounded bg-cyan-to-blue px-4 py-2 text-white hover:bg-cyan-600 dark:bg-cyan-700 dark:hover:bg-cyan-600">
                Go to Login
              </button>
            </Link>
          ) : (
            <button
              onClick={onClose}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountRequestModal;
