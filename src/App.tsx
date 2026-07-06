import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./layout/Root";
import Home from "./pages/Home";
import AuthPage from "./features/auth/AuthPage";
import Dashboard from "./features/dashboard/Dashboard";
import ProtectedRoute from "./features/dashboard/ProtectedRoute";
import ResetPassword from "./features/reset-password/ResetPassword";
import ChangePhone from "./features/change-phone/ChangePhone";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/profile",
        element: <AuthPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/change-phone",
            element: <ChangePhone />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
