import { Business } from "@mui/icons-material";
import {
  Breadcrumbs,
  Icon,
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
// import Cookies from 'js-cookie';
import { Link, useNavigate } from "react-router";

// const member_id = Cookies.get('employeeID')
const settings = [
  {
    title: "Profile",
    link: `/members/profile`,
  },
  {
    title: "Account",
    link: "/",
  },
  {
    title: "Dashboard",
    link: "/",
  },
  {
    title: "Logout",
    link: "/login",
  },
]
const Header = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClickMenuItem = (link:string) => {
    navigate(link);
    handleCloseUserMenu()
  }

  return (
    <Box
      height={50}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}>
      <Stack width={"100%"} direction={"row"}>
        <Icon
          sx={{
            width: 26,
            height: 26,
            backgroundColor: "#2A3246",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            mr: 1,
          }}>
          <Business fontSize='small' sx={{ fontSize: 14 }} />
        </Icon>
        <Breadcrumbs aria-label='breadcrumb' sx={{ width: "100%" }}>
          <Link
            to='/clients'
            style={{
              color: "#989898",
              fontSize: 12,
              fontWeight: "bold",
              textDecoration: "none",
            }}>
            顧客管理
          </Link>
          <Typography
            sx={{ color: "#3E3E3E", fontSize: 12, fontWeight: "bold" }}>
            テスト不動産
          </Typography>
        </Breadcrumbs>
      </Stack>

      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title='Open profile'>
          <Stack
            direction={"row"}
            alignItems={"center"}
            width={91}
            onClick={handleOpenUserMenu}
            sx={{ cursor: "pointer" }}>
            <IconButton sx={{ p: 0, mr: 0.6 }}>
              <Avatar
                alt='Remy Sharp'
                src='/static/images/avatar/2.jpg'
                sx={{ width: 25, height: 25 }}
              />
            </IconButton>
            <Typography
              variant='body2'
              component='h5'
              fontSize={14}
              fontWeight={"bold"}>
              佐藤 太郎
            </Typography>
          </Stack>
        </Tooltip>
        <Menu
          sx={{ mt: "45px" }}
          id='menu-appbar'
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
          onClose={handleCloseUserMenu}>
          {settings.map((setting,index) => (
            <MenuItem key={index} onClick={()=>handleClickMenuItem(setting.link)}>
              <Typography sx={{ textAlign: "center" }}>{setting.title}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;
