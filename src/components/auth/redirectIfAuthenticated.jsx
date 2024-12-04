/* eslint-disable no-unused-vars */
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useAuthentication } from "../../hooks/auth";

const RedirectIfAuthenticated = ({ children }) => {
  // const { isAuthenticated } = useAuth();
  const { user } = useAuthentication();

  // console.log(isAuthenticated);
  return user ? <Navigate to="/" /> : children;
};

export default RedirectIfAuthenticated;
