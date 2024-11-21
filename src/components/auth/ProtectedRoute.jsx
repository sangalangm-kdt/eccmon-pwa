// src/components/auth/ProtectedRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuthentication } from "../../hooks/auth";

const ProtectedRoute = () => {
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // console.log(isAuthenticated);

  const { user } = useAuthentication({middleware: "auth"});

  if (!user) {
    return <div>Loading...</div>;
  }

  return !user ? <Navigate to="/login" /> : <Outlet />;
};

export default ProtectedRoute;
