import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useLocationProcess } from "../../hooks/locationProcess";
import { useTranslation } from "react-i18next";

// ✅ MUI icons
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const OrderNo = ({ selectedOrderNo, setSelectedOrderNo, disabled = false }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const listRef = useRef(null);
  const inputRef = useRef(null);

  const orderHook = useLocationProcess("order-number");
  const orderNumber = orderHook?.data?.data ?? [];
  const isLoading = orderHook?.isLoading ?? false;

  const normalizedValue =
    selectedOrderNo === "None" ? "" : (selectedOrderNo ?? "");

  const openModal = useCallback(() => {
    if (!disabled) setIsModalOpen(true);
  }, [disabled]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSearchTerm("");
  }, []);

  const handleSelectOrderNo = useCallback(
    (orderNo) => {
      setSelectedOrderNo(orderNo);
      closeModal();
    },
    [setSelectedOrderNo, closeModal],
  );

  const query = searchTerm.trim().toLowerCase();

  const filteredOrderNos = useMemo(() => {
    if (!query) return orderNumber;
    return orderNumber.filter((o) =>
      (o?.name ?? "").toLowerCase().includes(query),
    );
  }, [orderNumber, query]);

  // Auto-focus search input when opening
  useEffect(() => {
    if (!isModalOpen) return;
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [isModalOpen]);

  // Auto-scroll to selected item when modal opens
  useEffect(() => {
    if (!isModalOpen || !normalizedValue) return;

    requestAnimationFrame(() => {
      const el = listRef.current?.querySelector(
        `[data-orderno="${CSS.escape(normalizedValue)}"]`,
      );
      el?.scrollIntoView({ block: "center" });
    });
  }, [isModalOpen, normalizedValue]);

  // ESC closes modal
  useEffect(() => {
    if (!isModalOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen, closeModal]);

  // Press Enter to select the first result (when searching)
  const onSearchKeyDown = (e) => {
    if (e.key !== "Enter") return;
    if (filteredOrderNos.length === 0) return;

    const first = filteredOrderNos[0]?.name ?? "";
    if (first) handleSelectOrderNo(first);
  };

  const selectedItem = useMemo(() => {
    if (!normalizedValue) return null;
    return orderNumber.find((o) => (o?.name ?? "") === normalizedValue) || null;
  }, [orderNumber, normalizedValue]);

  return (
    <div className="mt-2 flex w-full flex-col text-sm text-primaryText">
      {/* Input */}
      <div className="relative w-full">
        <label className="font-semibold">
          {t("qrScanner:orderNo")} <strong className="text-red-500">*</strong>
        </label>

        <input
          className="w-full rounded border bg-transparent px-2 py-2 pr-16 text-gray-700 focus:outline-none dark:bg-gray-600 dark:text-gray-100"
          type="text"
          placeholder={t("qrScanner:selectAnOrderNumber")}
          value={normalizedValue}
          readOnly
          onClick={openModal}
          disabled={disabled}
        />

        {/* Clear selected value */}
        {normalizedValue && !disabled && (
          <button
            type="button"
            className="absolute right-8 top-1/2 mt-3 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-200 dark:hover:bg-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrderNo("");
            }}
            aria-label={t("common:clear") || "Clear"}
          >
            <ClearIcon fontSize="small" />
          </button>
        )}

        {/* Open picker */}
        <button
          type="button"
          className="absolute right-2 top-1/2 mt-3 -translate-y-1/2 rounded p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-500"
          onClick={openModal}
          disabled={disabled}
          aria-label={t("qrScanner:openOrderPicker") || "Open order picker"}
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Modal / Bottom Sheet */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute bottom-0 max-h-[85vh] w-full rounded-t-2xl bg-white shadow-xl dark:bg-gray-700 sm:left-1/2 sm:top-1/2 sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-600">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-50">
                  {t("qrScanner:orderNo")}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-200">
                  {isLoading
                    ? t("common:loading") || "Loading..."
                    : `${filteredOrderNos.length} ${
                        t("common:results") || "results"
                      }`}
                </span>
              </div>

              <button
                type="button"
                className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                onClick={closeModal}
                aria-label={t("common:close") || "Close"}
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            {/* Sticky Search */}
            <div className="sticky top-0 z-10 bg-white p-4 dark:bg-gray-700">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
                  className="w-full rounded border bg-transparent p-2 pl-10 pr-10 text-sm text-gray-700 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  type="text"
                  placeholder={t("common:search") || "Search order numbers"}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={onSearchKeyDown}
                />

                {searchTerm.trim().length > 0 && (
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                    onClick={() => setSearchTerm("")}
                    aria-label={t("common:clear") || "Clear"}
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
              {/* Pinned selected */}
              {selectedItem && !query && (
                <div className="sticky top-0 z-10 -mx-4 mb-2 bg-white px-4 py-2 dark:bg-gray-700">
                  <div className="rounded border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-semibold text-gray-700 dark:border-gray-600 dark:bg-gray-600/60 dark:text-gray-100">
                    <div className="flex items-center justify-between">
                      <span>{selectedItem.name}</span>
                      <CheckIcon fontSize="small" />
                    </div>
                    <div className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-200">
                      {t("common:selected") || "Selected"}
                    </div>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="px-2 py-4 text-sm text-gray-500 dark:text-gray-200">
                  {t("common:loading") || "Loading..."}
                </div>
              ) : filteredOrderNos.length > 0 ? (
                <ul className="space-y-1">
                  {filteredOrderNos.map((orderNo) => {
                    const name = orderNo?.name ?? "";
                    const isSelected = name === normalizedValue;

                    return (
                      <li
                        key={orderNo?.id ?? name}
                        data-orderno={name}
                        className={[
                          "flex cursor-pointer items-center justify-between rounded px-3 py-2",
                          "text-gray-700 dark:text-gray-100",
                          "hover:bg-cyan-100 dark:hover:bg-gray-600",
                          isSelected
                            ? "bg-cyan-50 font-semibold dark:bg-gray-600/60"
                            : "",
                        ].join(" ")}
                        onClick={() => handleSelectOrderNo(name)}
                      >
                        <span className="text-sm">{name}</span>
                        {isSelected && <CheckIcon fontSize="small" />}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="px-2 text-sm text-gray-500 dark:text-gray-200">
                  {t("common:noResultsFound") || "No results found"}
                </p>
              )}
            </div>

            <div className="h-4 sm:hidden" />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderNo;
