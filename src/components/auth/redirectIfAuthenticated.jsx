import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RedirectIfAuthenticated = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);
  return isAuthenticated ? <Navigate to="/" /> : children;
};

export default RedirectIfAuthenticated;
