import React from "react";
import { useSelector } from "react-redux";

const StorageLocationDropdown = () => {
  const storageLocator = useSelector((state) => state.process.storage);
  console.log(storageLocator);
  return (
    <select>
      <option></option>
    </select>
  );
};

export default StorageLocationDropdown;
