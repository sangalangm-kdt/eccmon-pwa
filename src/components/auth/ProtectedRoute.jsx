// src/components/auth/ProtectedRoute.js
import React from "react";
import { Navigate, Outlet, useNavigate, useNavigation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuthentication } from "../../hooks/auth";

const ProtectedRoute = () => {
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // console.log(isAuthenticated);
  const navigate = useNavigate();

  // const { user } = useAuthentication({ middleware: "auth" });
  const user = {
    email: "ice@ice.com",
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return !user ? navigate("/login") : <Outlet />;
};

export default ProtectedRoute;
