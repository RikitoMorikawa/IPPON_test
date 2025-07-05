import { useEffect, useState } from "react";
import { Add } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import Table from "../../../components/Table";
import SectionTitle from "../../../components/SectionTitle";
import CustomButton from "../../../components/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import { useNavigate, useParams } from "react-router";
import CustomBarChart from "../../../components/CustomBarChart";
import LoadingOverlay from "../../../components/Loading/LoadingOverlay";
import "./InquiryListing.css";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { CustomDatePicker } from "../../../components/DatePicker";
// import CustomTextField from "../../../components/CustomTextField";
// import { Controller, useForm } from "react-hook-form";
// import { ReportCalendarIcon } from "../../../common/icons";
import {
  searchPropertyInquiry,
  updatePropertyInquiry,
} from "../../../store/propertiesInquiriesSlice";
import { getPropertiesInquiryColumns } from "../../../common/tableColumns";
import { PaginationInfo } from "../../../types";
import { getEmployeeNames } from "../../../store/employeeSlice";
import { useToast } from "../../../components/Toastify";
import SortFilterButton from "../../../components/SortFilterButton";

const PropertiesInquiryListing = () => {
  const [activeChartSelectionId, setActiveChartSelectionId] = useState<
    string | number | null
  >("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data: propertiesInquiriesData, loading } = useSelector(
    (state: any) => state.propertiesInquiries.searched
  );
  const { property_id } = useParams();
  const [itemCounts, setItemCounts] = useState<any>([]);
  const [dateLabels, setDateLabels] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("1week");
  const [chartLoading, setChartLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<any>({
    inquiryMethod: "",
    startDate: startDate,
    endDate: endDate,
    propertyId: property_id || "",
  });
  const { data: employeeNames } = useSelector(
    (state: any) => state.employees.names
  ); // assuming reducer shape
  const [inquiryData, setInquiryData] = useState<any>([]);
  const [perPage] = useState<number>(10);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
  });
  const [updatedManagers, setUpdatedManagers] = useState<{
    [id: string]: string;
  }>({});
  const { addToast, toasts } = useToast();

  // 期間選択ボタンの設定
  const periodOptions = [
    { value: "3days", label: "3日" },
    { value: "1week", label: "1週間" },
    { value: "2weeks", label: "2週間" },
    { value: "1month", label: "1か月" },
  ];

  const chartSelection = [
    { chartId: "", chartLabel: "問い合わせ数（全体）", width: "125px" },
    { chartId: "SUUMO", chartLabel: "問い合わせ数（SUUMO）", width: "145px" },
    { chartId: "電話", chartLabel: "問い合わせ数（電話）", width: "125px" },
    { chartId: "その他", chartLabel: "問い合わせ数（その他）", width: "137px" },
  ];

  // 期間選択に基づいて日付を設定する関数
  const setPeriodDates = (period: string) => {
    const now = new Date();
    let start: Date;
    let end: Date = new Date(now);

    switch (period) {
      case "3days":
        start = new Date(now);
        start.setDate(start.getDate() - 2); // 今日含めて3日
        break;
      case "1week":
        start = new Date(now);
        start.setDate(start.getDate() - 6); // 今日含めて7日
        break;
      case "2weeks":
        start = new Date(now);
        start.setDate(start.getDate() - 13); // 今日含めて14日
        break;
      case "1month":
        start = new Date(now);
        start.setDate(start.getDate() - 29); // 今日含めて30日
        break;
      default:
        start = new Date(now);
        start.setDate(start.getDate() - 6); // デフォルトは1週間
    }

    setStartDate(start.toISOString());
    setEndDate(end.toISOString());
  };

  // 期間選択の変更ハンドラー
  const handlePeriodChange = (period: string) => {
    setChartLoading(true); // ローディング開始
    setSelectedPeriod(period);
    setPeriodDates(period);
  };

  // チャート選択の変更ハンドラー
  const handleChartSelectionChange = (chartId: string | number | null) => {
    setChartLoading(true); // ローディング開始
    setActiveChartSelectionId(chartId);
  };
  const fetchPropertiesInquiries = async (
    params: any,
    page: number = 1,
    limit: number = perPage
  ) => {
    try {
      const searchPayload = {
        propertyId: property_id,
        inquiryMethod: params.inquiryMethod,
        startDate: params.startDate,
        endDate: params.endDate,
        page: page,
        limit: limit,
      };
      const cleanedPayload = Object.fromEntries(
        Object.entries(searchPayload).filter(
          ([_, value]) => value !== undefined
        )
      );
      const result = await dispatch(searchPropertyInquiry(cleanedPayload));
      if (searchPropertyInquiry.fulfilled.match(result)) {
        const responseData = result.payload;
        setPagination({
          total: responseData.total || 0,
          page: responseData.page || page,
          limit: responseData.limit || limit,
        });
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
    }
  };

  // 初期化時に1週間の期間を設定
  useEffect(() => {
    setPeriodDates("1week");
  }, []);

  useEffect(() => {
    fetchPropertiesInquiries(searchParams, 1, pagination.limit);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [searchParams]);

  useEffect(() => {
    if (pagination.limit !== perPage) {
      fetchPropertiesInquiries(searchParams);
    }
  }, [perPage]);

  useEffect(() => {
    if (propertiesInquiriesData && propertiesInquiriesData?.items) {
      const result = mapInquiries(propertiesInquiriesData?.items);
      setInquiryData(result);
    }
  }, [propertiesInquiriesData]);
  const mapInquiries = (apiResponse: any) => {
    return apiResponse?.map((item: any, index: number) => {
      const inquiry = item?.inquiry;
      const customer = inquiry?.customer;
      const property = inquiry?.property;

      return {
        id: inquiry?.id || index + 1,
        sourceOfResponse: inquiry.method?.toUpperCase() || "",
        name: `${customer?.last_name || ""} ${
          customer?.first_name || ""
        }`.trim(),
        property_name: property?.name || "",
        type: property?.type || "",
        register_timestamp: inquiry?.created_at || "-",
        content: inquiry.summary || "",
        manager: inquiry?.employee_id || "-",
        customer_created_at: customer?.created_at || "-",
        customer_id: inquiry.customer_id || "-",
      };
    });
  };

  useEffect(() => {
    setSearchParams((prev: any) => ({
      ...prev,
      inquiryMethod: activeChartSelectionId,
      propertyId: property_id || "",
      startDate: startDate || "",
      endDate: endDate || "",
    }));
  }, [activeChartSelectionId, property_id, endDate, startDate]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    fetchPropertiesInquiries(searchParams, page, pagination.limit);
  };

  // 週の開始日（月曜日）を取得する関数
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 月曜日を週の始まりとする
    return new Date(d.setDate(diff));
  };

  // 週ラベルを生成する関数
  const getWeekLabel = (weekStart: Date) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return `${weekStart.getMonth() + 1}/${String(weekStart.getDate()).padStart(
      2,
      "0"
    )}-${weekEnd.getMonth() + 1}/${String(weekEnd.getDate()).padStart(2, "0")}`;
  };

  useEffect(() => {
    // 期間やフィルタ変更時にローディングを開始
    setChartLoading(true);

    if (!propertiesInquiriesData || !propertiesInquiriesData.items?.length) {
      setChartLoading(false);
      return;
    }

    const formatted = mapInquiries(propertiesInquiriesData.items);

    // 1か月選択時は週単位、それ以外は日単位で処理
    if (selectedPeriod === "1month") {
      // 週単位の処理
      const weekMap: Record<string, Record<string, number>> = {};

      formatted.forEach((item: any) => {
        const date = new Date(item.register_timestamp);
        if (isNaN(date.getTime())) return;

        const weekStart = getWeekStart(date);
        const weekLabel = getWeekLabel(weekStart);
        const method = item.sourceOfResponse || "";

        if (!weekMap[weekLabel]) weekMap[weekLabel] = {};
        if (!weekMap[weekLabel][method]) weekMap[weekLabel][method] = 0;

        weekMap[weekLabel][method]++;
      });

      // 週単位のラベル生成
      const weekLabels: string[] = [];
      const today = new Date();
      const start = startDate ? new Date(startDate) : new Date(today);

      // 開始日を含む週の月曜日から開始
      let currentWeekStart = getWeekStart(start);
      const endWeekStart = getWeekStart(today);

      while (currentWeekStart <= endWeekStart) {
        weekLabels.push(getWeekLabel(currentWeekStart));
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      }

      // 週単位のカウント
      const weekCounts = weekLabels.map((label) => {
        const method = activeChartSelectionId || "";
        if (method === "") {
          return Object.values(weekMap[label] || {}).reduce(
            (sum, count) => sum + count,
            0
          );
        }
        return weekMap[label]?.[method] || 0;
      });

      setDateLabels(weekLabels);
      setItemCounts(weekCounts);
    } else {
      // 日単位の処理（従来の処理）
      const dateMap: Record<string, Record<string, number>> = {};

      formatted.forEach((item: any) => {
        const date = new Date(item.register_timestamp);
        if (isNaN(date.getTime())) return;

        const label = `${date.getMonth() + 1}/${String(date.getDate()).padStart(
          2,
          "0"
        )}`; // e.g. '5/01'
        const method = item.sourceOfResponse || "";

        if (!dateMap[label]) dateMap[label] = {};
        if (!dateMap[label][method]) dateMap[label][method] = 0;

        dateMap[label][method]++;
      });

      // Generate date labels
      const dateLabels: string[] = [];

      const today = new Date();
      const getDateLabel = (date: Date) =>
        `${date.getMonth() + 1}/${String(date.getDate()).padStart(2, "0")}`;

      const start = startDate ? new Date(startDate) : new Date(today);
      const end = endDate
        ? new Date(endDate)
        : new Date(today.setDate(today.getDate() + 1)); // include today

      if (!startDate || !endDate) {
        // last 10 days from today if no dates given
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          dateLabels.push(getDateLabel(date));
        }
      } else {
        // range from startDate to endDate
        const current = new Date(start);
        while (current <= end) {
          dateLabels.push(getDateLabel(current));
          current.setDate(current.getDate() + 1);
        }
      }

      // Fill counts for each date label
      const counts = dateLabels.map((label) => {
        const method = activeChartSelectionId || "";
        if (method === "") {
          return Object.values(dateMap[label] || {}).reduce(
            (sum, count) => sum + count,
            0
          );
        }
        return dateMap[label]?.[method] || 0;
      });

      setDateLabels(dateLabels);
      setItemCounts(counts);
    }

    // データ処理完了後にローディングを非表示
    setChartLoading(false);
  }, [
    activeChartSelectionId,
    propertiesInquiriesData,
    startDate,
    endDate,
    selectedPeriod,
  ]);

  const handleAddNew = () => {
    navigate(`/properties/inquiry_create`);
  };

  useEffect(() => {
    dispatch(getEmployeeNames({}));
  }, [dispatch]);

  const employeeOptions =
    employeeNames?.map((employee: any) => ({
      value: employee.id,
      label: employee.first_name + " " + employee.family_name,
    })) || [];

  const handleManagerChange = (id: string, newManager: string) => {
    setUpdatedManagers((prev) => ({ ...prev, [id]: newManager }));
    const matchedRow = inquiryData.find((row: any) => row.id === id);
    const formData = new FormData();
    formData.append("employee_id", newManager);
    formData.append("customer_created_at", matchedRow.customer_created_at);
    formData.append("inquiry_created_at", matchedRow.register_timestamp);
    updatePropertyInquiries(matchedRow?.customer_id, formData);
  };
  const updatePropertyInquiries = async (id: string, uploadFormData: any) => {
    try {
      const updateResult = await dispatch(
        updatePropertyInquiry({ id, uploadFormData })
      );
      if (updatePropertyInquiry.fulfilled.match(updateResult)) {
        addToast({
          message: "登録完了 。",
          type: "success",
        });
      } else if (updatePropertyInquiry.rejected.match(updateResult)) {
        const responseData = updateResult.payload as any;
        const message = responseData?.message;
        addToast({
          message: message,
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error creating properties:", err);
    }
  };

  const inquiryColumns = getPropertiesInquiryColumns(
    true,
    employeeOptions,
    updatedManagers,
    handleManagerChange
  );

  return (
    <Box mb={2.5}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        position={"relative"}
      >
        <SectionTitle title="ダッシュボード" />
      </Stack>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          margin: "10px 0 20px 0",
        }}
      >
        <Typography
          align="right"
          fontSize={{ lg: 12, xs: 10 }}
          marginRight="20px"
          color="#3E3E3E"
          fontWeight={700}
          sx={{
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          期間
        </Typography>
        <Box sx={{ display: "flex", gap: "10px" }}>
          {periodOptions.map((option) => (
            <SortFilterButton
              key={option.value}
              label={option.label}
              value={option.value}
              active={selectedPeriod === option.value}
              onClick={handlePeriodChange}
            />
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          background: "#F5F5F5",
          padding: "10px",
          borderRadius: "10px",
          marginBottom: "26px",
          display: { md: "block", xs: "none" },
        }}
      >
        <Stack direction={"row"} gap={2} marginBottom={"10px"}>
          {chartSelection.map((item) => (
            <Typography
              className={`barChatButton ${
                activeChartSelectionId === item.chartId ? "active" : ""
              }`}
              key={item.chartId}
              onClick={() => handleChartSelectionChange(item.chartId)}
            >
              {item.chartLabel}
            </Typography>
          ))}
        </Stack>
        <Box sx={{ position: "relative" }}>
          <CustomBarChart
            itemCounts={itemCounts}
            dateLabels={dateLabels}
            isLoading={chartLoading}
          />
          {chartLoading && (
            <LoadingOverlay
              position="absolute"
              backgroundColor="rgba(245, 245, 245, 0.9)"
              minHeight="300px"
            />
          )}
        </Box>
      </Box>
      <Box
        sx={{
          background: "#F5F5F5",
          padding: "10px",
          borderRadius: "10px",
          marginBottom: "26px",
          display: { md: "none", xs: "block" },
        }}
      >
        <Stack direction="row" gap={2} marginBottom="20px" flexWrap="wrap">
          {chartSelection.map((item) => (
            <Button
              key={item.chartId}
              onClick={() => handleChartSelectionChange(item.chartId)}
              variant={
                activeChartSelectionId === item.chartId
                  ? "contained"
                  : "outlined"
              }
              sx={{
                borderRadius: "25px",
                textTransform: "none",
                fontSize: "11.5px",
                fontWeight: "medium",
                width: item.width,
                height: "28px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "center", // Add this line
                display: "flex", // Add this line
                justifyContent: "center", // Add this line
                alignItems: "center", // Add this line
                ...(activeChartSelectionId === item.chartId
                  ? {
                      backgroundColor: "#0B9DBD",
                      color: "white",
                      border: "none",
                      "&:hover": {
                        backgroundColor: "#0B9DBD",
                      },
                    }
                  : {
                      backgroundColor: "transparent",
                      color: "#009eb8",
                      border: "2px solid #0B9DBD",
                      "&:hover": {
                        backgroundColor: "rgba(93, 173, 226, 0.1)",
                      },
                    }),
              }}
            >
              <span style={{ paddingLeft: "8px" }}>{item.chartLabel}</span>
            </Button>
          ))}
        </Stack>
        <CustomBarChart itemCounts={itemCounts} dateLabels={dateLabels} />
      </Box>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        position={"relative"}
        my={2.5}
      >
        <SectionTitle title="顧客一覧" />
        <Box sx={{ position: "absolute", right: "0", bottom: "0" }}>
          <CustomButton
            label="問い合わせ新規作成"
            type="button"
            startIcon={<Add sx={{ fontSize: "18px !important" }} />}
            onClick={handleAddNew}
          />
        </Box>
      </Stack>
      <Table
        isLoading={loading}
        rows={inquiryData}
        columns={inquiryColumns}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
      {toasts}
    </Box>
  );
};

export default PropertiesInquiryListing;
