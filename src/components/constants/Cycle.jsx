import React from "react";

const Cycle = ({cycle, setCycle}) => {
  return (
    <div className="w-full ">
      <label className="text-sm text-primaryText font-semibold">Cycle</label>
      <input type="number" className="border w-full p-2 rounded" value={cycle} onChange={(e) => {setCycle(e.target.value)}} />
    </div>
  );
};

export default Cycle;
