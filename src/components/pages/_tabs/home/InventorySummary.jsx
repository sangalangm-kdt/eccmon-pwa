import React from "react";
// import backgroundShape from "../../../assets/svg/background.svg";
import { DonutIcon } from "../../../assets/icons";

const InventorySummary = () => {
  return (
    <div className="flex flex-col w-full p-4 lg:pt-30 xs:pt-20 xs:pb-6 z-10">
      <div className="bg-primary h-60 rounded-xl p-2">
        <div className="pt-2">
          <DonutIcon />
        </div>
      </div>
    </div>
  );
};

export default InventorySummary;
