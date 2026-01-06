import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { useLocationProcess } from "../../hooks/locationProcess";
import { useTranslation } from "react-i18next";

const OrderNo = ({ selectedOrderNo, setSelectedOrderNo, disabled }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const orderNumber = useLocationProcess("order-number").data?.data;
  const { t } = useTranslation();

  // Filter order numbers based on search term
  const filteredOrderNos =
    orderNumber?.filter((orderNo) =>
      orderNo?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  console.log(filteredOrderNos);

  const handleSelectOrderNo = (orderNo) => {
    setSelectedOrderNo(orderNo);
    setSearchTerm("");
    setIsModalOpen(false);
  };

  return (
    <div className="mt-2 flex w-full flex-col text-sm text-primaryText">
      <div className="relative w-full">
        <label className="font-semibold">
          {t("qrScanner:orderNo")} <strong className="text-red-500">*</strong>
        </label>
        <input
          className="w-full rounded border px-2 py-2 text-gray-600 dark:bg-gray-600 dark:text-gray-100"
          type="text"
          placeholder={t("qrScanner:selectAnOrderNumber")}
          value={selectedOrderNo}
          readOnly
          onClick={() => setIsModalOpen(true)}
          disabled={disabled}
        />
        <button
          className="absolute right-2 top-1/2 mt-3 -translate-y-1/2 transform"
          onClick={() => setIsModalOpen(true)}
        >
          <FaChevronRight className="text-primaryText dark:text-gray-50" />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-700">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b p-4">
            <button
              className="text-gray-500 dark:text-gray-100"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4">
            <input
              className="w-full rounded border bg-transparent p-2 dark:bg-gray-800 dark:text-gray-100"
              type="text"
              placeholder="Search order numbers"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Vertical List */}
          <div className="flex-1 overflow-y-auto p-4">
            {searchTerm ? (
              <ul className="space-y-2">
                {filteredOrderNos.length > 0 ? (
                  filteredOrderNos?.map((orderNo) => (
                    <li
                      key={orderNo.id}
                      className="cursor-pointer hover:bg-cyan-100 dark:text-gray-100"
                      onClick={() => handleSelectOrderNo(orderNo.name)}
                    >
                      {orderNo.name}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No results found</p>
                )}
              </ul>
            ) : (
              <ul className="space-y-2">
                {orderNumber?.map((orderNo) => (
                  <li
                    key={orderNo.id}
                    className="cursor-pointer text-gray-700 hover:bg-cyan-100 dark:text-gray-100"
                    onClick={() => handleSelectOrderNo(orderNo.name)}
                  >
                    {orderNo.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderNo;
