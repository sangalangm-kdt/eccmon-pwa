import React, { Suspense, lazy, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import NotFoundPage from "./components/pages/NotFoundPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NavBar from "./components/pages/_tabs/NavBar";
import { AuthProvider } from "./components/auth/AuthContext";
import RedirectIfAuthenticated from "./components/auth/redirectIfAuthenticated";
import ScannedResult from "./components/pages/_tabs/qrscanner/ScannedResult";
import Preloader from "./components/constants/preloader/Preloader";
import Dismounting from "./components/pages/_tabs/qrscanner/status/Dismounting";

const QRScanner = lazy(
  () => import("./components/pages/_tabs/qrscanner/QRScanner"),
);
const Login = lazy(() => import("./components/pages/Login"));
const ProfilePage = lazy(
  () => import("./components/pages/_tabs/profile/ProfilePage"),
);
const Home = lazy(() => import("./components/pages/_tabs/home/Home"));
const ForgotPass = lazy(() => import("./components/pages/ForgotPass"));

const Layout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: "/login",
          element: (
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          ),
        },
        {
          element: <ProtectedRoute />,
          children: [
            { path: "/", element: <Home /> },
            { path: "/qrscanner", element: <QRScanner /> },
            { path: "/scanned-result", element: <ScannedResult /> },
            { path: "/profile", element: <ProfilePage /> },
          ],
        },
        {
          path: "/forgotpass",
          element: <ForgotPass />,
        },
        {
          path: "/engine-info",
          element: <Dismounting />,
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
  ]);

  return (
    <div className="App">
      <AuthProvider>
        <Suspense fallback={<Preloader />}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </div>
  );
}

export default App;
