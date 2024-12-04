import React, { useState } from "react";
import { useLocationProcess } from "../../hooks/locationProcess";

const OrderNo = () => {
  // const ordeNoData = [
  //   "3103MELQZG1",
  //   "3179M8YPV6",
  //   "3103JMK9A8",
  //   "3173M0RFXZ",
  //   "3107M3VXBG",
  // ];

  const [selectedOrderNo, setSelectedOrderNo] = useState("");
  const {orderNumber} = useLocationProcess();

  const handleChange = (e) => {
    setSelectedOrderNo(e.target.value);
  };

  return (
    <div>
      <label className="text-sm text-primaryText font-semibold">
        Order No.
      </label>
      <select
        value={selectedOrderNo}
        onChange={handleChange}
        className="w-full border rounded p-2"
      >
        <option value="">Select Order No.</option>
        {orderNumber.data?.map((orderNo, index) => (
          <option key={index} value={orderNo.name}>
            {orderNo.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OrderNo;
