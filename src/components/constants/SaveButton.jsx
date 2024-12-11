import React from "react";

const SaveButton = ({ onClick, text, className, type = "button" }) => {
  return (
    <div className="fixed inset-x-0 bottom-0">
      <div className="w-full flex justify-center items-center p-3 bg-gray-50">
        <button
          type={type}
          className={`w-full py-4 px-2 font-semibold hover:cursor-pointer rounded bg-cyan-to-blue-active text-white ${className}`}
          onClick={onClick}
        >
          {text}
        </button>
      </div>
    </div>
  );
};

export default SaveButton;
