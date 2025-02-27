//color styles

import { disable } from "workbox-navigation-preload";

const colors = {
  primary:
    "bg-cyan-to-blue hover:bg-tertiary focus:ring-blue-200 active:bg-cyan-to-blue-active",
  secondary: "bg-gray-500",
  primaryText: "text-white",
};

//padding utilities
const padding = {
  small: "py-1 px-2",
  medium: "py-2 px-4",
  large: "py-3 px-6",
  responsive: "py-3 px-2 sm:py-3 sm:px-3 md:px-2 md:py-3 lg:py-3 lg:px-2",
};

//width
const width = {
  responsive: "w-80 sm:80 md:80 lg:80",
};

//margin utilities
const margin = {
  small: "m-1",
  medium: "m-2",
  large: "m-4",
  responsive: "m-2 sm:m-4 md:m-6 ",
};

//size
const sizes = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
  responsive: "text-sm ",
};

//button styles
const buttonStyles = {
  base: `rounded-md transition-all duration-300 ease-in-out transform active:scale-95 cursor-pointer ${sizes.responsive}`,
  primary: `${colors.primary} ${padding.responsive} ${colors.primaryText} font-semibold py-2 px-4 w-50`,
  installPWAButton: `border border-1 border-primary  ${padding.responsive} hover:bg-primary hover:text-white text-primary font-semibold py-2 px-4 w-50`,
  disabled: `${colors.primary} ${padding.responsive} ${colors.primaryText} font-semibold py-2 px-4 w-50 rounded-md opacity-50 cursor-not-allowed active:bg-cyan-to-blue hover:bg-tertiary`,
};

//text styles
const textStyles = {
  heading: `text-xl font-bold text-primaryText `,
  subheading: "text-sm font-semibold",
  paragraph: `${sizes.responsive} text-gray-700`,
};

//input styles
const inputStyles = {
  container: `flex flex-col items-center justify-center  ${padding.responsive}`,
  inputContainer: `flex flex-col  gap-1 ${padding.responsive}`,
  input: `border dark:border-gray-200 dark:bg-gray-300 dark:bg-opacity-10 rounded-md  box-border ${sizes.responsive} bg-transparent focus:outline-primary ${padding.responsive} focus:${padding.responsive}`,
  label: ` block font-semibold text-primaryText ${sizes.responsive} dark:text-gray-300`,
};

const backgroundDrop = {
  bgDrop: "absolute inset-0 w-full h-full object-cover",
};

//container
const container = {
  containerDiv: `dark:lg:bg-gray-600 dark:md:bg-gray-600 dark:sm:bg-gray-600 dark:xs:bg-gray-700 bg-white flex flex-col items-center justify-center w-full   rounded-lg border shadow-md p-12 xs:border-none xs:shadow-none sm:border sm:shadow-md`,
};

//links
const link = {
  color: "text-primary text-sm hover:underline",
};

//navbar

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
