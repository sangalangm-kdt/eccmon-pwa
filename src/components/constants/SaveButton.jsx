import React from "react";

const SaveButton = ({ disabled, onClick }) => {
  return (
    <div className="fixed inset-x-0 bottom-0">
      <div className="w-full flex justify-center items-center p-4 bg-gray-100">
        <button type="button" className="">
          Update
        </button>
        <button
          type="submit"
          className={`w-50 py-4 px-2 font-semibold hover:cursor-pointer rounded ${
            disabled ? "bg-cyan-300 text-gray-700" : "bg-tertiary text-white"
          }`}
          disabled={disabled}
          onClick={onClick}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SaveButton;
