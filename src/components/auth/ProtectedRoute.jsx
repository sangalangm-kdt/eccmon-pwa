// src/components/auth/ProtectedRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  console.log(isAuthenticated);

  if (!isAuthenticated === undefined) {
    return <div>Loading...</div>;
  }

  return isAuthenticated === false ? <Navigate to="/login" /> : <Outlet />;
};

export default ProtectedRoute;
