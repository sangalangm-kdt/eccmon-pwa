import React, { useState, useEffect } from "react";

const ToggleButton = ({ onToggle, isToggledInitially = false }) => {
  const [isToggled, setIsToggled] = useState(isToggledInitially);

  useEffect(() => {
    setIsToggled(isToggledInitially);
  }, [isToggledInitially]);

  const handleToggle = () => {
    const newState = !isToggled;
    setIsToggled(newState);
    onToggle(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex h-7 w-16 items-center rounded-full p-1 transition-all duration-300 ${
        isToggled ? "bg-cyan-400" : "bg-gray-300"
      }`}
    >
      <div
        className={`h-5 w-5 rounded-full bg-white transition-transform duration-300 ${
          isToggled ? "translate-x-8 transform" : ""
        }`}
      ></div>
      <span className="sr-only">{isToggled ? "ON" : "OFF"}</span>
    </button>
  );
};

export default ToggleButton;
