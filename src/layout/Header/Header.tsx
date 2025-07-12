import {
  Typography,
  Box,
  Stack,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import DynamicBreadcrumb from "./DynamicBreadCrumb";
import profileImg from "../../assets/profile_img.png";
import { useSelector, useDispatch } from "react-redux";
import { logoutAPI, setRedirectPath } from "../../store/authSlice";
import { AppDispatch } from "../../store";
import { getEmployeeID, getFullName } from "../../utils/authUtils";

// const member_id = getEmployeeID()

const Header = () => {
  const settings = [
    // {
    //   title: "Profile",
    //   link: `/dashboard`,
    // },
    // {
    //   title: "Account",
    //   link: "/dashboard",
    // },
    {
      title: "プロフィール",
      link: `/setting/employees/` + getEmployeeID(),
    },
    {
      title: "ログアウト",
      action: "logout",
    },
  ];

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { data: propertiesData } = useSelector(
    (state: any) => state.properties.detailed
  );
  const { data: inquiryData } = useSelector(
    (state: any) => state.inquiry.detailed
  );
  const { data: propertiesInquiriesData } = useSelector(
    (state: any) => state.propertiesInquiries.detailed
  );
  const { data: employeeData } = useSelector(
    (state: any) => state.employees.detailed
  );
  const clientName = getFullName();
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClickMenuItem = async (setting: any) => {
    if (setting.action === "logout") {
      // Save current location before logout
      dispatch(setRedirectPath(location.pathname + location.search));
      // Dispatch logout API action to clear all auth state and cookies
      await dispatch(logoutAPI());
      navigate("/login");
    } else if (setting.link) {
      navigate(setting.link);
    }
    handleCloseUserMenu();
  };

  return (
    <>
      <Box
        height={50}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <DynamicBreadcrumb
          propName={propertiesData?.name || ""}
          customerName={(() => {
            // inquiry.detailedから顧客名を取得
            const inquiryCustomerName =
              inquiryData.inquiry?.customer?.first_name &&
              inquiryData.inquiry?.customer?.last_name
                ? `${inquiryData.inquiry.customer.last_name.trim()} ${inquiryData.inquiry.customer.first_name.trim()}`
                : "";

            // propertiesInquiries.detailedから顧客名を取得
            const propertiesInquiryCustomerName =
              propertiesInquiriesData &&
              Array.isArray(propertiesInquiriesData.items) &&
              propertiesInquiriesData.items.length > 0 &&
              propertiesInquiriesData.items[0].inquiry?.customer?.first_name &&
              propertiesInquiriesData.items[0].inquiry?.customer?.last_name
                ? `${propertiesInquiriesData.items[0].inquiry.customer.last_name.trim()} ${propertiesInquiriesData.items[0].inquiry.customer.first_name.trim()}`
                : "";

            // どちらかが存在すれば返す（inquiry.detailedを優先）
            return inquiryCustomerName || propertiesInquiryCustomerName || "";
          })()}
          employeeName={(() => {
            // employee.detailedから従業員名を取得
            if (employeeData?.last_name && employeeData?.first_name) {
              return `${employeeData.last_name.trim()} ${employeeData.first_name.trim()}`;
            }
            return "";
          })()}
        />
        {/* <IconButton 
        sx={{ 
          p: 0.6, 
          mr: 2, 
          borderRadius: 2, 
          backgroundColor: 'transparent',
          border: '1px solid #e0e0e0',
          '&:hover': {
            backgroundColor: '#f5f5f5'
          }
        }}
      >
        <NotificationsOutlined fontSize="small" sx={{color: 'grey'}} />
      </IconButton> */}
        <Box
          sx={{
            flexGrow: 0,
            width: "50%",
            display: { lg: "block", xs: "none" },
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            width={"100%"}
            justifyContent={"flex-end"}
          >
            <Tooltip title="Open profile">
              <Stack
                direction={"row"}
                alignItems={"center"}
                onClick={handleOpenUserMenu}
                sx={{ cursor: "pointer", minWidth: "91px" }}
              >
                <IconButton
                  sx={{ p: 0.5, mr: 0.6, border: "1px solid #e0e0e0" }}
                >
                                  <Avatar
                  alt={clientName || ''}
                  src={profileImg}
                  sx={{ width: 25, height: 25 }}
                />
                </IconButton>
                <Typography
                  variant="body2"
                  component="h5"
                  fontSize={14}
                  fontWeight={"bold"}
                  sx={{
                    color: "#6E778A",
                    borderBottom: "0.6px solid #6E778A",
                    display: "inline-block",
                  }}
                >
                  {clientName}
                </Typography>
              </Stack>
            </Tooltip>
          </Stack>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting, index) => (
              <MenuItem
                key={index}
                onClick={() => handleClickMenuItem(setting)}
              >
                <Typography sx={{ textAlign: "center" }}>
                  {setting.title}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
    </>
  );
};

export default Header;
