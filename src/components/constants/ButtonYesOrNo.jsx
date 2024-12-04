import React, { useState } from "react";

const ButtonYesOrNo = ({ onChange, isNew }) => {
  const [selectedValue, setSelectedValue] = useState(null);

  const handleButtonClick = (value) => {
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div>
      <div className="flex flex-row w-full justify-between items-center border rounded-full p-1 text-sm text-primaryText">
        <button
          className={`p-2 grow rounded-full transition-colors duration-300 ${
            selectedValue === 1 ? "bg-green-400 text-white" : "bg-white"
          }`}
          type="button"
          onClick={() => handleButtonClick(1)}
        >
          Yes
        </button>
        <button
          type="button"
          className={`p-2 grow rounded-full transition-colors duration-300 ${
            selectedValue === 0
              ? isNew
                ? "bg-gray-300 text-black" // New data, color change (gray or other color)
                : "bg-red-400 text-white" // For normal case, keep it red
              : "bg-white"
          }`}
          onClick={() => handleButtonClick(0)}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default ButtonYesOrNo;
