import React from "react";
import backgroundShape from "../../../assets/svg/background.svg";

const InventorySummary = () => {
  return (
    <div className="flex flex-col w-full p-4 lg:pt-30 xs:pt-40 xs:pb-6">
      <div className="flex flex-row gap-4 mb-4"> {/* Added gap-4 */}
        <div className="bg-white h-32 w-48 rounded-xl p-2">
          <div className="pt-2">
            <label className="text-lg font-semibold text-primaryText"></label>
          </div>
          <div className="relative h-52 w-full">
            <div className="absolute bottom-0 right-0 z-10">
              {/* <img
                className="w-40 opacity-30"
                src={backgroundShape}
                alt="background"
              /> */}
            </div>
          </div>
        </div>
        <div className="bg-white h-32 w-48 rounded-xl p-2">
          <div className="pt-2">
            <label className="text-lg font-semibold text-primaryText"></label>
          </div>
          <div className="relative h-52 w-full">
            <div className="absolute bottom-0 right-0 z-10">
              {/* <img
                className="w-40 opacity-30"
                src={backgroundShape}
                alt="background"
              /> */}
            </div>
          </div>
        </div>        
      </div>
      
      <div className="flex flex-row gap-4"> {/* Added gap-4 */}
        <div className="bg-white h-32 w-48 rounded-xl p-2">
          <div className="pt-2">
            <label className="text-lg font-semibold text-primaryText"></label>
          </div>
          <div className="relative h-52 w-full">
            <div className="absolute bottom-0 right-0 z-10">
              {/* <img
                className="w-40 opacity-30"
                src={backgroundShape}
                alt="background"
              /> */}
            </div>
          </div>
        </div>
        <div className="bg-white h-32 w-48 rounded-xl p-2">
          <div className="pt-2">
            <label className="text-lg font-semibold text-primaryText"></label>
          </div>
          <div className="relative h-52 w-full">
            <div className="absolute bottom-0 right-0 z-10">
              {/* <img
                className="w-40 opacity-30"
                src={backgroundShape}
                alt="background"
              /> */}
            </div>
          </div>
        </div>        
      </div>
    </div>
  );
};

export default InventorySummary;
