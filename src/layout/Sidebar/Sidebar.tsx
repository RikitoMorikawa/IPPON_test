import { Link, useLocation, useNavigate } from "react-router";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  Tooltip,
} from "@mui/material";
import { useState, useEffect } from "react";
import ipponLogo from "../../assets/ippon_trading_logo.png";
import ipponLogoSp from "../../assets/ippon_trading_logo_sp_xs.png";

const styled = {
  linkItem: {
    textDecoration: "none",
  },
  container: (sidebarOpen: boolean, isHoveringToggle: boolean) => ({
    bgcolor: "#FFFFFF",
    height: "100%",
    position: "fixed",
    width: sidebarOpen ? "210px" : "60px",
    borderRight: isHoveringToggle
      ? "1px solid #0E9DBC"
      : "1px solid transparent",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    transition: "border-right 0.2s, box-shadow 0.2s",
  }),
  toggleButton: (isHoveringToggle: boolean) => ({
    position: "absolute",
    top: 43,
    right: "-15px",
    width: 30,
    height: 30,
    background: "white",
    border: isHoveringToggle ? "1px solid #fff" : "1px solid #0E9DBC",
    color: "#fff",
    opacity: isHoveringToggle ? 1 : 0,
    borderRadius: "50%",
    boxShadow: isHoveringToggle ? "0 0 0 1px #0E9DBC" : "none",
    transition: "all 0.2s",
    zIndex: 1000,
  }),
  listItem: {
    margin: "5px 15px",
    padding: 0,
    borderRadius: "8px",
    backgroundColor: "transparent",
    "& > .MuiListItemIcon-root, & > .MuiListItemText-root span": {
      color: "#354053",
      fontSize: "14px",
      fontWeight: "bold",
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
  listItemSp: {
    borderRadius: "8px",
    margin: "5px 7px",
    // margin: "10px 0 10px -1px",
    padding: 0,
    width: "36px",
    height: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    "& > .MuiListItemIcon-root, & > .MuiListItemText-root span": {
      color: "#354053",
      fontSize: "14px",
      fontWeight: "bold",
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
  listItemActive: {
    backgroundColor: "transparent", // Changed from "#DBF8FF" to "transparent"
    borderRadius: "8px",
    margin: "5px 15px",
    padding: 0,
    "& > .MuiListItemIcon-root, & > .MuiListItemText-root span": {
      color: "#0e9dbc",
      fontSize: "14px",
      fontWeight: "bold",
    },
    "&:hover": {
      backgroundColor: "#DBF8FF",
    },
  },
  listItemActiveSp: {
    backgroundColor: "#DBF8FF", // Changed from "transparent" to show active state
    borderRadius: "8px",
    margin: "5px 7px",
    padding: 0,
    width: "36px",
    height: "36px",
    display: "flex",
    justifyContent: "center",
    "& > .MuiListItemIcon-root, & > .MuiListItemText-root span": {
      color: "#0e9dbc",
      fontSize: "14px",
      fontWeight: "bold",
    },
    "&:hover": {
      backgroundColor: "#DBF8FF",
    },
  },
  dropdownMenu: {
    margin: "0 15px",
    padding: 0,
    backgroundColor: "transparent",
    borderRadius: "0 0 8px 8px",
    position: "relative",
    paddingLeft: "20px",
    "&::before": {
      content: '""',
      position: "absolute",
      left: "30px",
      top: "0",
      bottom: "0",
      width: "1px",
      backgroundColor: "#e0e0e0",
    },
  },
  dropdownMenuItem: {
    padding: "6px 16px",
    backgroundColor: "transparent",
    "& .MuiListItemText-root span": {
      color: "#354053",
      fontSize: "13px",
    },
    "&:hover": {
      backgroundColor: "#F5F5F5",
    },
  },
  dropdownMenuItemActive: {
    padding: "6px 16px",
    backgroundColor: "#DBF8FF",
    "& .MuiListItemText-root span": {
      color: "#0e9dbc",
      fontSize: "13px",
      fontWeight: "bold",
      // backgroundColor: "#DBF8FF",
    },
    "&:hover": {
      backgroundColor: "#DBF8FF",
    },
  },
};

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const currentPath = useLocation().pathname;
  const navigate = useNavigate();
  const [isHoveringToggle, setIsHoveringToggle] = useState(false);

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
    },
    {
      id: "property",
      label: "物件情報",
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
      subItems: [
        { to: "/properties", label: "物件一覧" },
        { to: "/properties/create", label: "新規登録" },
        // { to: "/properties/inquiry_create", label: "顧客詳細" },
      ],
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
        // { to: "/setting/urls", label: "顧客向けURL" },
        // { to: "/setting/line_setting", label: "LINE連携設定" },
        { to: "/setting/employees", label: "アカウント設定" },
        { to: "/setting/client-profile", label: "会社情報" },
        // { to: "/members", label: "members" },
      ],
    },
  ];

  // Function to check if dropdown is active based on current path
  const isDropdownActive = (dropdownItems: { to: string }[]) => {
    return dropdownItems.some(
      (item) =>
        currentPath === item.to ||
        currentPath.startsWith(`${item.to}/`) ||
        currentPath.match(new RegExp(`^${item.to}/[^/]+$`))
    );
  };

  // Function to get initially active dropdowns based on current path
  const getInitialActiveDropdowns = () => {
    const activeDropdowns: string[] = [];
    sidebarMenus.forEach((menu) => {
      if (isDropdownActive(menu.subItems)) {
        activeDropdowns.push(menu.id);
      }
    });
    return activeDropdowns;
  };

  const [openDropdowns, setOpenDropdowns] = useState<string[]>(
    getInitialActiveDropdowns()
  );

  // Update open dropdowns when current path changes
  useEffect(() => {
    const activeDropdowns = getInitialActiveDropdowns();
    setOpenDropdowns((prevOpenDropdowns) => {
      // Merge existing manually opened dropdowns with active ones
      const newDropdowns = [
        ...new Set([...prevOpenDropdowns, ...activeDropdowns]),
      ];
      return newDropdowns;
    });
  }, [currentPath]);

  const handleDropdownToggle = (dropdownId: string) => {
    const selectedMenu = sidebarMenus.find((menu) => menu.id === dropdownId);

    if (!selectedMenu) return;

    const firstItemPath = selectedMenu.subItems[0]?.to;

    if (!sidebarOpen) {
      if (firstItemPath) {
        navigate(firstItemPath);
      }
    } else {
      if (openDropdowns.includes(dropdownId)) {
        setOpenDropdowns(openDropdowns.filter((id) => id !== dropdownId));
      } else {
        setOpenDropdowns([...openDropdowns, dropdownId]);
      }
    }
  };

  return (
    <Box sx={styled.container(sidebarOpen, isHoveringToggle)}>
      {sidebarOpen ? (
        <div
          style={{
            padding: "14px 59px 17px 20px",
            transition: "transform 0.3s ease",
          }}
        >
          <img src={ipponLogo} width={101} />
        </div>
      ) : (
        <div
          style={{
            padding: "11px 3px 16px 14px",
            height: "37px",
            transition: "transform 0.3s ease",
          }}
        >
          <img src={ipponLogoSp} width={33} />
        </div>
      )}

      <Box
        onMouseEnter={() => setIsHoveringToggle(true)}
        onMouseLeave={() => setIsHoveringToggle(false)}
        sx={{
          position: "absolute",
          top: 0,
          right: -10,
          width: 25,
          height: "100%",
          zIndex: 999,
        }}
      />

      <IconButton
        onClick={() => {
          setSidebarOpen(!sidebarOpen);

          setTimeout(() => setIsHoveringToggle(false), 100);
        }}
        onMouseEnter={() => setIsHoveringToggle(true)}
        onMouseLeave={() => setIsHoveringToggle(false)}
        disableRipple
        sx={styled.toggleButton(isHoveringToggle)}
      >
        {sidebarOpen ? (
          <KeyboardArrowLeft sx={{ color: "#0E9DBC" }} />
        ) : (
          <KeyboardArrowRight sx={{ color: "#0E9DBC" }} />
        )}
      </IconButton>

      {sidebarMenus.map((menu) => (
        <div key={menu.id} style={{ display: "block", margin: "0 4px" }}>
          <ListItemButton
            disableRipple
            onClick={() => handleDropdownToggle(menu.id)}
            sx={{
              ...(isDropdownActive(menu.subItems)
                ? sidebarOpen
                  ? styled.listItemActive
                  : styled.listItemActiveSp
                : sidebarOpen
                ? styled.listItem
                : styled.listItemSp),
            }}
          >
            {sidebarOpen ? (
              <>
                <ListItemIcon
                  sx={{
                    minWidth: "14px",
                    padding: "8px 10px",
                    color: isDropdownActive(menu.subItems)
                      ? "#0e9dbc"
                      : "#354053",
                    "& svg": {
                      width: "20px",
                      height: "20px",
                    },
                  }}
                >
                  {menu.icon}
                </ListItemIcon>
                <ListItemText primary={menu.label} />
                {openDropdowns.includes(menu.id) ? (
                  <KeyboardArrowUp
                    sx={{
                      color: isDropdownActive(menu.subItems)
                        ? "#0e9dbc"
                        : "#354053",
                      pr: 1,
                    }}
                  />
                ) : (
                  <KeyboardArrowDown
                    sx={{
                      color: isDropdownActive(menu.subItems)
                        ? "#0e9dbc"
                        : "#354053",
                      pr: 1,
                    }}
                  />
                )}
              </>
            ) : (
              <Tooltip title={menu.label} placement="right">
                <ListItemIcon
                  sx={{
                    minWidth: "14px",
                    padding: "8px",
                    color: isDropdownActive(menu.subItems)
                      ? "#0e9dbc"
                      : "#354053",
                    "& svg": {
                      width: "20px",
                      height: "20px",
                    },
                  }}
                >
                  {menu.icon}
                </ListItemIcon>
              </Tooltip>
            )}
          </ListItemButton>

          {sidebarOpen && (
            <Collapse
              in={openDropdowns.includes(menu.id)}
              timeout="auto"
              unmountOnExit
            >
              <List
                component="div"
                disablePadding
                sx={{ ...styled.dropdownMenu }}
              >
                {menu.subItems.map((item) => (
                  <Link key={item.to} to={item.to} style={styled.linkItem}>
                    <ListItemButton
                      disableRipple
                      sx={{
                        ...(currentPath === item.to
                          ? styled.dropdownMenuItemActive
                          : styled.dropdownMenuItem),
                        backgroundColor:
                          currentPath === item.to ? "#DBF8FF" : "transparent",
                        borderRadius: 2,
                        ml: 3,
                        mt: 0.6,
                      }}
                    >
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </Link>
                ))}
              </List>
            </Collapse>
          )}
        </div>
      ))}
    </Box>
  );
};

export default Sidebar;
