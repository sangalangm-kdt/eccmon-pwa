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
      <div className="h-7 w-44 animate-pulse rounded-full bg-gray-200 dark:bg-gray-600" />
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-600" />
    </div>

    <div className="rounded-xl bg-white p-4 shadow dark:bg-gray-700">
      <div className="animate-pulse">
        <div className="h-5 w-44 rounded-full bg-gray-200 dark:bg-gray-600" />
        <div className="mb-5 mt-3 h-8 w-20 rounded-full bg-gray-200 dark:bg-gray-600" />

        <div className="flex flex-wrap items-center justify-center gap-4 xs:flex-nowrap xs:gap-2 sm:flex-nowrap sm:gap-2 md:flex-wrap md:gap-6 lg:flex-wrap lg:gap-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="relative flex w-full flex-col items-center justify-center gap-2 rounded-lg p-2 text-tiny xs:w-full sm:w-auto md:w-1/5 lg:w-1/5"
            >
              <div className="mt-2 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600" />
              <div className="h-3 w-12 rounded-full bg-gray-200 dark:bg-gray-600" />
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
        <div className="h-4 w-32 rounded-full bg-gray-200 dark:bg-gray-600" />
      </div>
    ))}
  </div>
);

const InventorySummary = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading } = useAuthentication();

  const [activeCategory, setActiveCategory] = useState(
    t("inventorySummary.process.all"),
  );
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const queriesEnabled = !isUserLoading && Boolean(user);
  const locationFilter = user?.is_admin === 1 ? "" : user?.affiliation || "";

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
        {
          name: t("inventorySummary.process.grooving"),
          status: "grooving",
        },
        {
          name: t("inventorySummary.process.lmd"),
          status: "lmd",
        },
        {
          name: t("inventorySummary.process.assembly"),
          status: "assembly",
        },
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
          badgeColor: "bg-cyan-100 dark:bg-cyan-900",
          borderColor: "border-cyan-300 dark:border-cyan-500",
        };

      case t("inventorySummary.process.process"):
        return {
          textColor: "text-green-500 dark:text-green-300",
          badgeColor: "bg-green-100 dark:bg-green-900",
          borderColor: "border-green-300 dark:border-green-500",
        };

      case t("inventorySummary.mounted"):
        return {
          textColor: "text-yellow-500 dark:text-yellow-300",
          badgeColor: "bg-yellow-100 dark:bg-yellow-900",
          borderColor: "border-yellow-300 dark:border-yellow-500",
        };

      case t("inventorySummary.dismounted"):
        return {
          textColor: "text-orange-500 dark:text-orange-300",
          badgeColor: "bg-orange-100 dark:bg-orange-900",
          borderColor: "border-orange-300 dark:border-orange-500",
        };

      case t("inventorySummary.disposal"):
        return {
          textColor: "text-red-500 dark:text-red-300",
          badgeColor: "bg-red-100 dark:bg-red-900",
          borderColor: "border-red-300 dark:border-red-500",
        };

      default:
        return {
          textColor: "text-gray-700 dark:text-gray-200",
          badgeColor: "bg-gray-100 dark:bg-gray-600",
          borderColor: "border-gray-300 dark:border-gray-500",
        };
    }
  };

  const handleSerialNumberClick = (item) => {
    navigate("/view-info", {
      state: {
        data: item,
      },
    });
  };

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

    if (activeCategory === t("inventorySummary.storage")) {
      return "Storage";
    }

    if (activeCategory === t("inventorySummary.process.process")) {
      return "Process";
    }

    if (activeCategory === t("inventorySummary.mounted")) {
      return "Mounted";
    }

    if (activeCategory === t("inventorySummary.dismounted")) {
      return "Dismounted";
    }

    if (activeCategory === t("inventorySummary.disposal")) {
      return "Disposal";
    }

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

  const totalScanned = Number(totalCount) || 0;

  const isDashboardLoading =
    isUserLoading ||
    (!allCylinders && allCylindersQuery.isLoading) ||
    (!storageCylinders && storageCylindersQuery.isLoading) ||
    (!processCylinders && processCylindersQuery.isLoading) ||
    (!mountedCylinders && mountedCylindersQuery.isLoading) ||
    (!dismountedCylinders && dismountedCylindersQuery.isLoading) ||
    (!disposalCylinders && disposalCylindersQuery.isLoading) ||
    (!cylinderListResponse && cylinderListQuery.isLoading);

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

  const filteredBySearch = (data) => {
    if (!searchQuery.trim()) {
      return data;
    }

    const normalizedSearch = searchQuery.trim().toLowerCase();

    return data.filter((item) =>
      String(item?.serialNumber ?? "")
        .toLowerCase()
        .includes(normalizedSearch),
    );
  };

  const handleCategoryClick = (category, subcategory = null) => {
    if (category === t("inventorySummary.process.process")) {
      const defaultSubcategory = categories
        .find(
          (currentCategory) =>
            currentCategory.name === t("inventorySummary.process.process"),
        )
        ?.subcategories?.find(
          (currentSubcategory) => currentSubcategory.status === "disassembly",
        );

      setActiveCategory(category);
      setActiveSubcategory(defaultSubcategory || subcategory);
      setPage(1);

      return;
    }

    setActiveCategory((previousCategory) =>
      previousCategory === category
        ? t("inventorySummary.process.all")
        : category,
    );

    setActiveSubcategory(subcategory);
    setPage(1);
  };

  const handleSubcategoryClick = (subcategory) => {
    setActiveSubcategory((previousSubcategory) =>
      previousSubcategory?.status === subcategory.status ? null : subcategory,
    );

    setPage(1);
  };

  const currentPage = cylinderListResponse?.meta?.current_page ?? 1;
  const lastPage = cylinderListResponse?.meta?.last_page ?? 1;
  const visibleCylinders = filteredBySearch(filteredData);

  if (isDashboardLoading) {
    return <InventorySummarySkeleton />;
  }

  return (
    <div className="z-10 flex w-full flex-col">
      <div className="flex flex-row justify-between py-1 md:px-1">
        <p className="ecc-section-title text-left text-gray-700 dark:text-gray-50">
          {t("inventorySummary.overview")}
        </p>

        <button
          type="button"
          onClick={() => setIsMenuVisible((previousValue) => !previousValue)}
          className="rounded-full bg-white p-2 hover:bg-cyan-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600"
          aria-label="Toggle inventory menu"
          aria-expanded={isMenuVisible}
        >
          <GoKebabHorizontal
            className={`text-xl text-gray-500 transition-transform dark:text-gray-50 ${
              isMenuVisible ? "rotate-90" : ""
            }`}
          />
        </button>
      </div>

      <div
        className="h-full rounded-xl bg-white p-4 shadow dark:bg-gray-700"
        id="inventory-summary"
      >
        <div>
          <h2 className="text-base text-gray-600 dark:text-gray-50">
            {t("inventorySummary.totalCylinderScanned")}
          </h2>

          <p className="mb-3 py-1 text-3xl font-semibold text-gray-700 dark:text-gray-50 md:mb-5 md:py-2 md:text-xl">
            {totalScanned}
          </p>

          <div className="grid w-full grid-cols-6 gap-x-2 gap-y-4 md:grid-cols-5 md:gap-4">
            {categoryCounts.map(({ name, count }, index) => {
              const { textColor, badgeColor, borderColor } =
                getCategoryColor(name);

              const icon = categories[index]?.icon;

              return (
                <div
                  key={name}
                  className={`col-span-2 flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg p-0.5 md:col-span-1 md:p-2 ${
                    index === 3 ? "col-start-2 md:col-start-auto" : ""
                  }`}
                >
                  <div className="relative inline-flex shrink-0">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border ${textColor} ${borderColor} md:h-12 md:w-12`}
                    >
                      <div className="text-lg">{icon}</div>
                    </div>

                    <span
                      className="absolute -right-2.5 -top-2.5 z-10 flex h-5 min-w-5 items-center justify-center rounded-full border border-white bg-sky-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm dark:border-gray-700 dark:bg-sky-500"
                      aria-label={`${name}: ${count}`}
                      title={`${name}: ${count}`}
                    >
                      {count}
                    </span>
                  </div>

                  <span
                    className={`mt-1 w-full truncate text-center text-[10px] capitalize leading-tight md:text-xs ${textColor}`}
                    title={name}
                  >
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {isMenuVisible && (
          <div className="mt-4 text-tiny">
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setPage(1);
                }}
                placeholder={t("inventorySummary.searchPlaceholder")}
                className="w-full rounded-lg border bg-transparent px-4 py-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:border-gray-500 dark:text-gray-50"
              />
            </div>

            <div className="scrollbar-hide flex gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() =>
                  handleCategoryClick(t("inventorySummary.process.all"))
                }
                className={`flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 ${
                  activeCategory === t("inventorySummary.process.all")
                    ? "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-500 dark:text-gray-200"
                }`}
              >
                {t("inventorySummary.process.all")}
              </button>

              {categories.map(({ name, subcategories }) => (
                <div key={name} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(name)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 ${
                      activeCategory === name
                        ? "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-500 dark:text-gray-200"
                    }`}
                  >
                    {name}
                  </button>

                  {activeCategory === t("inventorySummary.process.process") &&
                    name === t("inventorySummary.process.process") && (
                      <div className="mt-2 flex gap-2 rounded-full bg-gray-50 dark:bg-gray-600">
                        {subcategories?.map((subcategory) => (
                          <button
                            key={subcategory.status}
                            type="button"
                            onClick={() => handleSubcategoryClick(subcategory)}
                            className={`whitespace-nowrap rounded-full px-4 py-2 ${
                              activeSubcategory?.status === subcategory.status
                                ? "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-500 dark:text-gray-200"
                            }`}
                          >
                            {subcategory.name}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>

            {isListFetching ? (
              <InventorySummaryListSkeleton />
            ) : visibleCylinders.length === 0 ? (
              <div className="mt-4 rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-500 dark:text-gray-300">
                No results found.
              </div>
            ) : (
              visibleCylinders.map((item, index) => {
                const serialNumber = item?.serialNumber ?? "—";

                return (
                  <button
                    key={`${serialNumber}-${index}`}
                    type="button"
                    onClick={() => handleSerialNumberClick(item)}
                    className="mt-2 block w-full border-b-0.5 p-3 text-left text-sm font-medium text-gray-600 hover:bg-gray-200 dark:border-gray-500 dark:text-gray-50 dark:hover:bg-gray-600"
                  >
                    {serialNumber}
                  </button>
                );
              })
            )}

            <div className="mt-4 flex items-center justify-between text-xs text-gray-600 dark:text-gray-200">
              <button
                type="button"
                onClick={() =>
                  setPage((previousPage) => Math.max(previousPage - 1, 1))
                }
                disabled={currentPage <= 1}
                className="rounded-full bg-gray-100 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-500"
              >
                Prev
              </button>

              <span>
                Page {currentPage} of {lastPage}
              </span>

              <button
                type="button"
                onClick={() =>
                  setPage((previousPage) =>
                    Math.min(previousPage + 1, lastPage),
                  )
                }
                disabled={currentPage >= lastPage}
                className="rounded-full bg-gray-100 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-500"
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
