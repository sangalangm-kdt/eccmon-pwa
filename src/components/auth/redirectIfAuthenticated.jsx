/* eslint-disable no-unused-vars */
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RedirectIfAuthenticated = ({ children }) => {
  // const { isAuthenticated } = useAuth();
  const { user } = useAuth();

  return user ? <Navigate to="/" /> : children;
};

export default RedirectIfAuthenticated;
