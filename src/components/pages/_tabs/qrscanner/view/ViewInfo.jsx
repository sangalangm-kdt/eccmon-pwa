import React, { useState } from "react";
import { useSwipeable } from "react-swipeable"; // Import react-swipeable

const ViewInfo = () => {
  // Location and Start Date
  const location = "KLL";
  const startDate = "2024-08-20";

  const processValues = [
    {
      process: "Disassembly",
      processor: "東洋鉄工",
      completionDate: "2024-08-21",
      passed: "Y",
      orderNo: "317XXXX123A",
    },
    {
      process: "Grooving",
      processor: "茶屋テクノロジー",
      completionDate: "2024-08-22",
      passed: "Y",
      orderNo: "317XXXX123A",
    },
    {
      process: "LMD",
      processor: "KHI",
      completionDate: "2024-08-23",
      passed: "Y",
      orderNo: "317XXXX123A",
    },
    {
      process: "FINISHING_1",
      processor: "茶屋テクSK-1",
      completionDate: "2024-08-24",
      passed: "Y",
      orderNo: "317XXXX123A",
    },
    {
      process: "ASSEMBLY_1",
      processor: "福助GE",
      completionDate: "2024-08-25",
      passed: "Y",
      orderNo: "317XXXX123A",
    },
  ];

  // Status and Additional Information
  const status = "Storage";
  const cycle = 1;

  // State to track the current process in the carousel
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the next process
  const nextProcess = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % processValues.length);
  };

  // Function to go to the previous process
  const prevProcess = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + processValues.length) % processValues.length,
    );
  };

  const currentProcess = processValues[currentIndex];

  // Swipeable handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => nextProcess(), // Swipe left to go to next process
    onSwipedRight: () => prevProcess(), // Swipe right to go to previous process
    preventDefaultTouchmoveEvent: true, // Prevents default touch behavior
  });

  return (
    <div className="h-screen flex flex-col items-center bg-gray-50">
      <div className="bg-white rounded-lg p-4 mt-24 w-[95%] flex flex-col justify-center items-center">
        <div className="container flex flex-col w-full">
          {/* Centered value */}
          <div className="flex justify-center items-center text-2xl font-bold mb-8 mt-8">
            T-000
          </div>

          {/* Status and Cycle Information */}
          <div className="flex flex-col space-y-4 px-2 py-5 mt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-sm">Status</span>
              <span>{status}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-sm">Cycle</span>
              <span>{cycle}</span>
            </div>
          </div>

          {/* Location and Start Date */}
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-sm">Location</span>
            <span>{location}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-sm">Start Date</span>
            <span>{startDate}</span>
          </div>

          {/* Separate Order No. Container */}
          <div className="flex flex-row items-center space-x-4 pb-2">
            <span className="font-semibold text-sm">Order No.:</span>
            <span className="font-normal text-xs">
              {currentProcess.orderNo}
            </span>
          </div>
        </div>
      </div>

      {/* Process Information Container */}
      <div
        className="flex flex-col space-y-4 px-2 py-5 mb-6 bg-white rounded-lg mt-2"
        {...handlers} // Spread the swipeable handlers here
      >
        <div className="font-semibold text-lg mb-4">
          Operation: {currentProcess.process}
        </div>
        <div className="flex flex-col space-x-4 py-2">
          {/* Grouping Process, Processor, Passed, and Completion Date */}
          <div className="flex items-center space-x-4 mb-2">
            <span className="font-semibold text-sm">Processor:</span>
            <span className="font-normal text-xs">
              {currentProcess.processor}
            </span>
          </div>
          <div className="flex items-center space-x-4 mb-2">
            <span className="font-semibold text-sm">Completion Date:</span>
            <span className="font-normal text-xs">
              {currentProcess.completionDate}
            </span>
          </div>
          <div className="flex items-center space-x-4 mb-2">
            <span className="font-semibold text-sm">Passed?</span>
            <span className="font-normal text-xs">{currentProcess.passed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInfo;
