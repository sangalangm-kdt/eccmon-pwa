// utils/statusColors.js

// Lighter pastel colors for statuses
export const statusColors = {
  storage: "#b3e0ff", // Lighter Pastel Blue
  process: "#8fd5a7", // Lighter Pastel Green
  mounted: "#f9e28c", // Lighter Pastel Yellow
  dismounted: "#f5b39f", // Lighter Pastel Orange
  disposal: "#ff99b3", // Lighter Pastel Red
};

// Function to darken the text color based on the background color
const darkenColor = (color, factor) => {
  let [r, g, b] = hexToRgb(color);
  r = Math.round(r * (1 - factor));
  g = Math.round(g * (1 - factor));
  b = Math.round(b * (1 - factor));
  return rgbToHex(r, g, b);
};

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
  const baseColor = processStages.includes(status.toLowerCase())
    ? statusColors.process
    : statusColors[status.toLowerCase()] || "#E0E0E0"; // Default pastel gray

  // Darken the text color by 50% for better readability
  const textColor = darkenColor(baseColor, 0.5); // Darken by 50%

  return { backgroundColor: baseColor, textColor };
};
