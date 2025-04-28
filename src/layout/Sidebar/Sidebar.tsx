import { Link, useLocation } from "react-router";
import {
  Business,
  Notifications,
  ManageAccounts,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ipponLogo from "../../assets/ippon_client_logo.png";
import ipponLogoSp from "../../assets/ippon_client_logo_sp.png";

const styled = {
  linkItem: {
    textDecoration: "none",
  },
  listItem: {
    margin: "5px 15px",
    padding: 0,
    "& > .MuiListItemIcon-root, & > .MuiListItemText-root span": {
      color: "#FFFFFF",
      fontSize: "14px",
      fontWeight: "bold",
    },
  },
  listItemSp: {
    margin: "5px 7px",
    padding: 0,
    "& > .MuiListItemIcon-root, & > .MuiListItemText-root span": {
      color: "#FFFFFF",
      fontSize: "14px",
      fontWeight: "bold",
    },
  },
  listItemActive: {
    backgroundColor: "#2A3246",
    borderRadius: "8px",
    margin: "5px 15px",
    padding: 0,
    "& > .MuiListItemIcon-root, & > .MuiListItemText-root span": {
      color: "#FFFFFF",
      fontSize: "14px",
      fontWeight: "bold",
    },
  },
  listItemActiveSp: {
    backgroundColor: "#2A3246",
    borderRadius: "8px",
    margin: "5px 7px",
    padding: 0,
    "& > .MuiListItemIcon-root, & > .MuiListItemText-root span": {
      color: "#FFFFFF",
      fontSize: "14px",
      fontWeight: "bold",
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
  const sidebarLinks = [
    { to: "/clients", label: "顧客管理", icon: <Business /> },
    { to: "/notifications", label: "通知設定", icon: <Notifications /> },
    { to: "/members", label: "アカウント管理", icon: <ManageAccounts /> },
  ];

  return (
    <Box bgcolor='#354053' height='100%' position={"relative"}>
      {sidebarOpen ? (
        <img
          src={ipponLogo}
          width={101}
          style={{ padding: "14px 59px 17px 20px" }}
        />
      ) : (
        <img
          src={ipponLogoSp}
          width={33}
          style={{ padding: "14px 8.5px 34px" }}
        />
      )}

      <IconButton
        onClick={() => {
          setSidebarOpen(!sidebarOpen);
        }}
        disableRipple
        sx={{
          position: "absolute",
          top: 43,
          right: "-15px",
          width: 30,
          height: 30,
          background: "#354053",
          border: "2px solid #fff",
          color: "#fff",
        }}>
        {sidebarOpen ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      {sidebarLinks.map((link) => (
        <Link key={link.to} to={link.to} style={styled.linkItem}>
          <ListItemButton
            sx={
              currentPath === link.to
                ? sidebarOpen
                  ? styled.listItemActive
                  : styled.listItemActiveSp
                : sidebarOpen
                ? styled.listItem
                : styled.listItemSp
            }>
            <ListItemIcon
              sx={{
                minWidth: "14px",
                padding: sidebarOpen ? "8px 10px" : "6px",
              }}>
              {link.icon}
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary={link.label} />}
          </ListItemButton>
        </Link>
      ))}
    </Box>
  );
};

export default Sidebar;
