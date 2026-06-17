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
import {
  getDisplayUpdatedAt,
  getInventoryCategoryStatus,
  getLatestHistoryRecord,
  INVENTORY_PROCESS_STAGES,
  isDisposed,
  matchesInventoryCategory,
} from "../../../utils/cylinderStatus";

const formatActivityTimestamp = (value) => {
  if (!value) return "";
  if (typeof value === "string") {
    const normalized = value.replace("T", " ");
    return normalized.length > 16 ? normalized.slice(0, 16) : normalized;
  }
  return String(value);
};

const formatCountBadge = (count) => (count > 999 ? "999+" : count);

const CountBadge = ({ count }) => {
  if (count <= 0) return null;

  const label = formatCountBadge(count);
  const sizeClasses =
    count > 99
      ? "h-4 min-w-[1.75rem] px-1 text-[9px] md:min-w-[1.85rem]"
      : count > 9
        ? "h-3.5 min-w-4 px-0.5 text-[10px]"
        : "h-3.5 min-w-3.5 px-0.5 text-tiny";

  return (
    <span
      className={`absolute right-0 top-0 z-10 flex -translate-y-1/3 translate-x-1/3 items-center justify-center rounded-full bg-sky-500 font-semibold leading-none text-white md:translate-x-1/4 md:-translate-y-1/4 ${sizeClasses} md:h-4 md:min-w-4 md:px-1 md:text-tiny`}
    >
      {label}
    </span>
  );
};

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
    ).map((item) => {
      const latestUpdate = getLatestHistoryRecord(
        item.serialNumber,
        cylinderUpdates,
        userId,
      );

      return {
        ...item,
        displayUpdatedAt: getDisplayUpdatedAt(item, latestUpdate),
        updates: latestUpdate ?? item.updates,
      };
    }) ?? [];

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
      status: INVENTORY_PROCESS_STAGES,
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

  const getMatchingCategoryItems = (status) =>
    filteredData.filter((item) => matchesInventoryCategory(item, status));

  const getUniqueSerialCount = (items) =>
    new Set(items.map((item) => item.serialNumber).filter(Boolean)).size;

  const categoryCounts = categories.map((category) => {
    const { name, status } = category;
    const count = getUniqueSerialCount(getMatchingCategoryItems(status));

    return { name, count };
  });

  const totalScanned = getUniqueSerialCount(filteredData);

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

    if (categoryStatus === "disposal") {
      return filteredData.filter((item) => isDisposed(item));
    }

    if (Array.isArray(categoryStatus)) {
      return filteredData.filter((item) =>
        matchesInventoryCategory(item, categoryStatus),
      );
    }

    return filteredData.filter((item) =>
      matchesInventoryCategory(item, categoryStatus),
    );
  };

  const filteredBySubcategory = (subcategory) => {
    return filteredData.filter(
      (item) =>
        !isDisposed(item) &&
        getInventoryCategoryStatus(item) ===
          subcategory.status.toLowerCase(),
    );
  };

  return (
    <div className="z-10 flex w-full flex-col">
      {totalScanned === 0 ? (
        <div className="mb-4 rounded-xl border border-cyan-200/80 bg-gradient-to-br from-cyan-50/90 to-white p-4 shadow-sm dark:border-cyan-800/40 dark:from-cyan-950/20 dark:to-gray-700 md:p-5">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-50 md:text-lg">
            {t("inventorySummary.welcomeTitle")}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {t("inventorySummary.welcomeDescription")}
          </p>
        </div>
      ) : null}

      <div className="flex flex-row justify-between py-1 md:px-1">
        <p className="ecc-section-title text-left text-gray-700 dark:text-gray-50">
          {t("inventorySummary.overview")}
        </p>
        <button
          onClick={() => setIsMenuVisible(!isMenuVisible)}
          className="rounded-full bg-white p-1.5 hover:bg-cyan-100 focus:outline-none dark:bg-gray-700 md:p-2"
        >
          <GoKebabHorizontal
            className={`text-xl text-gray-500 dark:text-gray-50 ${
              isMenuVisible ? "rotate-90 transform" : ""
            }`}
          />
        </button>
      </div>
      <div
        className="h-full rounded-xl bg-white p-3 shadow dark:bg-gray-700 md:p-4 md:shadow-sm"
        id="inventory-summary"
      >
        <div>
          {totalScanned === 0 ? (
            <div className="mb-3 md:mb-5">
              <h2 className="text-base font-semibold text-gray-700 dark:text-gray-50 md:text-lg">
                {t("inventorySummary.zeroCylindersScanned")}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t("inventorySummary.scanFirstEccId")}
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-base text-gray-600 dark:text-gray-50 md:text-base">
                {t("inventorySummary.totalCylinderScanned")}
              </h2>
              <p className="mb-3 py-1 text-3xl font-semibold text-gray-700 dark:text-gray-50 md:mb-5 md:py-2 md:text-xl">
                {totalScanned}
              </p>
            </>
          )}
          <div className="grid w-full grid-cols-6 gap-x-2 gap-y-2 md:grid-cols-5 md:gap-4">
            {categoryCounts.map(({ name, count }, index) => {
              const { textColor, bgColor, borderColor } =
                getCategoryColor(name);
              const icon = categories[index]?.icon;
              const isEmptyCount = count === 0;
              return (
                <div
                  key={name}
                  className={`col-span-2 flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg p-0.5 md:col-span-1 md:gap-2 md:p-2 ${
                    index === 3 ? "col-start-2 md:col-start-auto" : ""
                  } ${isEmptyCount ? "opacity-50" : ""}`}
                >
                  <div className="relative inline-flex shrink-0">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${textColor} ${borderColor} border md:h-12 md:w-12`}
                    >
                      <div className="text-sm md:text-lg">{icon}</div>
                    </div>
                    <CountBadge count={count} />
                  </div>
                  <div className="flex w-full flex-col items-center justify-center gap-0.5 p-0 leading-none">
                    <span
                      className={`line-clamp-2 text-center text-[10px] capitalize leading-tight md:text-xs ${textColor}`}
                      title={name}
                    >
                      {name}
                    </span>
                    <span
                      className={`text-[10px] font-semibold tabular-nums md:text-xs ${textColor}`}
                      aria-label={`${name} count`}
                    >
                      {count}
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
                    ? "whitespace-nowrap bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                    : "whitespace-nowrap bg-gray-100 text-gray-600 dark:bg-gray-500 dark:text-gray-200"
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
                          ? "whitespace-nowrap bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                          : "whitespace-nowrap bg-gray-100 text-gray-600 dark:bg-gray-500 dark:text-gray-200"
                      } rounded-full px-4 py-2`}
                    >
                      {categoryButtonText}
                    </button>

                    {/* Render subcategories for "Process" */}
                    {activeCategory === t("inventorySummary.process.process") &&
                      name === t("inventorySummary.process.process") && (
                        <div className="-mt-8 ml-18 flex gap-2 whitespace-nowrap rounded-full bg-gray-50 dark:bg-gray-600">
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
                  const displayUpdatedAt = formatActivityTimestamp(
                    item.displayUpdatedAt,
                  );

                  return (
                    <div key={index} className="mt-2 flex-row">
                      <h5
                        className="border-b-0.5 p-3 text-sm font-medium text-gray-600 hover:bg-gray-200 dark:text-gray-50"
                        onClick={() => handleSerialNumberClick(item)}
                      >
                        <span className="block">{serials}</span>
                        {displayUpdatedAt && (
                          <span className="block text-xs font-normal text-gray-400 dark:text-gray-300">
                            {t("updated")}: {displayUpdatedAt}
                          </span>
                        )}
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
                        <span className="block">{item.serialNumber}</span>
                        {item.displayUpdatedAt && (
                          <span className="block text-xs font-normal text-gray-400 dark:text-gray-300">
                            {t("updated")}:{" "}
                            {formatActivityTimestamp(item.displayUpdatedAt)}
                          </span>
                        )}
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
