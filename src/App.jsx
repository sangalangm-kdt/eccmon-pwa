import React, { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";
import NotFoundPage from "./components/pages/auth/NotFoundPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NavBar from "./components/pages/_tabs/NavBar";
import { AuthProvider } from "./components/auth/AuthContext";
import RedirectIfAuthenticated from "./components/auth/redirectIfAuthenticated";
// import ScannedResult from "./components/pages/_tabs/qrscanner/ScannedResult";
import Preloader from "./components/constants/preloader/Preloader";
import ViewInfo from "./components/pages/_tabs/qrscanner/view/ViewInfo";
import { HistoryProvider } from "./components/utils/HistoryContext";

const QRScanner = lazy(
  () => import("./components/pages/_tabs/qrscanner/QRScanner"),
);
const Login = lazy(() => import("./components/pages/auth/Login"));
const Register = lazy(() => import("./components/pages/auth/Register"));
const ProfilePage = lazy(
  () => import("./components/pages/_tabs/profile/ProfilePage"),
);
const UserGuidelines = lazy(
  () => import("./components/pages/_tabs/profile/UserGuidelines"),
);
const ReportBugs = lazy(
  () => import("./components/pages/_tabs/profile/ReportBugs"),
);
const Home = lazy(() => import("./components/pages/_tabs/home/Home"));
const ScannedResult = lazy(
  () => import("./components/pages/_tabs/qrscanner/ScannedResult"),
);
const ForgotPass = lazy(() => import("./components/pages/auth/PasswordReset"));
const ResetPassword = lazy(
  () => import("./components/pages/auth/ResetPassword"),
);
const UpdateInfo = lazy(
  () => import("./components/pages/_tabs/profile/UpdateInfo"),
);
const ChangePass = lazy(
  () => import("./components/pages/_tabs/profile/ChangePass"),
);
const Faq = lazy(() => import("./components/pages/_tabs/profile/Faq"));
const Layout = () => {
  const location = useLocation();
  const hideNavBarPaths = [
    "/update-info",
    "/change-password",
    "/view-info",
    "/user-guidelines",
    "/faq",
    "/report-bugs",
  ];
  const shouldHideNavBar = hideNavBarPaths.includes(location.pathname);
  return (
    <>
      {!shouldHideNavBar && <NavBar />}
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
            {
              path: "/report-bugs",
              element: <ReportBugs />,
            },
            { path: "/update-info", element: <UpdateInfo /> },
            { path: "/change-password", element: <ChangePass /> },
          ],
        },
        {
          path: "/request-account",
          element: <Register />,
        },
        {
          path: "user-guidelines",
          element: <UserGuidelines />,
        },
        {
          path: "FAQ",
          element: <Faq />,
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
