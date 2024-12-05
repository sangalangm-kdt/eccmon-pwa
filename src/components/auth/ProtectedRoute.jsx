import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = () => {
  const { user } = useAuth();

  return !user ? <Navigate to="/login" /> : <Outlet />;
};

export default ProtectedRoute;
