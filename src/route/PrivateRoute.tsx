import { Navigate, Outlet, useLocation } from "react-router";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { setRedirectPath } from "../store/authSlice";
import { AppDispatch } from "../store";

const PrivateRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const isAuthenticated = !!Cookies.get("token");
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const userRole = Cookies.get("role") || "";

  if (!userRole && !isAuthenticated) {
    // 一時的に
    dispatch(setRedirectPath(location.pathname + location.search));
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  if (!isAuthenticated) {
    // Save current location for redirect after login
    dispatch(setRedirectPath(location.pathname + location.search));
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
