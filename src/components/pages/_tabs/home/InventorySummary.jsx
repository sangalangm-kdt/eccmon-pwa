import React from "react";
import backgroundShape from "../../../assets/svg/background.svg";
import { DonutIcon } from "../../../assets/icons";

const InventorySummary = () => {
  return (
    <div className="flex flex-col w-full p-4 lg:pt-30 xs:pt-20 xs:pb-6">
      <div className="bg-cyan-to-blue h-60 rounded-xl p-2">
        <div className="pt-2">
          <DonutIcon />
        </div>
        {/* <div className="absolute bottom-0 right-0 ">
          <img
            className="w-20 opacity-30"
            src={backgroundShape}
            alt="background"
          />
        </div> */}
      </div>
    </div>
  );
};

export default InventorySummary;
