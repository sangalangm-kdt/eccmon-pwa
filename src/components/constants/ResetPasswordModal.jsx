import React from "react";
import { IoCheckmarkCircle } from "react-icons/io5";

const ResetPasswordSuccessModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6 text-center shadow-lg">
        <IoCheckmarkCircle className="mx-auto text-green-500" size={50} />
        <h2 className="mt-2 text-xl font-bold text-gray-700">Success!</h2>
        <p className="mt-1 text-sm text-gray-600">
          Your password has been successfully changed.
        </p>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded bg-cyan-to-blue p-2 text-white hover:bg-blue-600"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordSuccessModal;
