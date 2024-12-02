// src/components/auth/ProtectedRoute.js
import React, { Suspense } from "react";
import { Navigate, Outlet, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuthentication } from "../../hooks/auth";
import Preloader from "../constants/preloader/Preloader";

const ProtectedRoute = () => {
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // console.log(isAuthenticated);
  const navigate = useNavigate();

  const { user } = useAuthentication({ middleware: "auth" });
  // const user = {
  //   email: "ice@ice.com",
  // };

  if (!user) {
    return (
      <Suspense fallback={<Preloader/>}>
        <Link to="/login"/>
      </Suspense>
    );
  }

  return !user ? <Link to="/login"/>: <Outlet />;
};

export default ProtectedRoute;
