import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./layout/Root";
import Home from "./components/layout/main/Home";
import Profile from "./components/layout/Profile/Profile";
import Dashboard from "./components/layout/dashboard/Dashboard";
import ProtectedRoute from "./components/layout/dashboard/ProtectedRoute";
import ResetPassword from "./components/layout/dashboard/ResetPassword";
import ChangePhone from "./components/layout/dashboard/ChangePhone";

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
        element: <Profile />,
        path: "/profile",
      },
      {
        element: <ResetPassword />,
        path: "/reset-password",
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Dashboard />,
            path: "/dashboard",
          },
          {
            element: <ChangePhone />,
            path: "/change-phone",
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
