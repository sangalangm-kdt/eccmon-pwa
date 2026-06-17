import React, { useEffect, useMemo, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { useLocationProcess } from "../../hooks/locationProcess";
import { useTranslation } from "react-i18next";
import OptionBottomSheet from "./OptionBottomSheet";
import { getOrderNoValue, hasFieldValue } from "../utils/formFieldValidation";

const OrderNo = ({
  selectedOrderNo,
  setSelectedOrderNo,
  disabled,
  required = true,
  onOptionsAvailabilityChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useLocationProcess("order-number");
  const orderNumber = data?.data ?? [];
  const { t } = useTranslation("qrScanner");
  const hasOptions = orderNumber.length > 0;
  const isRequired = required && hasOptions;

  useEffect(() => {
    onOptionsAvailabilityChange?.(hasOptions);
  }, [hasOptions, onOptionsAvailabilityChange]);

  const selectedValue = hasFieldValue(selectedOrderNo) ? `${selectedOrderNo}`.trim() : "";

  const filteredOrderNos = useMemo(() => {
    if (!searchTerm.trim()) return orderNumber;
    const query = searchTerm.trim().toLowerCase();
    return orderNumber.filter((orderNo) =>
      getOrderNoValue(orderNo).toLowerCase().includes(query),
    );
  }, [orderNumber, searchTerm]);

  const handleOpen = () => {
    if (disabled || isLoading || !hasOptions) return;
    setSearchTerm("");
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleSelectOrderNo = (orderNo) => {
    setSelectedOrderNo(getOrderNoValue(orderNo));
    handleClose();
  };

  const isSelected = (orderNo) => getOrderNoValue(orderNo) === selectedValue;

  return (
    <div className="mt-2 flex w-full flex-col text-sm text-primaryText">
      <label className="font-semibold text-primaryText dark:text-gray-100">
        {t("orderNo")}
        {isRequired && <strong className="text-red-500"> *</strong>}
      </label>

      {isLoading ? (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
          {t("loadingOptions")}
        </p>
      ) : hasOptions ? (
        <div className="relative mt-1 w-full">
          <input
            className="w-full rounded border px-2 py-2.5 pr-10 text-gray-600 dark:bg-gray-600 dark:text-gray-100"
            type="text"
            placeholder={t("selectOrderNo")}
            value={selectedValue}
            readOnly
            onClick={handleOpen}
            disabled={disabled}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 transform"
            onClick={handleOpen}
            disabled={disabled}
            aria-label={t("selectOrderNo")}
          >
            <FaChevronRight className="text-primaryText dark:text-gray-50" />
          </button>
        </div>
      ) : (
        <>
          <select
            disabled
            className="mt-1 w-full rounded border bg-gray-100 px-2 py-2.5 text-sm text-gray-500 dark:bg-gray-600 dark:text-gray-300"
          >
            <option>{t("noOrderNumbersAvailable")}</option>
          </select>
          {required && (
            <p className="mt-1 text-sm text-amber-600 dark:text-amber-300 md:text-xs">
              {t("noOrderNumbersConfigured")}
            </p>
          )}
        </>
      )}

      <OptionBottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title={t("selectOrderNo")}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={t("searchOrderNo")}
        showSearch={hasOptions}
      >
        {searchTerm.trim() && filteredOrderNos.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-300">
            {t("noMatchingOptionsFound")}
          </p>
        ) : (
          <div className="space-y-1">
            {filteredOrderNos.map((orderNo) => {
              const label = getOrderNoValue(orderNo);
              const selected = isSelected(orderNo);

              return (
                <button
                  key={orderNo.id ?? label}
                  type="button"
                  onClick={() => handleSelectOrderNo(orderNo)}
                  className={`flex min-h-12 w-full items-center rounded-lg px-3 text-left text-sm transition-colors ${
                    selected
                      ? "bg-cyan-50 font-medium text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-200"
                      : "text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </OptionBottomSheet>
    </div>
  );
};

export default OrderNo;
