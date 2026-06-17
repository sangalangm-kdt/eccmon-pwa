const commonContainerStyles =
  "flex min-w-full lg:relative lg:bottom-0 xs:fixed xs:bottom-0 xs:left-1/2 xs:transform xs:-translate-x-1/2 md:relative md:bottom-auto sm:relative sm:bottom-auto";

const languagess = {
  container: `${commonContainerStyles} m-0 p-1 flex items-center justify-center z-50 xs:bg-white lbg-languageSwitchBackground`, // Added z-index
  languageSwitcher: ` sm:p-0 lg:p-0 xs:p-2 focus:outline-none text-gray-800  xs:text-xs hover:underline lg:relative lg:top-0 lg:right-0 md:relative md:top-0 md:right-0 sm:relative sm:top-0 sm:left-1/2 sm:transform sm:-translate-x-1/2 xs:bottom-0 xs:justify-center xs:items-center`,
  installationButton: `lg:relative lg:mr-3 xs:fixed xs:top-2 xs:left-1/2 xs:transform xs:-translate-x-1/2`,
};

const navbarStyles = {
  topNavbar: `border-t-2 px-2 py-1 bg-navbar w-full shadow md:top-0 xs:top-0 lg:justify-between float-none dark:border-gray-700 `,
  navbarContainer:
    "mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8",
  navBarInstall: "lg:right-0",
  navbarLink:
    "hover:text-primary focus:text-primary text-secondaryText font-semibold p-2 md:text-base flex flex-col items-center",
  activeLink: "text-primary",
  logo: "w-10 p-1 mr-4 xs:justify-center ",
  bottomNavbar:
    "fixed bottom-0 z-50 w-full border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 md:hidden",
  bottomNavbarInner:
    "mx-auto flex h-[72px] w-full max-w-6xl items-center justify-around px-4 pb-[env(safe-area-inset-bottom,0px)]",
  bottomNavbarButton:
    "flex h-full flex-1 items-center justify-center",
  bottomNavIcon: "size-6 shrink-0 focus:outline-none",
  qrContainer:
    "flex size-16 -mt-5 items-center justify-center rounded-full bg-cyan-to-blue shadow-lg",
  qrIcon: "size-7 text-white",
};
const modal = {
  modalContent: "bg-primary text-white px-2 py-2 rounded mr-0",
  modalBackground:
    "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50",
  modalContainer: "bg-white p-8 rounded shadow-lg relative m-4",
  exitButton: "absolute top-2 right-2 text-gray-500 cursor-pointer",
};

export { languagess, navbarStyles, modal };
