import React, { createContext, useContext } from "react";
import { useAuthentication } from "../../hooks/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, login, logout, isLoading } = useAuthentication();

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
