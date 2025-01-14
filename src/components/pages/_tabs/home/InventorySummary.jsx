import React from "react";
import { useCylinderCover } from "../../../../hooks/cylinderCover";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Carousel Settings
const sliderSettings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1, // Show 3 categories per slide
  slidesToScroll: 1,
  autoplay: true, // Enable autoplay
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2, // Show 2 categories on medium screens
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1, // Show 1 category on small screens
      },
    },
  ],
};

const InventorySummary = ({ userId }) => {
  const { cylinder } = useCylinderCover();
  const data = cylinder?.data;

  // Filter the data based on the current user's user_id
  const filteredData = data?.filter((item) => item.user_id === userId) || [];

  // Define the categories and their corresponding statuses
  const categories = [
    { name: "Storage", status: "storage" },
    {
      name: "Process",
      status: ["disassembly", "grooving", "lmd", "assembly", "finishing"],
    },
    { name: "Mounted", status: "mounted" },
    { name: "Dismounted", status: "dismounted" },
    { name: "Disposal", status: "disposal" },
  ];

  // Count the items for each category
  const categoryCounts = categories.map((category) => {
    const { name, status } = category;

    // If status is an array (for Process category), check if the item status matches any of them
    const count =
      filteredData?.filter((item) =>
        Array.isArray(status)
          ? status.includes(item.status.toLowerCase())
          : item.status.toLowerCase() === status,
      ).length || 0;

    return { name, count };
  });

  const totalSerialNumbers = filteredData
    ?.map((item) => item.serial_number)
    .reduce((acc, serial) => {
      acc[serial] = (acc[serial] || 0) + 1;
      return acc;
    }, {});

  const totalCount = Object.values(totalSerialNumbers || {}).reduce(
    (acc, count) => acc + count,
    0,
  );

  const getCategoryColor = (category) => {
    switch (category) {
      case "Storage":
        return { textColor: "text-blue-500", bgColor: "bg-blue-100" };
      case "Process":
        return { textColor: "text-green-500", bgColor: "bg-green-100" };
      case "Mounted":
        return { textColor: "text-yellow-500", bgColor: "bg-yellow-100" };
      case "Dismounted":
        return { textColor: "text-orange-500", bgColor: "bg-orange-100" };
      case "Disposal":
        return { textColor: "text-red-500", bgColor: "bg-red-100" };
      default:
        return { textColor: "text-gray-700", bgColor: "bg-gray-100" };
    }
  };

  return (
    <div className="lg:pt-30 z-10 flex flex-col px-4 xs:pb-6 xs:pt-6">
      <div
        className="h-full rounded-xl border border-gray-200 bg-white p-4 shadow-lg"
        id="inventory-summary"
      >
        <div>
          <h2 className="text-lg font-medium text-gray-700">
            Total cylinder cover scanned
          </h2>
          <p className="py-5 text-lg font-semibold text-gray-500">
            {totalCount}
          </p>
        </div>
        {/* Carousel */}
        <Slider {...sliderSettings}>
          {categoryCounts.map(({ name, count }) => {
            const { textColor, bgColor } = getCategoryColor(name);
            return (
              <div
                key={name}
                className={`flex flex-grow flex-col items-center justify-center gap-4 text-sm ${bgColor} ${textColor} rounded-lg p-18`}
              >
                <div className="flex flex-col">
                  <span className="text-center font-semibold capitalize">
                    {name}
                  </span>
                  <span className="text-center font-medium">{count}</span>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default InventorySummary;
