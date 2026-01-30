import React, { useMemo, useState, useCallback } from "react";
import { useCylinderCover } from "../../../../hooks/cylinderCover";
import { useCylinderUpdate } from "../../../../hooks/cylinderUpdates";
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

const InventorySummary = ({ userId }) => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();

  // ✅ call hooks once
  const { cylinder } = useCylinderCover();
  const { cylinder: cylinderUpdateResp } = useCylinderUpdate();

  const cylinders = cylinder?.data ?? [];
  const cylinderUpdates = cylinderUpdateResp?.data ?? [];

  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(
    () => [
      {
        key: "storage",
        label: t("inventorySummary.storage"),
        status: "storage",
        icon: <LiaWarehouseSolid size={22} />,
      },
      {
        key: "process",
        label: t("inventorySummary.process.process"),
        status: ["disassembly", "grooving", "lmd", "assembly", "finishing"],
        icon: <LiaToolsSolid size={22} />,
        subcategories: [
          {
            key: "disassembly",
            label: t("inventorySummary.process.disassembly"),
            status: "disassembly",
          },
          {
            key: "grooving",
            label: t("inventorySummary.process.grooving"),
            status: "grooving",
          },
          {
            key: "lmd",
            label: t("inventorySummary.process.lmd"),
            status: "lmd",
          },
          {
            key: "assembly",
            label: t("inventorySummary.process.assembly"),
            status: "assembly",
          },
          {
            key: "finishing",
            label: t("inventorySummary.process.finishing"),
            status: "finishing",
          },
        ],
      },
      {
        key: "mounted",
        label: t("inventorySummary.mounted"),
        status: "mounted",
        icon: <LiaTruckLoadingSolid size={22} />,
      },
      {
        key: "dismounted",
        label: t("inventorySummary.dismounted"),
        status: "dismounted",
        icon: <LiaTruckMovingSolid size={22} />,
      },
      {
        key: "disposal",
        label: t("inventorySummary.disposal"),
        status: "disposal",
        icon: <LiaTrashSolid size={22} />,
      },
    ],
    [t],
  );

  const getCategoryColor = useCallback((categoryKey) => {
    switch (categoryKey) {
      case "storage":
        return {
          textColor: "text-cyan-500 dark:text-cyan-300",
          bgColor: "bg-cyan-100 dark:bg-cyan-300",
          borderColor: "border-cyan-300 dark:border-cyan-300",
        };
      case "process":
        return {
          textColor: "text-green-500",
          bgColor: "bg-green-100",
          borderColor: "border-green-300",
        };
      case "mounted":
        return {
          textColor: "text-yellow-500",
          bgColor: "bg-yellow-100",
          borderColor: "border-yellow-300",
        };
      case "dismounted":
        return {
          textColor: "text-orange-500",
          bgColor: "bg-orange-100",
          borderColor: "border-orange-300",
        };
      case "disposal":
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
  }, []);

  // ✅ Get unique serial numbers scanned by this user (from updates)
  const userUniqueSerials = useMemo(() => {
    const set = new Set();
    for (const u of cylinderUpdates) {
      if (u?.userId === userId && u?.serialNumber) set.add(u.serialNumber);
    }
    return set;
  }, [cylinderUpdates, userId]);

  // ✅ Filter cylinders whose serial is in userUniqueSerials
  const filteredData = useMemo(() => {
    if (!userUniqueSerials.size) return [];
    return cylinders.filter((c) => userUniqueSerials.has(c?.serialNumber));
  }, [cylinders, userUniqueSerials]);

  const totalCount = useMemo(() => {
    const unique = new Set(
      filteredData.map((i) => i?.serialNumber).filter(Boolean),
    );
    return unique.size;
  }, [filteredData]);

  const categoryCounts = useMemo(() => {
    const statusOf = (item) => (item?.status ?? "").trim().toLowerCase();

    return categories.map((cat) => {
      const count = filteredData.filter((item) => {
        const s = statusOf(item);
        return Array.isArray(cat.status)
          ? cat.status.includes(s)
          : s === cat.status;
      }).length;

      return { key: cat.key, label: cat.label, count };
    });
  }, [categories, filteredData]);

  const handleSerialNumberClick = useCallback(
    (item) => {
      navigate("/view-info", { state: { data: item } });
    },
    [navigate],
  );

  const handleCategoryClick = useCallback(
    (categoryKey) => {
      if (categoryKey === "process") {
        const processCat = categories.find((c) => c.key === "process");
        const defaultSub =
          processCat?.subcategories?.find((s) => s.key === "disassembly") ||
          null;

        setActiveCategory("process");
        setActiveSubcategory(defaultSub);
        return;
      }

      setActiveSubcategory(null);
      setActiveCategory((prev) => (prev === categoryKey ? "all" : categoryKey));
    },
    [categories],
  );

  const handleSubcategoryClick = useCallback((sub) => {
    setActiveSubcategory((prev) => (prev?.key === sub.key ? null : sub));
  }, []);

  const filteredList = useMemo(() => {
    const statusOf = (item) => (item?.status ?? "").trim().toLowerCase();

    let data = filteredData;

    // category
    if (activeCategory !== "all") {
      const cat = categories.find((c) => c.key === activeCategory);
      if (cat) {
        data = data.filter((item) => {
          const s = statusOf(item);
          return Array.isArray(cat.status)
            ? cat.status.includes(s)
            : s === cat.status;
        });
      }
    }

    // subcategory (only under process)
    if (activeCategory === "process" && activeSubcategory?.status) {
      const target = activeSubcategory.status.toLowerCase();
      data = data.filter((item) => statusOf(item) === target);
    }

    // search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      data = data.filter((item) =>
        (item?.serialNumber ?? "").toLowerCase().includes(q),
      );
    }

    return data;
  }, [
    activeCategory,
    activeSubcategory,
    categories,
    filteredData,
    searchQuery,
  ]);

  return (
    <div className="lg:pt-30 z-10 flex flex-col px-2 xs:pb-1 xs:pt-1">
      <div className="flex flex-row justify-between p-1">
        <p className="text-left text-lg font-semibold text-gray-700 dark:text-gray-50">
          {t("inventorySummary.overview")}
        </p>
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
            {categoryCounts.map(({ key, label, count }) => {
              const { textColor, borderColor } = getCategoryColor(key);
              const icon = categories.find((c) => c.key === key)?.icon;

              return (
                <div
                  key={key}
                  className="relative flex w-full flex-col items-center justify-center gap-2 rounded-lg p-2 text-tiny xs:w-full sm:w-auto md:w-1/5 lg:w-1/5"
                >
                  {count > 0 && (
                    <div className="absolute left-2/3 top-0 flex h-4 w-4 -translate-x-1/2 transform items-center justify-center rounded-full bg-sky-500 text-tiny text-white">
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

                  <div className="flex justify-center p-0 leading-none">
                    <span
                      className={`block max-w-[72px] truncate whitespace-nowrap text-center text-[10px] font-medium ${textColor}`}
                      title={label}
                    >
                      {label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {isMenuVisible && (
          <div className="mt-4 text-nowrap text-tiny">
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("inventorySummary.searchPlaceholder")}
                className="w-full rounded-lg border bg-transparent px-4 py-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:text-gray-50"
              />
            </div>

            <div className="scrollbar-hide flex gap-2 overflow-x-auto">
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setActiveSubcategory(null);
                }}
                className={`${
                  activeCategory === "all"
                    ? "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-500 dark:text-gray-200"
                } flex items-center justify-center rounded-full px-4 py-2`}
              >
                {t("inventorySummary.process.all")}
              </button>

              {categories.map((cat) => (
                <div key={cat.key}>
                  <button
                    onClick={() => handleCategoryClick(cat.key)}
                    className={`${
                      activeCategory === cat.key
                        ? "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-500 dark:text-gray-200"
                    } rounded-full px-4 py-2`}
                  >
                    {cat.label}
                  </button>

                  {activeCategory === "process" && cat.key === "process" && (
                    <div className="-mt-8 ml-18 flex gap-2 rounded-full bg-gray-50 dark:bg-gray-600">
                      {cat.subcategories?.map((sub) => (
                        <button
                          key={sub.key}
                          onClick={() => handleSubcategoryClick(sub)}
                          className={`${
                            activeSubcategory?.key === sub.key
                              ? "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-500 dark:text-gray-200"
                          } rounded-full px-4 py-2`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredList.map((item, index) => (
              <div key={item?.serialNumber ?? index} className="mt-2 flex-row">
                <h5
                  className="border-b-0.5 p-3 text-sm font-medium text-gray-600 hover:bg-gray-200 dark:text-gray-50"
                  onClick={() => handleSerialNumberClick(item)}
                >
                  {item?.serialNumber}
                </h5>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventorySummary;
