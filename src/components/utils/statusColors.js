// utils/statusColors.js

// Lighter pastel colors for statuses
export const statusColors = {
  storage: "bg-cyan-100 dark:bg-transparent dark:border dark:border-cyan-300", // Lighter Pastel Blue
  process: "bg-green-100 dark:bg-transparent dark:border dark:border-green-300", // Lighter Pastel Green
  mounted: "bg-yellow-100 dark:bg-transparent dark:border dark:border-yellow-300", // Lighter Pastel Yellow
  dismounted: "bg-orange-100 dark:bg-transparent dark:border dark:border-orange-300", // Lighter Pastel Orange
  disposal: "bg-red-100 dark:bg-transparent dark:border dark:border-red-300", // Lighter Pastel Red
};

// Function to darken the text color based on the background color

// Convert hex to rgb
const hexToRgb = (hex) => {
  let r = 0,
    g = 0,
    b = 0;

  // 3 digits
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  // 6 digits
  else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }

  return [r, g, b];
};

// Convert rgb to hex
const rgbToHex = (r, g, b) => {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
};

// Get status colors dynamically
export const getStatusColors = (status) => {
  const processStages = [
    "disassembly",
    "grooving",
    "lmd",
    "finishing",
    "assembly",
  ];

  // Default pastel gray for unmatched statuses
  const baseColor = processStages.includes(status.toLowerCase())
    ? statusColors.process
    : statusColors[status.toLowerCase()] || "bg-gray-50"; // Default pastel gray

  // Tailwind classes for text color based on background
  let textColor = "text-gray-700"; // Default text color

  // Determine text color based on background (lightness/darkness)
  if (baseColor === "bg-cyan-100 dark:bg-transparent dark:border dark:border-cyan-300") textColor = "text-cyan-500 dark:text-cyan-300 ";
  if (baseColor === "bg-green-100 dark:bg-transparent dark:border dark:border-green-300") textColor = "text-green-500";
  if (baseColor === "bg-yellow-100 dark:bg-transparent dark:border dark:border-yellow-300") textColor = "text-yellow-500";
  if (baseColor === "bg-orange-100 dark:bg-transparent dark:border dark:border-orange-300") textColor = "text-orange-500";
  if (baseColor === "bg-red-100 dark:bg-transparent dark:border dark:border-red-300") textColor = "text-red-500";
  if (baseColor === "bg-gray-50") textColor = "text-gray-700"; // Default text color for gray

  return { textColor, bgColor: baseColor };
};
