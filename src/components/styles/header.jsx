const commonContainerStyles =
  "flex min-w-full lg:relative lg:bottom-0 xs:fixed xs:bottom-0 xs:left-1/2 xs:transform xs:-translate-x-1/2 md:relative md:bottom-auto sm:relative sm:bottom-auto";

const languagess = {
  container: `${commonContainerStyles} m-0 p-1 flex items-center justify-center z-50 xs:bg-white lg:bg-languageSwitchBackground`, // Added z-index
  languageSwitcher: `sm:p-0 lg:p-0 xs:p-2 focus:outline-none text-gray-800  xs:text-xs hover:underline lg:relative lg:top-0 lg:right-0 md:relative md:top-0 md:right-0 sm:relative sm:top-0 sm:left-1/2 sm:transform sm:-translate-x-1/2 xs:bottom-0 xs:justify-center xs:items-center`,
  installationButton: `lg:relative lg:mr-3 xs:fixed xs:top-2 xs:left-1/2 xs:transform xs:-translate-x-1/2`,
};

const navbarStyles = {
  topNavbar: `border-t-2 px-2 py-1 bg-navbar w-full shadow md:top-0 xs:top-0 lg:justify-between float-none`,
  navbarContainer: "items-center justify-between p-0",
  navBarInstall: "lg:right-0",
  navbarLink:
    "hover:text-primary focus:text-primary text-secondaryText font-semibold p-2 flex flex-col items-center", // Centering text and icons
  activeLink: "text-primary",
  logo: "w-10 p-1 mr-4 xs:justify-center ",
  bottomNavbar: `fixed bottom-0 w-full bg-white border flex justify-center items-center rounded-t-xl shadow-md p-2`,
  bottomNavbarButton: `flex flex-col items-center justify-center px-8 py-2`, // Centering buttons
  iconContainer: "w-6 h-6 mb-1  focus:fill-primary focus:outline-none",
  navbarLinkBottom: "text-sm",
  qrContainer: "border border-none bg-cyan-to-blue rounded-full p-4 shadow-md", // Removed absolute positioning
};
const modal = {
  modalContent: "bg-primary text-white px-2 py-2 rounded mr-0",
  modalBackground:
    "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50",
  modalContainer: "bg-white p-8 rounded shadow-lg relative m-4",
  exitButton: "absolute top-2 right-2 text-gray-500 cursor-pointer",
};

export { languagess, navbarStyles, modal };
