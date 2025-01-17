import React, { useState } from "react";
import { useCylinderCover } from "../../../../hooks/cylinderCover";
import {
  LiaWarehouseSolid,
  LiaToolsSolid,
  LiaTruckLoadingSolid,
  LiaTruckMovingSolid,
  LiaTrashSolid,
} from "react-icons/lia";
import { useCylinderUpdate } from "../../../../hooks/cylinderUpdates";
import { GoKebabHorizontal } from "react-icons/go";

const InventorySummary = ({ userId }) => {
  const cylinders = useCylinderCover().cylinder?.data;
  const cylinderUpdates = useCylinderUpdate().cylinder?.data;

  // Filter by User ID with same serialNumber for CylinderUpdates
  const filteredCylinderUpdates =
    cylinderUpdates
      ?.filter((cyl) => cyl.userId === userId)
      .filter(
        (cyl, index, self) =>
          index ===
          self.findIndex((item) => item.serialNumber === cyl.serialNumber),
      ) ?? [];

  // Filter by serialNumber
  const filteredData =
    cylinders?.filter((item) =>
      filteredCylinderUpdates.some(
        (update) => update.serialNumber === item.serialNumber,
      ),
    ) ?? [];

  const categories = [
    { name: "Storage", status: "storage", icon: <LiaWarehouseSolid /> },
    {
      name: "Process",
      status: ["disassembly", "grooving", "lmd", "assembly", "finishing"],
      icon: <LiaToolsSolid />,
      subcategories: [
        { name: "Disassembly", status: "disassembly" },
        { name: "Grooving", status: "grooving" },
        { name: "LMD", status: "lmd" },
        { name: "Assembly", status: "assembly" },
        { name: "Finishing", status: "finishing" },
      ],
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
    ?.map((item) => item.serialNumber)
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

  // State to manage the visibility of the serial numbers and category buttons
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleCategoryClick = (category, subcategory = null) => {
    setActiveCategory(category);
    setActiveSubcategory(subcategory); // Update subcategory if applicable
  };

  const filteredByCategory = (category) => {
    if (category === "All") {
      return filteredData;
    }
    return filteredData.filter((item) =>
      Array.isArray(category.status)
        ? category.status.includes(item.status.toLowerCase())
        : item.status.toLowerCase() === category.status,
    );
  };

  const filteredBySubcategory = (subcategory) => {
    return filteredData.filter(
      (item) => item.status.toLowerCase() === subcategory.status.toLowerCase(),
    );
  };

  return (
    <div className="lg:pt-30 z-10 flex flex-col px-4 xs:pb-1 xs:pt-1">
      <div className="flex flex-row justify-between p-1">
        <p className="text-left text-lg font-semibold text-gray-700">
          Overview
        </p>
        <button onClick={() => setIsMenuVisible(!isMenuVisible)}>
          <GoKebabHorizontal className="text-xl text-gray-600" />
        </button>
      </div>
      <div
        className="h-full rounded-xl bg-white p-4 shadow"
        id="inventory-summary"
      >
        <div>
          <h2 className="text-md text-gray-500">
            Total cylinder cover scanned
          </h2>
          <p className="mb-5 border-b-0.5 py-2 text-lg text-gray-500">
            {totalCount}
          </p>
          <div className="flex flex-wrap justify-center gap-4 xs:flex-nowrap xs:gap-4 sm:flex-nowrap sm:gap-2 md:flex-wrap md:gap-6 lg:flex-wrap lg:gap-8">
            {categoryCounts.map(({ name, count }, index) => {
              const { textColor, bgColor } = getCategoryColor(name);
              const icon = categories[index]?.icon;
              return (
                <div
                  key={name}
                  className={`flex flex-col items-center justify-center gap-2 text-sm ${textColor} relative w-full max-w-[150px] rounded-lg p-2 xs:w-1/6 sm:w-auto md:w-1/5 lg:w-1/5`}
                >
                  {count > 0 && (
                    <div
                      className={`absolute left-2/3 top-0 flex h-4 w-4 -translate-x-1/2 transform items-center justify-center rounded-full text-xs ${textColor} ${bgColor}`}
                    >
                      {count}
                    </div>
                  )}
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

        {/* Show serial numbers per operation when toggled */}
        {isMenuVisible && (
          <div className="mt-4 text-tiny">
            {/* Menu Button to Toggle Categories */}
            {/* Menu Button to Toggle Categories */}
            <div className="scrollbar-hide flex gap-2 overflow-x-auto">
              <button
                onClick={() => handleCategoryClick("All")}
                className={`${
                  activeCategory === "All"
                    ? "bg-gray-200 text-gray-700"
                    : "bg-gray-100 text-gray-600"
                } flex items-center justify-center rounded-full px-4 py-2`}
              >
                All
              </button>

              {categories.map(({ name, status, subcategories }) => {
                const categoryButtonText =
                  name === "Process" ? "Process" : name;

                return (
                  <div key={name}>
                    {/* Main category button */}
                    <button
                      onClick={() => handleCategoryClick(name)}
                      className={`${
                        activeCategory === name
                          ? "bg-gray-200 text-gray-700"
                          : "bg-gray-100 text-gray-600"
                      } rounded-full px-4 py-2`}
                    >
                      {categoryButtonText}
                    </button>

                    {/* Render subcategories next to "Process" button */}
                    {activeCategory === "Process" && name === "Process" && (
                      <div className="-mt-8 ml-18 flex gap-2 rounded-full bg-gray-400">
                        {subcategories?.map((subcategory) => (
                          <button
                            key={subcategory.name}
                            onClick={() =>
                              handleCategoryClick(name, subcategory)
                            }
                            className={`${
                              activeSubcategory?.name === subcategory.name
                                ? "bg-gray-200 text-gray-700"
                                : "bg-gray-100 text-gray-600"
                            } rounded-full px-4 py-2`}
                          >
                            {subcategory.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Display serial numbers for the selected category or subcategory */}
            {filteredByCategory(activeCategory).map((item, index) => {
              const serials = item.serialNumber;

              return (
                <div key={index} className="mt-3">
                  <h5 className="p-2 text-sm font-medium text-gray-600">
                    {serials}
                  </h5>
                </div>
              );
            })}

            {/* Display serial numbers for the selected subcategory */}
            {activeSubcategory &&
              filteredBySubcategory(activeSubcategory).map((item, index) => {
                return (
                  <div key={index} className="mt-3">
                    <h5 className="text-sm font-semibold text-gray-600">
                      {item.serialNumber}
                    </h5>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventorySummary;
