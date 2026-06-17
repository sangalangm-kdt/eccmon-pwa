import React, { useEffect, useMemo, useState } from "react";
import { useCylinderCover } from "../../../../hooks/cylinderCover";
import {
  LiaWarehouseSolid,
  LiaToolsSolid,
  LiaTruckLoadingSolid,
  LiaTruckMovingSolid,
  LiaTrashSolid,
} from "react-icons/lia";
import { GoKebabHorizontal } from "react-icons/go";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../../../../hooks/auth";

const InventorySummarySkeleton = () => (
  <div className="lg:pt-30 z-10 flex flex-col px-2 xs:pb-1 xs:pt-1">
    <div className="flex flex-row justify-between p-1">
      <div className="h-7 w-44 animate-pulse rounded-full bg-gray-200 dark:bg-gray-600"></div>
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-600"></div>
    </div>
    <div className="rounded-xl bg-white p-4 shadow dark:bg-gray-700">
      <div className="animate-pulse">
        <div className="h-5 w-44 rounded-full bg-gray-200 dark:bg-gray-600"></div>
        <div className="mb-5 mt-3 h-8 w-20 rounded-full bg-gray-200 dark:bg-gray-600"></div>
        <div className="flex flex-wrap items-center justify-center gap-4 xs:flex-nowrap xs:gap-2 sm:flex-nowrap sm:gap-2 md:flex-wrap md:gap-6 lg:flex-wrap lg:gap-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="relative flex w-full flex-col items-center justify-center gap-2 rounded-lg p-2 text-tiny xs:w-full sm:w-auto md:w-1/5 lg:w-1/5"
            >
              <div className="mt-2 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600"></div>
              <div className="h-3 w-12 rounded-full bg-gray-200 dark:bg-gray-600"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const InventorySummaryListSkeleton = () => (
  <div className="mt-4 animate-pulse">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="mt-2 rounded-lg border-b-0.5 border-gray-200 px-3 py-4 dark:border-gray-500"
      >
        <div className="h-4 w-32 rounded-full bg-gray-200 dark:bg-gray-600"></div>
      </div>
    ))}
  </div>
);

const InventorySummary = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading } = useAuthentication();

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
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const queriesEnabled = !isUserLoading && !!user;
  const locationFilter = user?.is_admin === 1 ? "" : user?.affiliation || "";

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const activeStatusFilter = useMemo(() => {
    if (activeSubcategory?.status) {
      return activeSubcategory.status;
    }

    if (activeCategory === t("inventorySummary.storage")) return "Storage";
    if (activeCategory === t("inventorySummary.process.process")) {
      return "Process";
    }
    if (activeCategory === t("inventorySummary.mounted")) return "Mounted";
    if (activeCategory === t("inventorySummary.dismounted")) {
      return "Dismounted";
    }
    if (activeCategory === t("inventorySummary.disposal")) return "Disposal";

    return "";
  }, [activeCategory, activeSubcategory, t]);

  const listQuery = {
    perPage: 20,
    page,
    search: debouncedSearchQuery,
    location: locationFilter,
    includeUpdates: true,
    direction: "desc",
    status: activeStatusFilter || undefined,
  };

  const allCylindersQuery = useCylinderCover({
    enabled: queriesEnabled,
    perPage: 1,
    location: locationFilter,
    search: debouncedSearchQuery,
    includeUpdates: false,
  });
  const storageCylindersQuery = useCylinderCover({
    enabled: queriesEnabled,
    perPage: 1,
    location: locationFilter,
    search: debouncedSearchQuery,
    includeUpdates: false,
    status: "Storage",
  });
  const processCylindersQuery = useCylinderCover({
    enabled: queriesEnabled,
    perPage: 1,
    location: locationFilter,
    search: debouncedSearchQuery,
    includeUpdates: false,
    status: "Process",
  });
  const mountedCylindersQuery = useCylinderCover({
    enabled: queriesEnabled,
    perPage: 1,
    location: locationFilter,
    search: debouncedSearchQuery,
    includeUpdates: false,
    status: "Mounted",
  });
  const dismountedCylindersQuery = useCylinderCover({
    enabled: queriesEnabled,
    perPage: 1,
    location: locationFilter,
    search: debouncedSearchQuery,
    includeUpdates: false,
    status: "Dismounted",
  });
  const disposalCylindersQuery = useCylinderCover({
    enabled: queriesEnabled,
    perPage: 1,
    location: locationFilter,
    search: debouncedSearchQuery,
    includeUpdates: false,
    status: "Disposal",
  });
  const cylinderListQuery = useCylinderCover({
    ...listQuery,
    enabled: queriesEnabled,
  });
  const allCylinders = allCylindersQuery.cylinder;
  const storageCylinders = storageCylindersQuery.cylinder;
  const processCylinders = processCylindersQuery.cylinder;
  const mountedCylinders = mountedCylindersQuery.cylinder;
  const dismountedCylinders = dismountedCylindersQuery.cylinder;
  const disposalCylinders = disposalCylindersQuery.cylinder;
  const cylinderListResponse = cylinderListQuery.cylinder;
  const filteredData = cylinderListResponse?.data ?? [];
  const isListFetching =
    cylinderListQuery.isLoading || cylinderListQuery.isValidating;
  const totalCount =
    allCylinders?.meta?.total ?? allCylinders?.data?.length ?? 0;
  const isDashboardLoading =
    isUserLoading ||
    (!allCylinders && allCylindersQuery.isLoading) ||
    (!storageCylinders && storageCylindersQuery.isLoading) ||
    (!processCylinders && processCylindersQuery.isLoading) ||
    (!mountedCylinders && mountedCylindersQuery.isLoading) ||
    (!dismountedCylinders && dismountedCylindersQuery.isLoading) ||
    (!disposalCylinders && disposalCylindersQuery.isLoading) ||
    (!cylinderListResponse && cylinderListQuery.isLoading);

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
      setPage(1);
    } else {
      // Toggle the category if clicked again
      setActiveCategory((prev) =>
        prev === category ? t("inventorySummary.process.all") : category,
      );
      setActiveSubcategory(subcategory);
      setPage(1);
    }
  };

  const handleSubcategoryClick = (subcategory) => {
    setActiveSubcategory(
      subcategory === activeSubcategory ? null : subcategory,
    );
    setPage(1);
  };

  const categoryCounts = [
    {
      name: t("inventorySummary.storage"),
      count:
        storageCylinders?.meta?.total ?? storageCylinders?.data?.length ?? 0,
    },
    {
      name: t("inventorySummary.process.process"),
      count:
        processCylinders?.meta?.total ?? processCylinders?.data?.length ?? 0,
    },
    {
      name: t("inventorySummary.mounted"),
      count:
        mountedCylinders?.meta?.total ?? mountedCylinders?.data?.length ?? 0,
    },
    {
      name: t("inventorySummary.dismounted"),
      count:
        dismountedCylinders?.meta?.total ??
        dismountedCylinders?.data?.length ??
        0,
    },
    {
      name: t("inventorySummary.disposal"),
      count:
        disposalCylinders?.meta?.total ?? disposalCylinders?.data?.length ?? 0,
    },
  ];

  const currentPage = cylinderListResponse?.meta?.current_page ?? 1;
  const lastPage = cylinderListResponse?.meta?.last_page ?? 1;

  if (isDashboardLoading) {
    return <InventorySummarySkeleton />;
  }

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
                      className={`absolute left-2/3 top-0 flex min-h-4 min-w-4 -translate-x-1/2 transform items-center justify-center rounded-full bg-sky-500 text-tiny text-white`}
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
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
            {isListFetching ? (
              <InventorySummaryListSkeleton />
            ) : filteredBySearch(filteredData).length === 0 ? (
              <div className="mt-4 rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-500 dark:text-gray-300">
                No results found.
              </div>
            ) : (
              filteredBySearch(filteredData).map((item, index) => (
                <div
                  key={`${item.serialNumber}-${index}`}
                  className="mt-2 flex-row"
                >
                  <h5
                    className="border-b-0.5 p-3 text-sm font-medium text-gray-600 hover:bg-gray-200 dark:text-gray-50"
                    onClick={() => handleSerialNumberClick(item)}
                  >
                    {item.serialNumber}
                  </h5>
                </div>
              ))
            )}

            <div className="mt-4 flex items-center justify-between text-xs text-gray-600 dark:text-gray-200">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1}
                className="rounded-full bg-gray-100 px-3 py-2 disabled:opacity-50 dark:bg-gray-500"
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {lastPage}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
                disabled={currentPage >= lastPage}
                className="rounded-full bg-gray-100 px-3 py-2 disabled:opacity-50 dark:bg-gray-500"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventorySummary;
