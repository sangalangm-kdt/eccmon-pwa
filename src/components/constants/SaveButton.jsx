import React from "react";

const SaveButton = ({ disabled, onClick }) => {
  return (
    <div className="fixed inset-x-0 bottom-0">
      <div className="w-full flex justify-center items-center p-3 bg-gray-50">
        <button
          type="submit"
          className={`w-full py-4 px-2 font-semibold hover:cursor-pointer rounded ${
            disabled
              ? "bg-cyan-to-blue text-white"
              : "bg-cyan-to-blue-active text-white"
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
