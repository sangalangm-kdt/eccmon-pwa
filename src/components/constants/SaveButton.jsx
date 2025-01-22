import React from "react";

const SaveButton = ({ onClick, text, className, type = "button" }) => {
  return (
    <div className="fixed inset-x-0 bottom-0">
      <div className="flex w-full items-center justify-center bg-gray-50 p-3">
        <button
          type={type}
          className={`w-full rounded bg-cyan-to-blue px-2 py-4 font-semibold text-white hover:cursor-pointer focus:bg-cyan-to-blue-active ${className}`}
          onClick={onClick}
        >
          {text}
        </button>
      </div>
    </div>
  );
};

export default SaveButton;
