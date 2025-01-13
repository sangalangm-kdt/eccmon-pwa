import React from "react";
import { useCylinderCover } from "../../../../hooks/cylinderCover";
// import backgroundShape from "../../../assets/svg/background.svg";
// import { DonutIcon } from "../../../assets/icons";

const InventorySummary = () => {
  const {cylinder} = useCylinderCover()
  const data = cylinder?.data.status

  const storage = data === "Storage" ? console.log(data) : ""


  const getCategoryColor = (category) => {
    switch (category) {
      case "storage":
        return { textColor: "text-blue-500", bgColor: "bg-blue-100" };
      case "inProcess":
        return { textColor: "text-green-500", bgColor: "bg-green-100" };
      case "mounted":
        return { textColor: "text-yellow-500", bgColor: "bg-yellow-100" };
      case "dismounted":
        return { textColor: "text-orange-500", bgColor: "bg-orange-100" };
      case "disposed":
        return { textColor: "text-red-500", bgColor: "bg-red-100" };
      default:
        return { textColor: "text-gray-700", bgColor: "bg-gray-100" };
    }
  };

  return (
    <div className="flex flex-col w-full px-4 lg:pt-30 xs:pt-6 xs:pb-6 z-10">
      <div
        className="bg-white h-full rounded-xl p-4 shadow-lg border border-gray-200"
        id="inventory-summary"
      >
        <h2 className="text-md font-semibold mb-4 text-gray-700">
          Overview
        </h2>

        {/* Flex container for row or column layout */}
        <div className="flex flex-wrap gap-4 justify-center">
          {/* {Object.entries(inventoryData).map(([key, value]) => {
            const { textColor, bgColor } = getCategoryColor(key);
            return (
              <div
                key={key}
                className={`flex flex-col flex-grow items-center text-sm justify-center w-24 h-24 ${bgColor} ${textColor} p-2 rounded-lg`}
              >
                <span className="capitalize text-center font-semibold">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <span className="font-medium text-center">{value}</span>
              </div>
            );
          })} */}
        </div>
      </div>
    </div>
  );
};

export default InventorySummary;
