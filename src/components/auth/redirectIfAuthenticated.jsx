import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Preloader from "../constants/preloader/Preloader";

const RedirectIfAuthenticated = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Preloader />;
  }

  return user ? <Navigate to="/" /> : children;
};

export default RedirectIfAuthenticated;
