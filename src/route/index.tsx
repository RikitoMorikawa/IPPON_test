import { Route, Routes } from "react-router";
// import ClientCreate from "../pages/Clients/Create";
import AuthLayout from "../layout/AuthLayout/AuthLayout";
import DashboardLayout from "../layout/DashboardLayout/DashboardLayout";
import Login from "../pages/Auths/Login";
import CheckMail from "../pages/Auths/CheckMail";
import Otp from "../pages/Auths/Otp";
import ForgotPassword from "../pages/Auths/ForgotPassword";
import MembersListing from "../pages/Members/Listing";
import PrivateRoute from "./PrivateRoute";
import MemberUpdate from "../pages/Members/Update";
import Unauthorized from "../pages/Unauthorized";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path='login' element={<Login />} />
        <Route path='checkmail' element={<CheckMail />} />
        <Route path='otp' element={<Otp />} />
        <Route path='forgotpassword' element={<ForgotPassword />} />
        <Route path='reset_password' element={<ForgotPassword />} />
      </Route>

      <Route element={<PrivateRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path='members'>
          <Route element={<PrivateRoute allowedRoles={['admin', 'manager']} />}>
            {/* <Route path='create' element={<ClientCreate />} /> */}
          </Route>
          <Route index element={<MembersListing />} />
          <Route path=':member_id' element={<MemberUpdate />} />
          <Route path='profile' element={<MemberUpdate />} />
        </Route>
        <Route path='unauthorized' element={<Unauthorized />} />
      </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
