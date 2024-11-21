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
      <div className="flex flex-row w-full justify-between items-center border rounded-full">
        <button
          className={`p-2 grow rounded-full transition-colors duration-300 ${
            selectedValue === 1 ? "bg-green-500 text-white" : "bg-white"
          }`}
          onClick={() => handleButtonClick(1)}
        >
          Yes
        </button>
        <button
          className={`p-2 grow rounded-full transition-colors duration-300 ${
            selectedValue === 0
              ? isNew
                ? "bg-gray-300 text-black" // New data, color change (gray or other color)
                : "bg-red-500 text-white" // For normal case, keep it red
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
