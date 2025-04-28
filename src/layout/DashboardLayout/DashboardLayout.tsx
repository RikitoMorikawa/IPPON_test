import { useState } from "react";
import { Grid } from "@mui/material";
import MainLayout from "../MainLayout/MainLayout";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <Grid container height={"100vh"}>
      <Grid item width={sidebarOpen ? 180 : 50}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </Grid>
      <Grid
        item
        width={sidebarOpen ? "calc(100% - 180px)" : "calc(100% - 50px)"}
        px={3}>
        <Header />
        <MainLayout />
      </Grid>
    </Grid>
  );
};

export default DashboardLayout;
