import { useState, useEffect } from "react";
import { Box, Grid, IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MainLayout from "../MainLayout/MainLayout";
import Header from "../Header/Header";
import ipponLogo from "../../assets/ippon_trading_logo.png";
import MobileSidebar from "../../components/MobileSideBar";
import Sidebar from "../Sidebar/Sidebar";

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Set default desktop sidebar state based on screen size
  useEffect(() => {
    if (!isMobile) {
      setDesktopSidebarOpen(true);
      setMobileSidebarOpen(false); // Close mobile sidebar when switching to desktop
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setDesktopSidebarOpen(!desktopSidebarOpen);
    }
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  const getSidebarWidth = () => {
    if (isMobile) return 0; // Mobile sidebar doesn't affect layout
    return desktopSidebarOpen ? 210 : 60;
  };

  return (
    <>
      {/* Mobile Sidebar - Overlays content */}
      {isMobile && (
        <MobileSidebar 
          open={mobileSidebarOpen} 
          onClose={closeMobileSidebar} 
        />
      )}

      <Grid container height={"100vh"}>
        {/* Desktop Sidebar - Part of layout */}
        {!isMobile && (
          <Grid item width={getSidebarWidth()}>
            <Sidebar 
              sidebarOpen={desktopSidebarOpen} 
              setSidebarOpen={setDesktopSidebarOpen} 
            />
          </Grid>
        )}
        
        <Grid
          item
          width={
            isMobile 
              ? "100%" 
              : `calc(100% - ${getSidebarWidth()}px)`
          }
          pr={{ lg: 3, xs: 3 }}
          pl={
            isMobile 
              ? { xs: 3 } 
              : desktopSidebarOpen 
                ? 4 
                : { lg: 4 }
          }
        >
          <Box sx={{ my: 2, display: {lg: 'none', sm: 'block'} }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
            }}>
              <IconButton
                onClick={toggleSidebar}
                sx={{
                  color: '#3e3e3e',
                  padding: '2px',
                  borderRadius: '5px', 
                  boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.15)',
                  '&:hover': {
                    backgroundColor: '#fff'
                  }
                }}
              >
                <MenuIcon sx={{ color: '#0B9DBD', fontSize: 30 }} />
              </IconButton>
              <img
                src={ipponLogo}
                width={106}
                alt="Ippon Trading Logo"
              />
            </div>
          </Box>
          <Header />
          <MainLayout />
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardLayout;