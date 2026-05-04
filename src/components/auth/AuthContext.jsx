import React, { createContext, useContext } from "react";
import { useAuthentication } from "../../hooks/auth";
// import Preloader from "../constants/preloader/Preloader";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, login, logout, isLoading } = useAuthentication();

  // if (isLoading) {
  //   return (
  //     <div>
  //       <Preloader />
  //     </div>
  //   );
  // }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
