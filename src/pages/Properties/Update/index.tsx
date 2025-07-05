import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import PropertyForm from "../../../components/PropertyForm";
import { useLocation, useParams, useSearchParams } from "react-router";
import SectionTitle from "../../../components/SectionTitle";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropertiesInquiryListing from "../InquiryListing";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import { fetchPropertyDetail } from "../../../store/propertiesSlice";
import ReportManager from "../../Report/Manager/ReportManager";

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const tabPadding = "24px 0 0 0";
  const historyTabPadding = "0";

  const loctaion = useLocation();
  let appliedPadding =
    loctaion.pathname.includes("/properties/inquiry/") && index === 1
      ? historyTabPadding
      : tabPadding;
  appliedPadding =
    loctaion.pathname.includes("/inquiry/") && index === 1
      ? historyTabPadding
      : tabPadding;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ padding: appliedPadding }}>{children}</Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const UpdateProperty = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { property_id } = useParams();
  const [initialData, setInitialData] = useState({});
  const { data: propertiesData } = useSelector(
    (state: any) => state.properties.detailed
  );
  const dispatch = useDispatch<AppDispatch>();

  // URLパラメータからタブの値を取得、デフォルトは0
  const [value, setValue] = useState(() => {
    const tabFromUrl = searchParams.get("tab");
    return tabFromUrl ? parseInt(tabFromUrl) : 0;
  });

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    // URLパラメータを更新
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("tab", newValue.toString());
      return newParams;
    });
  };

  // URLパラメータの変更を監視してタブの状態を同期
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      const tabValue = parseInt(tabFromUrl);
      if (tabValue >= 0 && tabValue <= 2) {
        // 有効なタブ番号の範囲をチェック
        setValue(tabValue);
      }
    }
  }, [searchParams]);

  const getPropertyDetail = async () => {
    const id = property_id;
    try {
      await dispatch(fetchPropertyDetail(id));
    } catch (err) {
      console.error("Error occured during fetching detail of properties:", err);
    }
  };

  useEffect(() => {
    getPropertyDetail();
  }, [property_id]);

  useEffect(() => {
    if (propertiesData) {
      setInitialData(propertiesData);
    }
  }, [propertiesData]);

  return (
    <Box mt={"10px"}>
      <SectionTitle title={propertiesData?.name} addBorder={false} />
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            TabIndicatorProps={{
              style: {
                backgroundColor: "#0B9DBD",
              },
            }}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                border: "none",
                outline: "none",
                fontWeight: "700",
                color: "#989898",
                fontSize: { lg: "14px", xs: "12px" },
                px: 2,
              },
              "& .Mui-selected": {
                color: "#0B9DBD !important",
                fontWeight: "bold",
              },
            }}
          >
            <Tab
              label="詳細情報"
              {...a11yProps(0)}
              sx={{ width: { lg: 150, xs: 40 }, mx: 0 }}
            />
            <Tab
              label="問い合わせ管理"
              {...a11yProps(1)}
              sx={{ width: { lg: 150, xs: 120 } }}
            />
            <Tab
              label="報告書"
              {...a11yProps(2)}
              sx={{ width: { lg: 150, xs: 40 } }}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <PropertyForm defaultValues={initialData} formType="update" />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <PropertiesInquiryListing />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <ReportManager />
        </CustomTabPanel>
      </Box>
    </Box>
  );
};

export default UpdateProperty;
