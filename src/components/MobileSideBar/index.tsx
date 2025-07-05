import { useLocation, useNavigate } from "react-router";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import Cookies from "js-cookie";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  Drawer,
  Stack,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout, setRedirectPath } from "../../store/authSlice";
import { AppDispatch } from "../../store";

const styled = {
  mobileDrawer: {
    "& .MuiDrawer-paper": {
      width: "179px",
      backgroundColor: "#FFFFFF",
      boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
    },
  },
  mobileHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 8px",
  },
  mobileListItem: {
    margin: "6px 12px",
    padding: "8px",
    borderRadius: "12px",
    backgroundColor: "transparent",
    minHeight: "auto",
    "& > .MuiListItemIcon-root, & > .MuiListItemText-root span": {
      color: "#354053",
      fontSize: "12px",
      fontWeight: "500",
    },
    "&:hover": {
      backgroundColor: "#DBF8FF",
      "& > .MuiListItemIcon-root, & > .MuiListItemText-root span": {
        color: "#0e9dbc",
      },
      "& .MuiSvgIcon-root": {
        color: "#0e9dbc",
      },
    },
  },
  mobileListItemActive: {
    backgroundColor: "#DBF8FF",
    borderRadius: "12px",
    margin: "6px 12px",
    padding: "8px",
    minHeight: "auto",
    "& > .MuiListItemIcon-root, & > .MuiListItemText-root span": {
      color: "#0e9dbc",
      fontSize: "12px",
      fontWeight: "600",
    },
    "&:hover": {
      backgroundColor: "#DBF8FF",
    },
  },
  mobileDropdownMenu: {
    margin: "0 12px",
    padding: 0,
    backgroundColor: "transparent",
    borderRadius: "0 0 12px 12px",
    position: "relative" as const,
    paddingLeft: "12px",
    "&::before": {
      content: '""',
      position: "absolute",
      left: "20px",
      top: "0",
      bottom: "0",
      width: "2px",
      backgroundColor: "#e8f4f8",
    },
  },
  mobileDropdownMenuItem: {
    padding: "6px 12px",
    backgroundColor: "transparent",
    "& .MuiListItemText-root span": {
      color: "#354053",
      fontSize: "10px !important",
      lineHeight: "1.2",
    },
    "&:hover": {
      backgroundColor: "#F5F5F5",
    },
  },
  mobileDropdownMenuItemActive: {
    padding: "8px 12px",
    backgroundColor: "#DBF8FF",
    borderRadius: "8px",
    margin: "2px 4px",
    "& .MuiListItemText-root span": {
      color: "#0e9dbc",
      fontSize: "10px",
      fontWeight: "600",
      lineHeight: "1.2",
    },
    "&:hover": {
      backgroundColor: "#DBF8FF",
    },
  },
  closeButton: {
    color: "#666",
    padding: "8px",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      color: "#0e9dbc",
    },
  },
};

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const MobileSidebar = ({ open, onClose }: MobileSidebarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const clientName = Cookies.get("clientName");

  // Menu structure with dropdowns
  const sidebarMenus = [
    {
      id: "inquiry",
      label: "ダッシュボード",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
        >
          <path
            fill="currentColor"
            d="M24 21h2v5h-2zm-4-5h2v10h-2zm-9 10a5.006 5.006 0 0 1-5-5h2a3 3 0 1 0 3-3v-2a5 5 0 0 1 0 10"
          />
          <path
            fill="currentColor"
            d="M28 2H4a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h24a2.003 2.003 0 0 0 2-2V4a2 2 0 0 0-2-2m0 9H14V4h14ZM12 4v7H4V4ZM4 28V13h24l.002 15Z"
          />
        </svg>
      ),
      subItems: [
        { to: "/dashboard", label: "問い合わせ一覧" },
        { to: "/inquiry", label: "顧客一覧" },
        { to: "/inquiry/create", label: "新規登録" },
      ],
      hasDropdown: true,
    },
    {
      id: "property",
      label: "物件検索",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 11.3333H5.33333C5.33333 11.5101 5.40357 11.6797 5.5286 11.8047C5.65362 11.9298 5.82319 12 6 12V11.3333ZM11.3333 11.3333V12C11.5101 12 11.6797 11.9298 11.8047 11.8047C11.9298 11.6797 12 11.5101 12 11.3333H11.3333ZM11.3333 8H12C12.0002 7.91239 11.983 7.82561 11.9496 7.74463C11.9162 7.66364 11.8672 7.59002 11.8053 7.528L11.3333 8ZM8.66667 5.33333L9.13867 4.86133C9.07674 4.79925 9.00317 4.74999 8.92218 4.71638C8.84118 4.68277 8.75436 4.66547 8.66667 4.66547C8.57898 4.66547 8.49215 4.68277 8.41115 4.71638C8.33016 4.74999 8.25659 4.79925 8.19467 4.86133L8.66667 5.33333ZM6 8L5.528 7.528C5.46613 7.59002 5.41709 7.66364 5.38369 7.74463C5.35029 7.82561 5.33318 7.91239 5.33333 8H6ZM19.8053 18.8613L14.472 13.528L13.528 14.472L18.8613 19.8053L19.8053 18.8613ZM8.66667 16C6.72175 16 4.85648 15.2274 3.48122 13.8521C2.10595 12.4768 1.33333 10.6116 1.33333 8.66667H0C0 10.9652 0.913093 13.1696 2.53841 14.7949C4.16372 16.4202 6.36812 17.3333 8.66667 17.3333V16ZM16 8.66667C16 10.6116 15.2274 12.4768 13.8521 13.8521C12.4768 15.2274 10.6116 16 8.66667 16V17.3333C10.9652 17.3333 13.1696 16.4202 14.7949 14.7949C16.4202 13.1696 17.3333 10.9652 17.3333 8.66667H16ZM8.66667 1.33333C10.6116 1.33333 12.4768 2.10595 13.8521 3.48122C15.2274 4.85648 16 6.72175 16 8.66667H17.3333C17.3333 6.36812 16.4202 4.16372 14.7949 2.53841C13.1696 0.913093 10.9652 0 8.66667 0V1.33333ZM8.66667 0C6.36812 0 4.16372 0.913093 2.53841 2.53841C0.913093 4.16372 0 6.36812 0 8.66667H1.33333C1.33333 6.72175 2.10595 4.85648 3.48122 3.48122C4.85648 2.10595 6.72175 1.33333 8.66667 1.33333V0ZM6 12H11.3333V10.6667H6V12ZM12 11.3333V8H10.6667V11.3333H12ZM11.8053 7.528L9.13867 4.86133L8.19467 5.80533L10.8613 8.472L11.8053 7.528ZM8.19467 4.86133L5.528 7.528L6.472 8.472L9.13867 5.80533L8.19467 4.86133ZM5.33333 8V11.3333H6.66667V8H5.33333Z"
            fill="currentColor"
          />
        </svg>
      ),
      subItems: [{ to: "/properties", label: "物件一覧" }],
      hasDropdown: true,
    },
    {
      id: "account",
      label: "管理",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
        >
          <path
            fill="currentColor"
            d="M27 16.76v-1.53l1.92-1.68A2 2 0 0 0 29.3 11l-2.36-4a2 2 0 0 0-1.73-1a2 2 0 0 0-.64.1l-2.43.82a11 11 0 0 0-1.31-.75l-.51-2.52a2 2 0 0 0-2-1.61h-4.68a2 2 0 0 0-2 1.61l-.51 2.52a11.5 11.5 0 0 0-1.32.75l-2.38-.86A2 2 0 0 0 6.79 6a2 2 0 0 0-1.73 1L2.7 11a2 2 0 0 0 .41 2.51L5 15.24v1.53l-1.89 1.68A2 2 0 0 0 2.7 21l2.36 4a2 2 0 0 0 1.73 1a2 2 0 0 0 .64-.1l2.43-.82a11 11 0 0 0 1.31.75l.51 2.52a2 2 0 0 0 2 1.61h4.72a2 2 0 0 0 2-1.61l.51-2.52a11.5 11.5 0 0 0 1.32-.75l2.42.82a2 2 0 0 0 .64.1a2 2 0 0 0 1.73-1l2.28-4a2 2 0 0 0-.41-2.51ZM25.21 24l-3.43-1.16a8.9 8.9 0 0 1-2.71 1.57L18.36 28h-4.72l-.71-3.55a9.4 9.4 0 0 1-2.7-1.57L6.79 24l-2.36-4l2.72-2.4a8.9 8.9 0 0 1 0-3.13L4.43 12l2.36-4l3.43 1.16a8.9 8.9 0 0 1 2.71-1.57L13.64 4h4.72l.71 3.55a9.4 9.4 0 0 1 2.7 1.57L25.21 8l2.36 4l-2.72 2.4a8.9 8.9 0 0 1 0 3.13L27.57 20Z"
          />
          <path
            fill="currentColor"
            d="M16 22a6 6 0 1 1 6-6a5.94 5.94 0 0 1-6 6m0-10a3.91 3.91 0 0 0-4 4a3.91 3.91 0 0 0 4 4a3.91 3.91 0 0 0 4-4a3.91 3.91 0 0 0-4-4"
          />
        </svg>
      ),
      subItems: [
        { to: "/setting/employees", label: "アカウント設定" },
        { to: "/setting/client-profile", label: "会社情報" },
      ],
      hasDropdown: true,
    },
    {
      id: "logout",
      label: "ログアウト",
      icon: <LogoutIcon />,
      subItems: [],
      hasDropdown: false,
      action: "logout", // Special action identifier
    },
  ];

  // Close sidebar on route change
  useEffect(() => {
    if (open) {
      onClose();
    }
  }, [location.pathname]);

  // Handle logout action
  const handleLogout = () => {
    // Save current location before logout
    dispatch(setRedirectPath(location.pathname + location.search));
    // Dispatch logout action to clear all auth state and cookies
    dispatch(logout());
    navigate("/login");
    onClose();
  };

  // Toggle dropdown open/closed
  const handleDropdownToggle = (dropdownId: string) => {
    const selectedMenu = sidebarMenus.find((menu) => menu.id === dropdownId);

    // Handle logout action
    if (selectedMenu?.action === "logout") {
      handleLogout();
      return;
    }

    // Handle dropdown menus
    if (!selectedMenu?.hasDropdown) return;

    const isCurrentlyOpen =
      openDropdown === dropdownId ||
      (selectedMenu && isDropdownActive(selectedMenu.subItems));

    if (isCurrentlyOpen) {
      if (openDropdown === dropdownId) {
        setOpenDropdown(null);
      }
    } else {
      setOpenDropdown(dropdownId);
      const firstLink = selectedMenu.subItems?.[0]?.to;
      if (firstLink) {
        navigate(firstLink);
      }
    }
  };

  // Check if current path is in a dropdown's subitems
  const isDropdownActive = (dropdownItems: { to: string }[]) => {
    return dropdownItems.some(
      (item) =>
        location.pathname === item.to ||
        location.pathname.startsWith(`${item.to}/`) ||
        location.pathname.match(new RegExp(`^${item.to}/[^/]+$`))
    );
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={styled.mobileDrawer}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
    >
      <Box sx={{ height: "100%", overflow: "auto", mt: 1 }}>
        {/* Header with logo and close button */}
        <Box
          sx={{
            ...styled.mobileHeader,
            justifyContent: "center", // Override the space-between
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            sx={{ cursor: "pointer", minWidth: "91px" }}
          >
            {/* <IconButton sx={{ p: 0, mr: 0.6 }}>
            <Avatar
                alt='Remy Sharp'
                src={profileImg}
                sx={{ width: 25, height: 25 }}
            />
            </IconButton> */}
            <Box>
              <Typography
                variant="body2"
                component="h5"
                fontSize={12}
                fontWeight={"bold"}
                sx={{
                  ml: 1,
                  color: "#6E778A",
                }}
              >
                株式会社StartGear
              </Typography>
              <Typography
                variant="body2"
                component="h5"
                fontSize={12}
                fontWeight={"bold"}
                sx={{
                  ml: 1,
                  mt: 0.5,
                  color: "#6E778A",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <SettingsIcon sx={{ fontSize: 20, color: "#3E3E3E" }} />
                <span
                  style={{
                    borderBottom: "0.6px solid #6E778A",
                    display: "inline-block",
                  }}
                >
                  {clientName}
                </span>
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Menu Items */}
        <Box sx={{ paddingTop: 1 }}>
          {sidebarMenus.map((menu) => (
            <div key={menu.id}>
              <ListItemButton
                disableRipple
                onClick={() => handleDropdownToggle(menu.id)}
                sx={{
                  ...(menu.hasDropdown && isDropdownActive(menu.subItems)
                    ? styled.mobileListItemActive
                    : styled.mobileListItem),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "20px",
                    paddingY: "4px",
                    paddingX: "4px",
                    color:
                      menu.hasDropdown && isDropdownActive(menu.subItems)
                        ? "#0e9dbc"
                        : "#354053",
                    "& svg": {
                      width: "14px",
                      height: "14px",
                    },
                  }}
                >
                  {menu.icon}
                </ListItemIcon>
                <ListItemText
                  primary={menu.label}
                  sx={{
                    margin: 0,
                    "& .MuiListItemText-primary": {
                      fontWeight:
                        menu.hasDropdown && isDropdownActive(menu.subItems)
                          ? 600
                          : 500,
                      fontSize: "11px",
                      lineHeight: 1.2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                />
                {menu.hasDropdown && (
                  <>
                    {openDropdown === menu.id ||
                    isDropdownActive(menu.subItems) ? (
                      <KeyboardArrowUp
                        sx={{
                          color: isDropdownActive(menu.subItems)
                            ? "#0e9dbc"
                            : "#354053",
                          fontSize: "16px",
                          marginLeft: "auto",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <KeyboardArrowDown
                        sx={{
                          color: isDropdownActive(menu.subItems)
                            ? "#0e9dbc"
                            : "#354053",
                          fontSize: "16px",
                          marginLeft: "auto",
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </>
                )}
              </ListItemButton>

              {menu.hasDropdown && (
                <Collapse
                  in={
                    openDropdown === menu.id || isDropdownActive(menu.subItems)
                  }
                  timeout="auto"
                  unmountOnExit
                >
                  <List
                    component="div"
                    disablePadding
                    sx={styled.mobileDropdownMenu}
                  >
                    {menu.subItems.map((item) => (
                      <ListItemButton
                        key={item.to}
                        disableRipple
                        onClick={() => handleMenuItemClick(item.to)}
                        sx={{
                          ...(location.pathname === item.to
                            ? styled.mobileDropdownMenuItemActive
                            : styled.mobileDropdownMenuItem),
                          backgroundColor:
                            location.pathname === item.to
                              ? "#DBF8FF"
                              : "transparent",
                          borderRadius: 2,
                          ml: 2,
                          mt: 0.3,
                        }}
                      >
                        <ListItemText
                          primary={item.label}
                          sx={{
                            "& .MuiListItemText-primary": {
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            },
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </div>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};

export default MobileSidebar;
