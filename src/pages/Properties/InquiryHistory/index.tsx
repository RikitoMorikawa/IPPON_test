import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import PropertyInquiryHistoryForm from "../../../components/PropertyInquiryHistoryForm";
import { useEffect, useState } from "react";
import { searchInquiryHistory } from "../../../store/propertiesInquiriesSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import { useForm } from "react-hook-form";
import { AddNewIcon } from "../../../common/icons";
import { Close, Search } from "@mui/icons-material";
import CustomTextField from "../../../components/CustomTextField";
import dayjs from "dayjs";
import isYesterday from "dayjs/plugin/isYesterday";
import isToday from "dayjs/plugin/isToday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import SectionTitleInquiry from "./SectionTitleInquiry";
import SectionTitle from "../../../components/SectionTitle";

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isSameOrAfter);
const PropertyInquiryHistory = () => {
  const [searchParams, setSearchParams] = useState<any>({
    title: "",
  });
  const [submitStatus, setSubmitStatus] = useState(false);
  const { data: propertiesInquiriesHistoryData } = useSelector(
    (state: any) => state.propertiesInquiries.searchedInquiryHistory
  );
  const [initialHistoryData, setInitialHistoryData] = useState({});
  const [formStatus, setFormStatus] = useState("create");
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch<AppDispatch>();
  const [groupedData, setGroupedData] = useState<any>({});
  const [todayHistory, setTodayHistory] = useState([]);
  const [yesterdayHistory, setYesterdayHistory] = useState([]);
  const [lastWeekHistory, setLastWeekHistory] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [mobileDialogOpen, setMobileDialogOpen] = useState(false);

  const handleUpdate = () => {
    // history API call
  };

  const onSubmit = (data: any) => {
    setSearchParams({
      title: data.title || "",
    });
  };

  const handleHistoryClick = (item: any) => {
    setSelectedId(item.id);
    setFormStatus("update");
  };

  const groupHistoryByDate = (history: any[]) => {
    const todayItems: any[] = [];
    const yesterdayItems: any[] = [];
    const lastWeekItems: any[] = [];

    const now = dayjs().utc();
    history?.forEach((item) => {
      const date = dayjs.utc(item.inquired_at);

      if (date.isToday()) {
        todayItems.push(item);
      } else if (date.isYesterday()) {
        yesterdayItems.push(item);
      } else if (date.isSameOrAfter(now.subtract(7, "day"), "day")) {
        lastWeekItems.push(item);
      }
    });
    return {
      today: todayItems,
      yesterday: yesterdayItems,
      lastWeek: lastWeekItems,
    };
  };

  useEffect(() => {
    const addGroupData = async () => {
      if (propertiesInquiriesHistoryData) {
        console.log(
          "=== 問い合わせ履歴データ（全体） ===",
          propertiesInquiriesHistoryData
        );
        console.log(
          "=== 問い合わせ履歴一覧 ===",
          propertiesInquiriesHistoryData.inquiries
        );

        const grouped = await groupHistoryByDate(
          propertiesInquiriesHistoryData.inquiries
        );
        console.log("=== 日付別グループ化データ ===", grouped);
        setGroupedData(grouped);
        // 初期表示では選択しない（新規作成フォームを表示するため）
        // setSelectedId(propertiesInquiriesHistoryData.inquiries[0].id);
      }
    };

    addGroupData();
  }, [propertiesInquiriesHistoryData]);

  useEffect(() => {
    if (selectedId !== null) {
      const historyData = propertiesInquiriesHistoryData.inquiries as any;
      const history = historyData?.filter(
        (item: any) => item.id === selectedId
      );
      setInitialHistoryData(history[0]);
    }
  }, [selectedId]);

  useEffect(() => {
    if (groupedData) {
      setTodayHistory(groupedData?.today);
      setYesterdayHistory(groupedData?.yesterday);
      setLastWeekHistory(groupedData?.lastWeek);
    }
  }, [groupedData]);
  const fetchInquiryHistory = async (params: any) => {
    try {
      const searchPayload = {
        title: params.title,
      };
      const cleanedPayload = Object.fromEntries(
        Object.entries(searchPayload).filter(
          ([_, value]) => value !== undefined
        )
      );
      await dispatch(searchInquiryHistory(cleanedPayload));
    } catch (err) {
      console.error("Error fetching properties:", err);
    }
  };

  const handleOpenMobileDialog = () => {
    setMobileDialogOpen(true);
  };

  const handleCloseMobileDialog = () => {
    setMobileDialogOpen(false);
  };

  const handleMobileHistoryClick = (item: any) => {
    handleHistoryClick(item);
    handleCloseMobileDialog();
  };

  const SidebarContent = ({
    onItemClick,
  }: {
    onItemClick: (item: any) => void;
  }) => (
    <>
      <form
        className={mobileDialogOpen ? "" : "searchForm"}
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: "90%" }}
      >
        <CustomTextField
          fullWidth
          placeholder="検索"
          {...register("title")}
          slotProps={{
            input: {
              startAdornment: <Search sx={{ color: "#989898", mr: 1 }} />,
            },
          }}
          sx={{
            mt: 3,
            // mb: 2,
            mx: { lg: 0, xs: 3 },
            ".MuiInputBase-root": {
              height: "34px",
              borderColor: "#D9D9D9",
              borderRadius: "10px",
            },
            input: {
              fontSize: "12px !important",
              padding: "8px 12px 8px 0 !important",
            },
          }}
        />
      </form>
      <Box sx={{ mb: 2, mx: { lg: 0, xs: 3 } }}>
        <Box
          onClick={() => setFormStatus("create")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 12px",
            backgroundColor: "#fafafa",
            border: "1px solid #e0e0e0",
            borderRadius: "10px",
            fontSize: "12px",
            color: "#666",
            cursor: "pointer",
            transition: "all 0.15s ease",
            height: "34px",
            width: "90%",
            boxSizing: "border-box",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              borderColor: "#ccc",
            },
          }}
        >
          <AddNewIcon />
          新規作成
        </Box>
      </Box>
      <Box className="historyTitleWrapper" sx={{ mx: { lg: 0, xs: 3 } }}>
        <Typography className="historyTitle">今日</Typography>
        <Stack>
          {todayHistory?.map((item: any, index: number) => (
            <Typography
              key={index}
              className={`titleLink ${
                selectedId === item.id ? "activeTitle" : ""
              }`}
              onClick={() => onItemClick(item)}
            >
              {item.title}
            </Typography>
          ))}
        </Stack>
      </Box>
      <Box className="historyTitleWrapper" sx={{ mx: { lg: 0, xs: 3 } }}>
        <Typography className="historyTitle">昨日</Typography>
        <Stack>
          {yesterdayHistory?.map((item: any, index: number) => (
            <Typography
              key={index}
              className={`titleLink ${
                selectedId === item.id ? "activeTitle" : ""
              }`}
              onClick={() => onItemClick(item)}
            >
              {item.title}
            </Typography>
          ))}
        </Stack>
      </Box>
      <Box className="historyTitleWrapper" sx={{ mx: { lg: 0, xs: 3 } }}>
        <Typography className="historyTitle">過去7日間</Typography>
        <Stack>
          {lastWeekHistory?.map((item: any, index: number) => (
            <Typography
              key={index}
              className={`titleLink ${
                selectedId === item.id ? "activeTitle" : ""
              }`}
              onClick={() => onItemClick(item)}
            >
              {item.title}
            </Typography>
          ))}
        </Stack>
      </Box>
    </>
  );

  useEffect(() => {
    fetchInquiryHistory(searchParams);
  }, [searchParams, submitStatus]);

  return (
    <Box sx={{ display: { lg: "flex", xs: "block" } }}>
      <Box
        sx={{
          height: "100vh",
          width: "175px",
          background: "#fff",
          borderRight: "1px solid #D9D9D9",
          // paddingTop: '24px',
          display: { lg: "block", xs: "none" },
        }}
      >
        <SidebarContent onItemClick={handleHistoryClick} />
      </Box>
      <Box>
        <Box
          sx={{
            mb: 2,
            display: { lg: "none", xs: "block" },
            mt: { xs: 3, sm: "" },
          }}
        >
          <SectionTitleInquiry
            title="顧客詳細/問い合わせ履歴"
            onAddClick={handleOpenMobileDialog}
          />
        </Box>
        <PropertyInquiryHistoryForm
          defaultValues={formStatus === "update" ? initialHistoryData : {}}
          onSubmit={handleUpdate}
          onSuccess={(status) => {
            if (status === "updated") {
              setSubmitStatus(!submitStatus);
            } else if (status === "created") {
              setSubmitStatus(!submitStatus);
            }
          }}
          formType={formStatus}
        />
      </Box>

      <Dialog
        open={mobileDialogOpen}
        onClose={handleCloseMobileDialog}
        sx={{
          display: { lg: "none", xs: "block" },
          borderRadius: "10px",
        }}
        PaperProps={{
          sx: {
            borderRadius: "10px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              px: 2,
              pt: 2,
              pb: 1,
            }}
          >
            <SectionTitle addBorder={false} title="問い合わせ履歴" />
          </Box>
          <IconButton sx={{}}>
            <Close
              sx={{ fontSize: "20px" }}
              onClick={handleCloseMobileDialog}
            />
          </IconButton>
        </Box>
        <DialogContent sx={{ px: 2, pt: 0 }}>
          <SidebarContent onItemClick={handleMobileHistoryClick} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PropertyInquiryHistory;
