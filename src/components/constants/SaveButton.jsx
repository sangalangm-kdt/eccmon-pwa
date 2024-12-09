import React from "react";

const SaveButton = ({ onClick }) => {
  return (
    <div className="fixed inset-x-0 bottom-0">
      <div className="w-full flex justify-center items-center p-3 bg-gray-50">
        <button
          type="submit"
          className={`w-full py-4 px-2 font-semibold hover:cursor-pointer rounded bg-cyan-to-blue-active text-white`}
          onClick={onClick}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SaveButton;
