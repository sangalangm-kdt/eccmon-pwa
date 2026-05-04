import React, { useState } from "react";
import { useCylinderCover } from "../../../../hooks/cylinderCover";
import {
  LiaWarehouseSolid,
  LiaToolsSolid,
  LiaTruckLoadingSolid,
  LiaTruckMovingSolid,
  LiaTrashSolid,
} from "react-icons/lia";
import { PiWarehouseFill } from "react-icons/pi";
import { useCylinderUpdate } from "../../../../hooks/cylinderUpdates";
import { GoKebabHorizontal } from "react-icons/go";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocation } from "../../../../hooks/location";

const InventorySummary = ({ userId }) => {
  const { t } = useTranslation("common");
  const cylinders = useCylinderCover().cylinder?.data;
  const cylinderUpdates = useCylinderUpdate().cylinder?.data;
  const navigate = useNavigate();

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

  const handleSerialNumberClick = (item) => {
    navigate("/view-info", { state: { data: item } });
  };

  const categories = [
    {
      name: t("inventorySummary.storage"),
      status: "storage",
      icon: <LiaWarehouseSolid size={22} />,
    },
    {
      name: t("inventorySummary.process.process"),
      status: ["disassembly", "grooving", "lmd", "assembly", "finishing"],
      icon: <LiaToolsSolid size={22} />,
      subcategories: [
        {
          name: t("inventorySummary.process.disassembly"),
          status: "disassembly",
        },
        { name: t("inventorySummary.process.grooving"), status: "grooving" },
        { name: t("inventorySummary.process.lmd"), status: "lmd" },
        { name: t("inventorySummary.process.assembly"), status: "assembly" },
        {
          name: t("inventorySummary.process.finishing"),
          status: "finishing",
        },
      ],
    },
    {
      name: t("inventorySummary.mounted"),
      status: "mounted",
      icon: <LiaTruckLoadingSolid size={22} />,
    },
    {
      name: t("inventorySummary.dismounted"),
      status: "dismounted",
      icon: <LiaTruckMovingSolid size={22} />,
    },
    {
      name: t("inventorySummary.disposal"),
      status: "disposal",
      icon: <LiaTrashSolid size={22} />,
    },
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
      case t("inventorySummary.storage"):
        return {
          textColor: "text-cyan-500 dark:text-cyan-300",
          bgColor: "bg-cyan-100 dark:bg-cyan-300",
          borderColor: "border-cyan-300 dark:border-cyan-300",
        };
      case t("inventorySummary.process.process"):
        return {
          textColor: "text-green-500",
          bgColor: "bg-green-100",
          borderColor: "border-green-300",
        };
      case t("inventorySummary.mounted"):
        return {
          textColor: "text-yellow-500",
          bgColor: "bg-yellow-100",
          borderColor: "border-yellow-300",
        };
      case t("inventorySummary.dismounted"):
        return {
          textColor: "text-orange-500",
          bgColor: "bg-orange-100",
          borderColor: "border-orange-300",
        };
      case t("inventorySummary.disposal"):
        return {
          textColor: "text-red-500",
          bgColor: "bg-red-100",
          borderColor: "border-red-300",
        };
      default:
        return {
          textColor: "text-gray-700",
          bgColor: "bg-gray-100",
          borderColor: "border-gray-300",
        };
    }
  };

  // State to manage the visibility of the serial numbers and category buttons
  const [activeCategory, setActiveCategory] = useState(
    t("inventorySummary.process.all"),
  );
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredBySearch = (data) => {
    if (!searchQuery) return data;
    return data.filter((item) =>
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };
  const handleCategoryClick = (category, subcategory = null) => {
    if (category === t("inventorySummary.process.process")) {
      // Set "Disassembly" as the default subcategory for "Process"
      const defaultSubcategory = categories
        .find((c) => c.name === t("inventorySummary.process.process"))
        ?.subcategories?.find((sub) => sub.status === "disassembly");

      setActiveCategory(category);
      setActiveSubcategory(defaultSubcategory || subcategory);
    } else {
      // Toggle the category if clicked again
      setActiveCategory((prev) =>
        prev === category ? t("inventorySummary.process.all") : category,
      );
      setActiveSubcategory(subcategory);
    }
  };

  const handleSubcategoryClick = (subcategory) => {
    setActiveSubcategory(
      subcategory === activeSubcategory ? null : subcategory,
    );
  };

  const filteredByCategory = (category) => {
    if (category === t("inventorySummary.process.all")) return filteredData;

    const categoryData = categories.find((c) => c.name === category);
    const categoryStatus = categoryData?.status || [];
    const itemStatus = (item) => item.status?.trim().toLowerCase();

    if (Array.isArray(categoryStatus)) {
      return filteredData.filter((item) =>
        categoryStatus.includes(itemStatus(item)),
      );
    }

    return filteredData.filter(
      (item) => itemStatus(item) === categoryStatus.toLowerCase(),
    );
  };

  const filteredBySubcategory = (subcategory) => {
    return filteredData.filter(
      (item) => item.status.toLowerCase() === subcategory.status.toLowerCase(),
    );
  };

  return (
    <div className="lg:pt-30 z-10 flex flex-col px-2 xs:pb-1 xs:pt-1">
      <div className="flex flex-row justify-between p-1">
        <p className="text-left text-lg font-semibold text-gray-700 dark:text-gray-50">
          {t("inventorySummary.overview")}
        </p>
        <button
          onClick={() => setIsMenuVisible(!isMenuVisible)}
          className="rounded-full bg-white p-2 hover:bg-cyan-100 focus:outline-none dark:bg-gray-700"
        >
          <GoKebabHorizontal
            className={`text-xl text-gray-500 dark:text-gray-50 ${
              isMenuVisible ? "rotate-90 transform" : ""
            }`}
          />
        </button>
      </div>
      <div
        className="h-full rounded-xl bg-white p-4 shadow dark:bg-gray-700"
        id="inventory-summary"
      >
        <div>
          <h2 className="text-md text-gray-500 dark:text-gray-50">
            {t("inventorySummary.totalCylinderScanned")}
          </h2>
          <p className="mb-5 border-b-0.5 py-2 text-lg text-gray-500 dark:text-gray-50">
            {totalCount}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 xs:flex-nowrap xs:gap-2 sm:flex-nowrap sm:gap-2 md:flex-wrap md:gap-6 lg:flex-wrap lg:gap-8">
            {categoryCounts.map(({ name, count }, index) => {
              const { textColor, bgColor, borderColor } =
                getCategoryColor(name);
              const icon = categories[index]?.icon;
              return (
                <div
                  key={name}
                  className={`relative flex w-full flex-col items-center justify-center gap-2 rounded-lg p-2 text-tiny xs:w-full sm:w-auto md:w-1/5 lg:w-1/5`}
                >
                  {count > 0 && (
                    <div
                      className={`absolute left-2/3 top-0 flex h-4 w-4 -translate-x-1/2 transform items-center justify-center rounded-full bg-sky-500 text-tiny text-white`}
                    >
                      {count}
                    </div>
                  )}
                  <div className="flex items-center justify-center">
                    <div
                      className={`rounded-full p-2 ${textColor} ${borderColor} border`}
                    >
                      <div className="text-lg sm:text-md">{icon}</div>
                    </div>
                  </div>
                  {/* Move the text outside of the flex container */}
                  <div className="flex items-center justify-center p-0 leading-none">
                    {" "}
                    <span
                      className={`text-center capitalize ${textColor} xs:text-tiny sm:text-tiny`}
                    >
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
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("inventorySummary.searchPlaceholder")}
                className="w-full rounded-lg border bg-transparent px-4 py-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:text-gray-50"
              />
            </div>
            {/* Menu Button to Toggle Categories */}
            <div className="scrollbar-hide flex gap-2 overflow-x-auto">
              <button
                onClick={() =>
                  handleCategoryClick(t("inventorySummary.process.all"))
                }
                className={`${
                  activeCategory === t("inventorySummary.process.all")
                    ? "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-500 dark:text-gray-200"
                } flex items-center justify-center rounded-full px-4 py-2`}
              >
                {t("inventorySummary.process.all")}
              </button>

              {categories.map(({ name, status, subcategories }) => {
                const categoryButtonText =
                  name === t("inventorySummary.process.process")
                    ? t("inventorySummary.process.process")
                    : name;

                return (
                  <div key={name}>
                    {/* Main category button */}
                    <button
                      onClick={() => handleCategoryClick(name)}
                      className={`${
                        activeCategory === name
                          ? "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-500 dark:text-gray-200"
                      } rounded-full px-4 py-2`}
                    >
                      {categoryButtonText}
                    </button>

                    {/* Render subcategories for "Process" */}
                    {activeCategory === t("inventorySummary.process.process") &&
                      name === t("inventorySummary.process.process") && (
                        <div className="-mt-8 ml-18 flex gap-2 rounded-full bg-gray-50 dark:bg-gray-600">
                          {subcategories?.map((subcategory) => (
                            <button
                              key={subcategory.name}
                              onClick={() =>
                                handleSubcategoryClick(subcategory)
                              }
                              className={`${
                                activeSubcategory?.name === subcategory.name
                                  ? "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                  : "bg-gray-100 text-gray-600 dark:bg-gray-500 dark:text-gray-200"
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

            {/* Display serial numbers for the selected category */}
            {activeCategory &&
              activeCategory !== t("inventorySummary.process.process") &&
              filteredBySearch(filteredByCategory(activeCategory)).map(
                (item, index) => {
                  const serials = item.serialNumber;

                  return (
                    <div key={index} className="mt-2 flex-row">
                      <h5
                        className="border-b-0.5 p-3 text-sm font-medium text-gray-600 hover:bg-gray-200 dark:text-gray-50"
                        onClick={() => handleSerialNumberClick(item)}
                      >
                        {serials}
                      </h5>
                    </div>
                  );
                },
              )}

            {/* Display serial numbers for the selected subcategory */}
            {activeSubcategory &&
              filteredBySearch(filteredBySubcategory(activeSubcategory)).map(
                (item, index) => {
                  return (
                    <div key={index} className="mt-3">
                      <h5
                        className="border-b-0.5 p-3 text-sm font-medium text-gray-600 dark:text-gray-50"
                        onClick={() => handleSerialNumberClick(item)}
                      >
                        {item.serialNumber}
                      </h5>
                    </div>
                  );
                },
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventorySummary;
