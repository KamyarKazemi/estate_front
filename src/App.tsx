import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./layout/Root";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
