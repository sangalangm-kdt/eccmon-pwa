import React, { useState } from "react";

const MountingPositionSelect = () => {
  const [selectedPosition, setSelectedPosition] = useState("");

  const handleChange = (event) => {
    setSelectedPosition(event.target.value);
  };

  return (
    <div className="flex flex-col space-y-2">
      <select
        id="mountingPosition"
        value={selectedPosition}
        onChange={handleChange}
        className="px-1 py-2 border border-gray-300 rounded-md text-gray-500 focus:outline-none "
      >
        <option value="" disabled className="text-gray-400">
          A1
        </option>
        <option value="A2">A2</option>
        <option value="A3">A3</option>
        <option value="A4">A4</option>
        <option value="A5">A5</option>
        <option value="A6">A6</option>
        <option value="A7">A7</option>
        <option value="A8">A8</option>
        <option value="A9">A9</option>
        <option value="B1">B1</option>
        <option value="B2">B2</option>
        <option value="B3">B3</option>
        <option value="B4">B4</option>
        <option value="B5">B5</option>
        <option value="B6">B6</option>
        <option value="B7">B7</option>
        <option value="B8">B8</option>
        <option value="B9">B9</option>
      </select>
    </div>
  );
};

export default MountingPositionSelect;
