import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import NotFoundPage from "./components/pages/NotFoundPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NavBar from "./components/pages/_tabs/NavBar";
import { AuthProvider } from "./components/auth/AuthContext";
import RedirectIfAuthenticated from "./components/auth/redirectIfAuthenticated";
import ScannedResult from "./components/pages/_tabs/qrscanner/ScannedResult";
import Preloader from "./components/constants/preloader/Preloader";
// import Dismounting from "./components/pages/_tabs/qrscanner/status/Dismounting";
import ViewInfo from "./components/pages/_tabs/qrscanner/view/ViewInfo";
// import AddedOrUpdateSuccessfully from "./components/constants/addedOrUpdateSuccessfully";
// import DismountedModal from "./components/constants/CycleModal";
import { HistoryProvider } from "./components/utils/HistoryContext";

const QRScanner = lazy(
  () => import("./components/pages/_tabs/qrscanner/QRScanner"),
);
const Login = lazy(() => import("./components/pages/Login"));
const ProfilePage = lazy(
  () => import("./components/pages/_tabs/profile/ProfilePage"),
);
const Home = lazy(() => import("./components/pages/_tabs/home/Home"));
const ForgotPass = lazy(
  () => import("./components/pages/forgotPass/PasswordReset"),
);
const ResetPassword = lazy(
  () => import("./components/pages/forgotPass/ResetPassword"),
);

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
            {
              path: "/view-info",
              element: <ViewInfo />,
            },
          ],
        },
        {
          path: "/password-reset",
          element: <ForgotPass />,
        },
        {
          path: `/password-reset/:token`,
          element: <ResetPassword />,
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
        <HistoryProvider>
          <Suspense fallback={<Preloader />}>
            <RouterProvider router={router} />
          </Suspense>
        </HistoryProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
