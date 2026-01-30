// styles/main.js

const colors = {
  // Buttons
  primary:
    "bg-cyan-to-blue hover:bg-tertiary active:bg-cyan-to-blue-active focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400/40",
  secondary: "bg-gray-500 hover:bg-gray-600",

  // Text
  primaryText: "text-white",
  bodyText: "text-gray-800 dark:text-gray-100",
  mutedText: "text-gray-500 dark:text-gray-300",

  // Surfaces
  surface: "bg-white dark:bg-gray-700",
  page: "bg-gray-100 dark:bg-gray-800",

  // Borders
  border: "border-gray-300 dark:border-gray-600",
};

const padding = {
  small: "py-1 px-2",
  medium: "py-2 px-4",
  large: "py-3 px-6",
  responsive: "py-3 px-2 sm:py-3 sm:px-3 md:px-2 md:py-3 lg:py-3 lg:px-2",
};

const width = {
  responsive: "w-80 sm:w-80 md:w-80 lg:w-80",
};

const margin = {
  small: "m-1",
  medium: "m-2",
  large: "m-4",
  responsive: "m-2 sm:m-4 md:m-6",
};

const sizes = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
  responsive: "text-sm",
};

const buttonStyles = {
  base: `rounded-md transition-all duration-300 ease-in-out active:scale-95 cursor-pointer ${sizes.responsive}`,
  primary: `${colors.primary} ${padding.responsive} ${colors.primaryText} font-semibold w-50`,
  installPWAButton: `border border-primary ${padding.responsive} hover:bg-primary hover:text-white text-primary font-semibold w-50`,
  disabled: `${colors.primary} ${padding.responsive} ${colors.primaryText} font-semibold w-50 rounded-md opacity-50 cursor-not-allowed`,
};

const textStyles = {
  heading: `text-xl font-bold ${colors.bodyText}`,
  subheading: `text-sm font-semibold ${colors.bodyText}`,
  paragraph: `${sizes.responsive} ${colors.mutedText}`,
};

const inputStyles = {
  container: `flex flex-col items-center justify-center ${padding.responsive}`,
  inputContainer: `flex flex-col gap-1 ${padding.responsive}`,
  input: `w-full rounded-md border ${colors.border} bg-white/70 text-gray-800 placeholder:text-gray-400 dark:bg-gray-800/40 dark:text-gray-100 dark:placeholder:text-gray-400 ${sizes.responsive} ${padding.responsive} focus:outline-none focus:ring-2 focus:ring-cyan-400/30`,
  label: `block font-semibold text-gray-800 dark:text-gray-200 ${sizes.responsive}`,

  // ✅ theme-synced error banner (use this in Login)
  errorBanner:
    "w-full rounded-md bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-center text-sm px-3 py-2",
};

const backgroundDrop = {
  bgDrop: "absolute inset-0 h-full w-full object-cover",
};

const container = {
  containerDiv:
    "w-full rounded-lg border shadow-md p-12 xs:border-none xs:shadow-none sm:border sm:shadow-md bg-white dark:bg-gray-800 dark:border-gray-600 flex flex-col items-center justify-center",
};

const link = {
  color: "text-primary font-medium text-sm hover:underline",
};

export {
  colors,
  margin,
  padding,
  sizes,
  buttonStyles,
  textStyles,
  inputStyles,
  width,
  backgroundDrop,
  container,
  link,
};
