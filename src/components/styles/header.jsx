const commonContainerStyles =
  "flex min-w-full lg:relative lg:bottom-0 xs:fixed xs:bottom-0 xs:left-1/2 xs:transform xs:-translate-x-1/2 md:relative md:bottom-auto sm:relative sm:bottom-auto";

const languagess = {
  container: `${commonContainerStyles} m-0 p-1 flex items-center justify-center xs:bg-white lg:bg-languageSwitchBackground`, // Centering the container
  languageSwitcher: `border-b-2 p-1 focus:outline-none text-gray-800 hover:underline lg:relative lg:top-0 lg:right-0 md:relative md:top-0 md:right-0 sm:relative sm:top-0 sm:left-1/2 sm:transform sm:-translate-x-1/2 xs:bottom-0 xs:justify-center xs:items-center`,
  installationButton: ` lg:relative lg:mr-3 xs:fixed xs:top-2 xs:left-1/2 xs:transform xs:-translate-x-1/2`, // Adjusted positioning for the installation button
};

const navbarStyles = {
  topNavbar: `px-2 py-1 bg-navbar w-full shadow md:top-0 xs:top-0 lg:justify-between float-none`,
  navbarContainer: "items-center justify-between p-0",
  navBarInstall: "lg:right-0",
  navbarLink:
    "hover:text-primary focus:text-primary text-secondaryText font-semibold p-2 flex flex-col items-center", // Centering text and icons
  activeLink: "text-primary",
  logo: "w-10 p-1 mr-4 xs:justify-center",
  bottomNavbar: `fixed bottom-0 w-full bg-navbar flex justify-center items-center float-none`,
  bottomNavbarButton: `flex flex-col items-center justify-center p-2`, // Centering buttons
  iconContainer: "w-6 h-6 mb-1 focus:fill-primary focus:outline-none",
  navbarLinkBottom: "text-sm",
  qrContainer: "border border-none bg-primary rounded-full p-4 ml-3", // Removed absolute positioning
};
const modal = {
  modalContent: "bg-primary text-white px-2 py-2 rounded mr-0",
  modalBackground:
    "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50",
  modalContainer: "bg-white p-8 rounded shadow-lg relative",
  exitButton: "absolute top-2 right-2 text-gray-500 cursor-pointer",
};

export { languagess, navbarStyles, modal };
