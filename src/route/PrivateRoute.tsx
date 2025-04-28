import { Navigate, Outlet } from "react-router";
import Cookies from 'js-cookie';
  
const PrivateRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const isAuthenticated = !!Cookies.get("token");

  const userRole = Cookies.get('role') || '';
  if (!userRole&&!isAuthenticated) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
 
export default PrivateRoute;