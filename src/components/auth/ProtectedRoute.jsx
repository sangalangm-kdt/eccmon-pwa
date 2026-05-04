import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Preloader from "../constants/preloader/Preloader";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Preloader />; // Show Preloader only inside protected pages
  }

  return !user ? <Navigate to="/login" /> : <Outlet />;
};

export default ProtectedRoute;
