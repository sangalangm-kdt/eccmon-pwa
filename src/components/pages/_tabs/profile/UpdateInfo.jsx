import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { IoWarningOutline } from "react-icons/io5";

const UpdateInfo = () => {
  const navigate = useNavigate();
  const handleBackToProfile = () => {
    navigate("/profile");
  };

  return (
    <div>
      <div className="flex w-full items-center justify-start rounded-b-xl py-6 shadow-md dark:bg-gray-700">
        <button
          onClick={handleBackToProfile}
          className="flex items-center justify-center gap-1 rounded-full p-2"
        >
          <IoArrowBack className="text-gray-700 dark:text-gray-100" />
          <p className="text-sm text-gray-700 dark:text-gray-100">Back</p>
        </button>
        <h1 className="ml-18 flex-grow font-medium text-gray-700 dark:text-gray-100">
          Update Information
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-center rounded-md border-2 border-dashed border-yellow-500 p-4 text-yellow-500">
        <IoWarningOutline className="mr-2 text-3xl" />
        <p className="text-sm">
          This section is under construction. Please check back later!
        </p>
      </div>
    </div>
  );
};

export default UpdateInfo;
