import { Route, Routes } from "react-router";
// import ClientCreate from "../pages/Clients/Create";
import AuthLayout from "../layout/AuthLayout/AuthLayout";
import DashboardLayout from "../layout/DashboardLayout/DashboardLayout";
import Login from "../pages/Auths/Login";
import CheckMail from "../pages/Auths/CheckMail";
import Otp from "../pages/Auths/Otp";
import ForgotPassword from "../pages/Auths/ForgotPassword";
import PrivateRoute from "./PrivateRoute";
import PropertiesListing from "../pages/Properties/Listing";
import CreateProperty from "../pages/Properties/Create";
import UpdateProperty from "../pages/Properties/Update";
import PropertyInquiryCreate from "../pages/Properties/InquiryCreate";
import PropertyInquiryUpdate from "../pages/Properties/InquiryUpdate";
import PropertiesInquiryListing from "../pages/Properties/InquiryListing";
import Dashboard from "../pages/Dashboard";
import InquiryListing from "../pages/Inquiry/Listing";
import EmployeesListing from "../pages/Employees/Listing";
// import EmployeeUpdate from "../pages/Employees/Update";
import ClientProfile from "../pages/ClientProfile/Listing";
import ReportListing from "../pages/Report/Listing";
import InquiryCreate from "../pages/Inquiry/Create";
import ReportCreate from "../pages/Report/Create";
import ReportUpdate from "../pages/Report/Update";
import ErrorPage from "../pages/ErrorPage";
import EmployeeUpdate from "../pages/Employees/Update";
import UpdateTab from "../pages/Inquiry/Update/UpdateTab";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="checkmail" element={<CheckMail />} />
        <Route path="otp" element={<Otp />} />
        <Route path="forgotpassword" element={<ForgotPassword />} />
        <Route path="reset_password" element={<ForgotPassword />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="dashboard">
            <Route
              element={<PrivateRoute allowedRoles={["admin", "manager"]} />}
            ></Route>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="inquiry">
            <Route
              element={<PrivateRoute allowedRoles={["admin", "manager"]} />}
            ></Route>
            <Route index element={<InquiryListing />} />
            <Route path="create" element={<InquiryCreate />} />
            <Route path=":inquiry_id" element={<UpdateTab />} />
          </Route>
          <Route path="properties">
            <Route index element={<PropertiesListing />} />
            <Route path="create" element={<CreateProperty />} />
            <Route path=":property_id" element={<UpdateProperty />} />
            <Route path="inquiry" element={<PropertiesInquiryListing />} />
            <Route path="inquiry_create" element={<PropertyInquiryCreate />} />
            <Route
              path="inquiry/:inquiry_id"
              element={<PropertyInquiryUpdate />}
            />
          </Route>
          <Route path="setting/employees">
            <Route
              element={<PrivateRoute allowedRoles={["admin", "manager"]} />}
            >
              {/* <Route path='create' element={<ClientCreate />} /> */}
            </Route>
            <Route index element={<EmployeesListing />} />
            {/* <Route path=':employee_id' element={<EmployeesListing />} /> */}
            <Route path=":employee_id" element={<EmployeeUpdate />} />
          </Route>
          <Route path="setting/client-profile">
            <Route
              element={<PrivateRoute allowedRoles={["admin", "manager"]} />}
            >
              {/* <Route path='create' element={<ClientCreate />} /> */}
            </Route>
            <Route index element={<ClientProfile />} />
          </Route>
          <Route path="reports">
            <Route
              element={<PrivateRoute allowedRoles={["admin", "manager"]} />}
            >
              <Route index element={<ReportListing />} />
              <Route path="create" element={<ReportCreate />} />
              <Route path="update" element={<ReportUpdate />} />
            </Route>
          </Route>
          <Route path="unauthorized" element={<ErrorPage type="401" />} />
        </Route>
      </Route>
      <Route path="*" element={<ErrorPage type="404" />} />
    </Routes>
  );
};

export default AppRouter;
