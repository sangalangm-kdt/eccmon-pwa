import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthentication } from "../../hooks/auth";
import Preloader from "../constants/preloader/Preloader";

const ProtectedRoute = () => {
  const { user, loading } = useAuthentication({ middleware: "auth" });

  if (loading) {
    return <Preloader />;
  }

  return !user ? <Navigate to="/login" /> : <Outlet />;
};

export default ProtectedRoute;
