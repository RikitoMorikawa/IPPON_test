import { Navigate, Outlet, useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { setRedirectPath } from "../store/authSlice";
import { AppDispatch } from "../store";
import { isAuthenticated, getRole } from "../utils/authUtils";

const PrivateRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const authenticated = isAuthenticated();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const userRole = getRole() || "";

  if (!userRole && !authenticated) {
    // 一時的に
    dispatch(setRedirectPath(location.pathname + location.search));
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  if (!authenticated) {
    // Save current location for redirect after login
    dispatch(setRedirectPath(location.pathname + location.search));
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
