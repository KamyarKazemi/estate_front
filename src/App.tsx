import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./layout/Root";
import Home from "./components/layout/main/Home";
import Profile from "./components/layout/Profile/Profile";

function App() {
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
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
