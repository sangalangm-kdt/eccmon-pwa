import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { useLocationProcess } from "../../hooks/locationProcess";

const OrderNo = ({selectedOrderNo, setSelectedOrderNo}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { orderNumber } = useLocationProcess();

  // Filter order numbers based on search term
  const filteredOrderNos = orderNumber?.data?.filter((orderNo) =>
    orderNo.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelectOrderNo = (orderNo) => {
    setSelectedOrderNo(orderNo);
    setSearchTerm("");
    setIsModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col mt-2 text-sm  text-primaryText">
      <div className="relative w-full">
        <label className="font-semibold">Order No.</label>
        <input
          className="border w-full py-2 px-2 rounded"
          type="text"
          placeholder="Select an order number"
          value={selectedOrderNo}
          readOnly
          onClick={() => setIsModalOpen(true)}
        />
        <button
          className="absolute mt-3 right-2 top-1/2 transform -translate-y-1/2"
          onClick={() => setIsModalOpen(true)}
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <button
              className="text-gray-500"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4">
            <input
              className="border w-full p-2 rounded"
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
                      className="cursor-pointer hover:bg-cyan-100"
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
                {orderNumber?.data?.map((orderNo) => (
                  <li
                    key={orderNo.id}
                    className="cursor-pointer hover:bg-cyan-100"
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
