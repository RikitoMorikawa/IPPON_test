import { Box, Stack, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import PropertyInquiryForm from "../../../components/PropertyInquiryForm";
import { CustomTabPanel } from "../Update";
import PropertyInquiryHistory from "../InquiryHistory";
import dayjs from "dayjs";
import isYesterday from "dayjs/plugin/isYesterday";
import isToday from "dayjs/plugin/isToday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import "./PropertiesInquiryUpdate.css";
import { useParams, useSearchParams } from "react-router";
import { fetchPropertyInquiryDetail } from "../../../store/propertiesInquiriesSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isSameOrAfter);

const PropertyInquiryUpdate = () => {
  const [initialData, setInitialData] = useState({});
  const { data: propertiesInquiriesData } = useSelector(
    (state: any) => state.propertiesInquiries.detailed
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const { inquiry_id } = useParams();
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
      if (tabValue >= 0 && tabValue <= 1) {
        // 有効なタブ番号の範囲をチェック
        setValue(tabValue);
      }
    }
  }, [searchParams]);

  const handleUpdate = () => {
    setInitialData([]);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const getPropertiesInquiryDetail = async () => {
    const id = inquiry_id;
    try {
      await dispatch(fetchPropertyInquiryDetail(id));
    } catch (err) {
      console.error("Error occured during fetching detail of properties:", err);
    }
  };

  useEffect(() => {
    getPropertiesInquiryDetail();
  }, [inquiry_id]);

  useEffect(() => {
    if (
      propertiesInquiriesData &&
      Array.isArray(propertiesInquiriesData.items) &&
      propertiesInquiriesData.items.length > 0
    ) {
      setInitialData(propertiesInquiriesData.items[0].inquiry);
    }
  }, [propertiesInquiriesData]);

  return (
    <Box mt={"10px"}>
      <Stack flexDirection={"row"}>
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
                  fontSize: { lg: "14px", xs: "10px" },
                },
                "& .Mui-selected": {
                  color: "#0B9DBD !important",
                  fontWeight: "bold",
                },
              }}
            >
              <Tab
                label="顧客詳細"
                {...a11yProps(0)}
                sx={{
                  width: { lg: 150, xs: "40px" },
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              />
              <Tab
                label="問い合わせ履歴"
                {...a11yProps(1)}
                sx={{
                  width: { lg: 150, xs: "84px" },
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <PropertyInquiryForm
              defaultValues={initialData}
              onSubmit={handleUpdate}
              formType="update"
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <PropertyInquiryHistory />
          </CustomTabPanel>
        </Box>
      </Stack>
    </Box>
  );
};

export default PropertyInquiryUpdate;
