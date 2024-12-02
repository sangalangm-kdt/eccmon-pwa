import React, { createContext, useContext, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { useAuthentication } from "../../hooks/auth";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const {user,login,logout} = useAuthentication()

  return (
    <AuthContext.Provider value={{user, login, logout }}>
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
