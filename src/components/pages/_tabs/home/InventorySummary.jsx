import React from "react";
import { useCylinderCover } from "../../../../hooks/cylinderCover";
import {
  FaWarehouse,
  FaTools,
  FaTruckLoading,
  FaTruckMoving,
  FaTrash,
} from "react-icons/fa";
import {
  LiaWarehouseSolid,
  LiaToolsSolid,
  LiaTruckLoadingSolid,
  LiaTruckMovingSolid,
  LiaTrashSolid,
} from "react-icons/lia";

const InventorySummary = ({ userId }) => {
  const { cylinder } = useCylinderCover();
  const data = cylinder?.data;

  const filteredData = data?.filter((item) => item.user_id === userId) || [];

  const categories = [
    { name: "Storage", status: "storage", icon: <LiaWarehouseSolid /> },
    {
      name: "Process",
      status: ["disassembly", "grooving", "lmd", "assembly", "finishing"],
      icon: <LiaToolsSolid />,
    },
    { name: "Mounted", status: "mounted", icon: <LiaTruckLoadingSolid /> },
    { name: "Dismounted", status: "dismounted", icon: <LiaTruckMovingSolid /> },
    { name: "Disposal", status: "disposal", icon: <LiaTrashSolid /> },
  ];

  const categoryCounts = categories.map((category) => {
    const { name, status } = category;
    const count =
      filteredData?.filter((item) =>
        Array.isArray(status)
          ? status.includes(item.status.toLowerCase())
          : item.status.toLowerCase() === status,
      ).length || 0;

    return { name, count };
  });

  const totalSerialNumbers = filteredData
    ?.map((item) => item.serial_number)
    .reduce((acc, serial) => {
      acc[serial] = (acc[serial] || 0) + 1;
      return acc;
    }, {});

  const totalCount = Object.values(totalSerialNumbers || {}).reduce(
    (acc, count) => acc + count,
    0,
  );

  const getCategoryColor = (category) => {
    switch (category) {
      case "Storage":
        return { textColor: "text-blue-500", bgColor: "bg-blue-100" };
      case "Process":
        return { textColor: "text-green-500", bgColor: "bg-green-100" };
      case "Mounted":
        return { textColor: "text-yellow-500", bgColor: "bg-yellow-100" };
      case "Dismounted":
        return { textColor: "text-orange-500", bgColor: "bg-orange-100" };
      case "Disposal":
        return { textColor: "text-red-500", bgColor: "bg-red-100" };
      default:
        return { textColor: "text-gray-700", bgColor: "bg-gray-100" };
    }
  };

  return (
    <div className="lg:pt-30 z-10 flex flex-col px-4 xs:pb-6 xs:pt-4">
      <div
        className="h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        id="inventory-summary"
      >
        <p className="text-left text-lg font-semibold text-gray-700">
          Overview
        </p>
        <div className="">
          <h2 className="text-md text-gray-500">
            Total cylinder cover scanned
          </h2>
          <p className="mb-5 border-b-0.5 py-2 text-lg text-gray-500">
            {totalCount}
          </p>{" "}
          <div className="flex flex-wrap justify-center gap-4 xs:flex-nowrap xs:gap-4 sm:flex-nowrap sm:gap-2 md:flex-wrap md:gap-6 lg:flex-wrap lg:gap-8">
            {categoryCounts.map(({ name, count }, index) => {
              const { textColor, bgColor } = getCategoryColor(name);
              const icon = categories[index]?.icon;
              return (
                <div
                  key={name}
                  className={`flex flex-col items-center justify-center gap-2 text-sm ${textColor} relative w-full max-w-[150px] rounded-lg p-2 xs:w-1/6 sm:w-auto md:w-1/5 lg:w-1/5`}
                >
                  {/* Only show the notification bubble if count > 0 */}
                  {count > 0 && (
                    <div
                      className={`absolute left-2/3 top-0 flex h-4 w-4 -translate-x-1/2 transform items-center justify-center rounded-full text-xs ${textColor} ${bgColor}`}
                    >
                      {count}
                    </div>
                  )}
                  {/* Icon and Text Adjustments for sm screens */}
                  <div className="text-lg sm:text-md">{icon}</div>
                  <div className="flex flex-row justify-between">
                    <span className="text-center capitalize xs:text-tiny sm:text-tiny">
                      {name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Category Summary */}
      </div>
    </div>
  );
};

export default InventorySummary;
