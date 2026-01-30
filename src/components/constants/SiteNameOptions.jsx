import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocationProcess } from "../../hooks/locationProcess";
import { useTranslation } from "react-i18next";
import SiteNameOptionsSkeleton from "./skeleton/SiteNameOptions";

// ✅ MUI icons
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { Close } from "@mui/icons-material";

const SiteNameOptions = ({
  site,
  setSite,
  disabled = false,
  showAlert = false,
}) => {
  const { t } = useTranslation();
  const { data, isLoading } = useLocationProcess("site");

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const listRef = useRef(null);

  const normalizedSite = site === "None" ? "" : (site ?? "");
  const siteList = data?.data ?? [];

  const openModal = () => {
    if (!disabled) setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSearchTerm("");
  };

  const handleSelect = (name) => {
    setSite(name);
    closeModal();
  };

  /* ---------- Search ---------- */
  const query = searchTerm.trim().toLowerCase();

  const filteredSites = useMemo(() => {
    if (!query) return siteList;
    return siteList.filter((item) =>
      (item?.name ?? "").toLowerCase().includes(query),
    );
  }, [query, siteList]);

  /* ---------- Grouping ---------- */
  const groupedSites = useMemo(() => {
    if (query) return {};

    return filteredSites.reduce((acc, item) => {
      const name = item?.name ?? "";
      if (!name) return acc;

      const firstChar = name.charAt(0).toUpperCase();
      const groupKey = /[0-9]/.test(firstChar) ? "#" : firstChar;

      acc[groupKey] ||= [];
      acc[groupKey].push(item);
      return acc;
    }, {});
  }, [filteredSites, query]);

  const groupKeys = useMemo(
    () => Object.keys(groupedSites).sort(),
    [groupedSites],
  );

  /* ---------- Auto-scroll to selected ---------- */
  useEffect(() => {
    if (!isModalOpen || !normalizedSite) return;

    requestAnimationFrame(() => {
      const el = listRef.current?.querySelector(
        `[data-site="${normalizedSite}"]`,
      );
      el?.scrollIntoView({ block: "center" });
    });
  }, [isModalOpen, normalizedSite]);

  return (
    <div className="mt-2 flex w-full flex-col">
      {/* Input */}
      <div className="relative w-full">
        <label>
          {t("qrScanner:siteName")} <strong className="text-red-500">*</strong>
        </label>

        <input
          className="w-full rounded border bg-transparent px-2 py-2 pr-16 dark:bg-gray-600"
          placeholder={t("qrScanner:selectaSite")}
          value={normalizedSite}
          readOnly
          onClick={openModal}
          disabled={disabled}
        />

        {/* Clear */}
        {normalizedSite && !disabled && (
          <button
            type="button"
            className="absolute right-8 top-1/2 mt-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              setSite("");
            }}
          >
            <Close fontSize="small" />
          </button>
        )}

        {/* Open */}
        <button
          type="button"
          className="absolute right-2 top-1/2 mt-3 -translate-y-1/2"
          onClick={openModal}
          disabled={disabled}
        >
          <ChevronRightIcon />
        </button>

        {showAlert && !normalizedSite && (
          <p className="text-xs text-red-600">{t("validation.siteRequired")}</p>
        )}
      </div>

      {/* Modal / Bottom Sheet */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={closeModal}>
          <div
            className="absolute bottom-0 max-h-[85vh] w-full rounded-t-2xl bg-white shadow-xl dark:bg-gray-700 sm:left-1/2 sm:top-1/2 sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between border-b p-4">
              <span className="font-semibold">{t("qrScanner:siteName")}</span>
              <button onClick={closeModal}>
                <Close />
              </button>
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full rounded border p-2 pl-10 pr-10 text-sm"
                  placeholder={`${t("common:search")} site or code`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                {searchTerm && (
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setSearchTerm("")}
                  >
                    <ClearIcon fontSize="small" />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div
              ref={listRef}
              className="max-h-[55vh] overflow-y-auto px-4 pb-6"
            >
              {isLoading ? (
                <SiteNameOptionsSkeleton />
              ) : query ? (
                filteredSites.map((item) => {
                  const name = item.name;
                  const selected = name === normalizedSite;

                  return (
                    <div
                      key={item.id ?? name}
                      data-site={name}
                      className={`flex cursor-pointer items-center justify-between rounded px-3 py-2 ${
                        selected
                          ? "bg-cyan-100 font-semibold"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleSelect(name)}
                    >
                      {name}
                      {selected && <CheckIcon fontSize="small" />}
                    </div>
                  );
                })
              ) : (
                groupKeys.map((key) => (
                  <div key={key}>
                    <div className="sticky top-0 bg-white py-1 font-bold dark:bg-gray-700">
                      {key === "#" ? "# — Codes" : key}
                    </div>

                    {groupedSites[key].map((item) => {
                      const name = item.name;
                      const selected = name === normalizedSite;

                      return (
                        <div
                          key={item.id ?? name}
                          data-site={name}
                          className={`flex cursor-pointer items-center justify-between rounded px-3 py-2 ${
                            selected
                              ? "bg-cyan-100 font-semibold"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => handleSelect(name)}
                        >
                          {name}
                          {selected && <CheckIcon fontSize="small" />}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteNameOptions;
