import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthentication } from "../../hooks/auth";
import Preloader from "../constants/preloader/Preloader";

const ProtectedRoute = () => {
  const { user, loading } = useAuthentication({ middleware: "auth" });

  if (loading) {
    // Display a preloader while the authentication state is being checked
    return <Preloader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // If authenticated, render the child route
};

export default ProtectedRoute;
