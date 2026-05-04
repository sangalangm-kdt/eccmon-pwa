import React from 'react'

const CameraSwitchModal = ({ isOpen, onClose }) => {
  return (
    <div
      className={`absolute z-70 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-cyan-400 bg-opacity-70 p-4 text-white ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <p>Camera switched!</p>
      {/* <button
        className="mt-2 rounded bg-white px-4 py-2 text-sm text-blue-500"
        onClick={onClose}
      >
      
      </button> */}
    </div>
  );
};

export default CameraSwitchModal