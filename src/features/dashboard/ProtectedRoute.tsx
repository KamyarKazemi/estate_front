import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

function ProtectedRoute() {
  const location = useLocation();
  const accessToken = useSelector((state: RootState) => state.auth.access_token);

  if (!accessToken) {
    return <Navigate to="/profile" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
