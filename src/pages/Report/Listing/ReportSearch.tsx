import { useEffect, useState, useRef } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import SectionTitle from "../../../components/SectionTitle";
// import CustomTextField from '../../../components/CustomTextField';
import CustomSelect from "../../../components/CustomSelect";
import { useForm, Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CustomDatePicker } from "../../../components/DatePicker";
import CustomDateTimePicker from "../../../components/CustomDateTimePicker";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
  setupReportBatch,
  fetchBatchStatus,
  updateBatchStatus,
  deleteBatchStatus,
} from "../../../store/reportSlice";
import { useToast } from "../../../components/Toastify";
import { useTheme } from "@mui/material";
import OutputToggleButton from "../../../components/OutputToggleButton";
import Button from '@mui/material/Button';
import CustomModal from "../../../components/CustomModal";
import CustomButton from "../../../components/CustomButton";

interface SearchParams {
  autoGenerate?: boolean;
  weekday?: string;
  executionTime?: string;
  autoCreatePeriod?: string;
  period?: string;
}

// Internal form state - includes separate date fields
interface FormData {
  autoGenerate?: boolean;
  startDate?: string;
  weekday?: string;
  executionTime?: string;
  autoCreatePeriod?: string;
  start_date?: string;
  end_date?: string;
}

interface ReportSearchProps {
  onSearch: (searchParams: SearchParams) => void;
  onClear: () => void;
  currentSearchParams?: SearchParams;
  onCreateNew?: (period?: { start_date: string; end_date: string }) => void;
  property_id?: string;
}

// 曜日オプション
const weekdayOptions = [
  { label: "月曜日", value: "1" },
  { label: "火曜日", value: "2" },
  { label: "水曜日", value: "3" },
  { label: "木曜日", value: "4" },
  { label: "金曜日", value: "5" },
  { label: "土曜日", value: "6" },
  { label: "日曜日", value: "0" },
];

// 時刻オプション
const timeOptions = [
  { label: "00:00", value: "00:00" },
  { label: "01:00", value: "01:00" },
  { label: "02:00", value: "02:00" },
  { label: "03:00", value: "03:00" },
  { label: "04:00", value: "04:00" },
  { label: "05:00", value: "05:00" },
  { label: "06:00", value: "06:00" },
  { label: "07:00", value: "07:00" },
  { label: "08:00", value: "08:00" },
  { label: "09:00", value: "09:00" },
  { label: "10:00", value: "10:00" },
  { label: "11:00", value: "11:00" },
  { label: "12:00", value: "12:00" },
  { label: "13:00", value: "13:00" },
  { label: "14:00", value: "14:00" },
  { label: "15:00", value: "15:00" },
  { label: "16:00", value: "16:00" },
  { label: "17:00", value: "17:00" },
  { label: "18:00", value: "18:00" },
  { label: "19:00", value: "19:00" },
  { label: "20:00", value: "20:00" },
  { label: "21:00", value: "21:00" },
  { label: "22:00", value: "22:00" },
  { label: "23:00", value: "23:00" },
];

// 期間オプション
const option2 = [
  { label: "1週間ごと", value: "1週間ごと" },
  { label: "2週間ごと", value: "2週間ごと" },
];

// 曜日から次回の日付を計算する関数
const getNextWeekday = (weekday: string) => {
  const today = dayjs();
  const targetWeekday = parseInt(weekday); // 0=日曜日, 1=月曜日, ...
  const currentWeekday = today.day();
  let daysToAdd = targetWeekday - currentWeekday;
  if (daysToAdd <= 0) {
    daysToAdd += 7;
  }
  return today.add(daysToAdd, 'day').format('YYYY-MM-DD');
};

// 曜日番号を日本語曜日に変換
const getJapaneseWeekday = (weekday: string) => {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  return weekdays[parseInt(weekday)] || '';
};

// バッチステータスから表示用の日時文字列を生成
const formatNextExecutionDate = (nextExecutionDate: string, executionTime: string, weekday: string) => {
  try {
    const date = new Date(nextExecutionDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdayStr = getJapaneseWeekday(weekday);
    
    return `${month}月${day}日 ${weekdayStr}曜 ${executionTime}`;
  } catch (error) {
    return '日時不明';
  }
};

const ReportSearch = ({
  onSearch,
  currentSearchParams = {},
  onCreateNew,
  property_id,
}: ReportSearchProps) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeField, setActiveField] = useState<
    "start_date" | "end_date" | null
  >(null);
  const [, setStartDate] = useState("");
  const [, setEndDate] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [outputMode, setOutputMode] = useState<"auto" | "manual">("auto");
  const [validationErrors, setValidationErrors] = useState<{
    weekday?: boolean;
    executionTime?: boolean;
    autoCreatePeriod?: boolean;
  }>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useToast();

  // Redux state for batch status
  const batchStatus = useSelector(
    (state: RootState) => state.reports.batchStatus
  );

  // Track previous values to detect changes
  const prevStartDateRef = useRef<string>("");
  const prevAutoCreatePeriodRef = useRef<string>("");
  const initialLoadCompleted = useRef(false);

  // Parse period back to start/end dates if it exists
  const parsePeriod = (period?: string) => {
    if (period && period.includes("~")) {
      const [startDate, endDate] = period.split("~");
      return { start_date: startDate.trim(), end_date: endDate.trim() };
    }
    return { start_date: "", end_date: "" };
  };

  const { start_date: initialStartDate, end_date: initialEndDate } =
    parsePeriod(currentSearchParams.period);

  const {
    control,
    handleSubmit,
    // reset,
    setValue,
    register,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      autoGenerate: currentSearchParams.autoGenerate || false,
      weekday: currentSearchParams.weekday || "",
      executionTime: currentSearchParams.executionTime || "",
      autoCreatePeriod: currentSearchParams.autoCreatePeriod || "",
      start_date: initialStartDate || "",
      end_date: initialEndDate || "",
    },
  });

  // Watch autoGenerate to sync with local state if needed
  const autoGenerateWatch = watch("autoGenerate");

  // セレクトが常に空になるため、バリデーションを簡素化
  const canEnableAutoGenerate = true;

  // Fetch batch status when component mounts or property_id changes
  useEffect(() => {
    if (property_id) {
      dispatch(fetchBatchStatus({ property_id }));
    }
  }, [dispatch, property_id]);

  // Update form values when batch status is loaded
  useEffect(() => {
    if (batchStatus.data && !batchStatus.loading && !initialLoadCompleted.current) {
      const data = batchStatus.data;
      
      // 設定の有無に関わらず、セレクトボックスは常に空の状態にする
      setValue("startDate", "");
      setValue("autoCreatePeriod", "");
      setValue("autoGenerate", false);
      setValue("weekday", "");
      setValue("executionTime", "");
      setValue("start_date", "");
      
      // previousRef は設定がある場合のみセット（更新検知用）
      if (data.id) {
        prevStartDateRef.current = data.start_date || "";
        prevAutoCreatePeriodRef.current = data.auto_create_period || "";
      } else {
        prevStartDateRef.current = "";
        prevAutoCreatePeriodRef.current = "";
      }
      
      initialLoadCompleted.current = true;
    }
  }, [batchStatus.data, batchStatus.loading]);

  useEffect(() => {
    if (initialLoadCompleted.current) {
      const { start_date, end_date } = parsePeriod(currentSearchParams.period);
      setValue("autoGenerate", currentSearchParams.autoGenerate ?? false);
      setValue("weekday", currentSearchParams.weekday || "");
      setValue("executionTime", currentSearchParams.executionTime || "");
      setValue("autoCreatePeriod", currentSearchParams.autoCreatePeriod || "");
      setValue("start_date", start_date || "");
      setValue("end_date", end_date || "");
    }
  }, [currentSearchParams]);

  // Auto-disable autoGenerate when required fields become empty
  useEffect(() => {
    if (initialLoadCompleted.current && autoGenerateWatch && !canEnableAutoGenerate) {
      setValue("autoGenerate", false);
    }
  }, [autoGenerateWatch, canEnableAutoGenerate]);

  // Watch values to prevent infinite loops
  const weekdayValue = watch("weekday");
  const executionTimeValue = watch("executionTime");
  const autoCreatePeriodValue = watch("autoCreatePeriod");

  // バリデーションエラーをクリア（フィールドに値が設定されたとき）
  useEffect(() => {
    setValidationErrors(prev => ({
      ...prev,
      weekday: prev.weekday && !weekdayValue,
      executionTime: prev.executionTime && !executionTimeValue,
      autoCreatePeriod: prev.autoCreatePeriod && !autoCreatePeriodValue,
    }));
  }, [weekdayValue, executionTimeValue, autoCreatePeriodValue]);

  // セレクトボックスを常に空にするため、自動更新のuseEffectは無効化
  // （更新は「更新」ボタンでのみ行う）

  const handleCreateNew = () => {
    const startDate = watch("start_date");
    const endDate = watch("end_date");

    if (onCreateNew) {
      // 期間が設定されている場合は期間情報を渡す
      if (startDate && endDate) {
        onCreateNew({ start_date: startDate, end_date: endDate });
      } else {
        onCreateNew();
      }
    }
  };

  const handleBatchConfirm = async () => {
    if (!property_id) {
      addToast({
        type: "error",
        message: "物件IDが見つかりません。",
      });
      return;
    }

    // 最新のフォーム値を取得
    const currentValues = watch();
    const currentWeekday = currentValues.weekday;
    const currentExecutionTime = currentValues.executionTime;
    const currentAutoCreatePeriod = currentValues.autoCreatePeriod;

    // バリデーション - いずれかが空の場合
    if (!currentWeekday || !currentExecutionTime || !currentAutoCreatePeriod) {
      // バリデーションエラー状態を設定
      setValidationErrors({
        weekday: !currentWeekday,
        executionTime: !currentExecutionTime,
        autoCreatePeriod: !currentAutoCreatePeriod,
      });
      
      addToast({
        type: "error",
        message: "設定項目を全て入力すると自動出力を設定できます",
      });
      return;
    }

    // バリデーション成功時はエラー状態をクリア
    setValidationErrors({});

    console.log('Current form values:', {
      weekday: currentWeekday,
      executionTime: currentExecutionTime,
      autoCreatePeriod: currentAutoCreatePeriod
    });

    try {
      const isUpdate = batchStatus.data && batchStatus.data.id !== null && batchStatus.data.id !== undefined;
      
      console.log('batchStatus.data:', batchStatus.data);
      console.log('isUpdate:', isUpdate);
      
      if (isUpdate) {
        // 既存設定の更新
        console.log('Calling updateBatchStatus (PUT)');
        await dispatch(
          updateBatchStatus({
            batch_id: batchStatus.data.id,
            start_date: currentWeekday ? getNextWeekday(currentWeekday) : undefined,
            auto_create_period: currentAutoCreatePeriod,
            auto_generate: true,
            weekday: currentWeekday,
            executionTime: currentExecutionTime,
          })
        ).unwrap();
      } else {
        // 新規設定の作成
        console.log('Calling setupReportBatch (POST)');
        await dispatch(
          setupReportBatch({
            property_id: property_id,
            weekday: currentWeekday,
            executionTime: currentExecutionTime,
            start_date: currentWeekday ? getNextWeekday(currentWeekday) : undefined,
            auto_create_period: currentAutoCreatePeriod,
            auto_generate: true,
          })
        ).unwrap();
      }

      setValue("autoGenerate", true);

      // 成功時にバリデーションエラーをクリア
      setValidationErrors({});

      addToast({
        type: "success",
        message: isUpdate 
          ? "報告書自動生成の設定を更新しました。" 
          : "報告書自動生成の設定が完了しました。",
      });

      // 設定後にバッチステータスを再取得
      if (property_id) {
        dispatch(fetchBatchStatus({ property_id }));
      }
    } catch (error) {
      console.error("Error setting up batch:", error);
      addToast({
        type: "error",
        message: "報告書自動生成の設定中にエラーが発生しました。",
      });
    }
  };

  // 削除ハンドラー
  const handleDeleteBatch = async () => {
    if (!batchStatus.data?.id) {
      addToast({
        type: "error",
        message: "削除対象のスケジュールが見つかりません。",
      });
      return;
    }

    try {
      await dispatch(
        deleteBatchStatus({
          batch_id: batchStatus.data.id,
        })
      ).unwrap();
      
      addToast({
        type: "success",
        message: "報告書自動生成スケジュールを削除しました。",
      });
      
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting batch:", error);
      addToast({
        type: "error",
        message: "スケジュール削除中にエラーが発生しました。",
      });
    }
  };

  // onSubmitのautoモード部分で曜日→日付変換
  const onSubmit = (data: FormData) => {
    let searchParams: SearchParams = {};

    if (outputMode === "manual") {
      // Manual mode: Use period search
      const period =
        data.start_date && data.end_date
          ? `${data.start_date}~${data.end_date}`
          : undefined;
      searchParams = {
        period: period,
      };
      // Manual modeの場合のみここで検索実行
      const cleanedParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== undefined)
      );
      onSearch(cleanedParams);
    } else {
      // Auto mode: 直接バッチ設定を実行
      if (data.weekday && data.executionTime && data.autoCreatePeriod) {
        handleBatchConfirm();
      } else {
        addToast({
          type: "error",
          message: "すべての項目を選択してください。",
        });
      }
    }
  };

  return (
    <Box>
      <Box
        sx={{
          my: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SectionTitle title={"出力設定"} addBorder={false} />
      </Box>

      {/* Batch Status Card */}
      {batchStatus.data && batchStatus.data.id && (
        <Box
          sx={{
            display: "flex",
            padding: "8px 10px",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            mb: 2,
            width: { xs: "90%", md: "45%" },
          }}
        >
          {/* Document Icon */}
          <Box sx={{ 
            display: "flex",
            width: "20px", 
            height: "20px", 
            padding: "4px",
            justifyContent: "center",
            alignItems: "center",
            aspectRatio: "1/1",
            backgroundColor: "#D4F2FA",
            borderRadius: "8px",
            flexShrink: 0 
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8.87389 12.5539H15.1306C15.3208 12.5539 15.4846 12.4854 15.6219 12.3484C15.7591 12.2112 15.8276 12.0465 15.8276 11.8541C15.8276 11.6618 15.7591 11.4972 15.6219 11.3604C15.4846 11.2234 15.3208 11.1549 15.1306 11.1549H8.87389C8.68006 11.1549 8.51464 11.2235 8.37764 11.3609C8.24064 11.4982 8.17214 11.662 8.17214 11.8524C8.17214 12.0464 8.24064 12.2118 8.37764 12.3486C8.51464 12.4855 8.68006 12.5539 8.87389 12.5539ZM8.87389 15.2846H15.1306C15.3208 15.2846 15.4846 15.217 15.6219 15.0816C15.7591 14.9461 15.8276 14.7814 15.8276 14.5874C15.8276 14.3934 15.7591 14.228 15.6219 14.0911C15.4846 13.9541 15.3208 13.8856 15.1306 13.8856H8.87389C8.68006 13.8856 8.51464 13.9542 8.37764 14.0914C8.24064 14.2284 8.17214 14.3939 8.17214 14.5879C8.17214 14.7819 8.24064 14.9465 8.37764 15.0819C8.51464 15.217 8.68006 15.2846 8.87389 15.2846ZM8.87389 18.0204H12.1306C12.3208 18.0204 12.4846 17.9518 12.6219 17.8146C12.7591 17.6776 12.8276 17.5129 12.8276 17.3204C12.8276 17.128 12.7591 16.9635 12.6219 16.8266C12.4846 16.6898 12.3208 16.6214 12.1306 16.6214H8.87389C8.68006 16.6214 8.51464 16.69 8.37764 16.8274C8.24064 16.9647 8.17214 17.1285 8.17214 17.3189C8.17214 17.5129 8.24064 17.6783 8.37764 17.8151C8.51464 17.952 8.68006 18.0204 8.87389 18.0204ZM6.38639 21.2991C5.91372 21.2991 5.51147 21.1332 5.17964 20.8014C4.84764 20.4694 4.68164 20.0671 4.68164 19.5946V4.40762C4.68164 3.93512 4.84764 3.53287 5.17964 3.20087C5.51147 2.86904 5.91439 2.70312 6.38839 2.70312H13.5421C13.7716 2.70312 13.9904 2.74654 14.1984 2.83337C14.4064 2.92021 14.5909 3.04229 14.7519 3.19962L18.8084 7.24988C18.9694 7.41038 19.0946 7.59546 19.1839 7.80512C19.2734 8.01462 19.3181 8.23504 19.3181 8.46637V19.5924C19.3181 20.0664 19.1521 20.4694 18.8201 20.8014C18.4883 21.1332 18.0861 21.2991 17.6134 21.2991H6.38639ZM17.9191 8.46062H14.8479C14.4904 8.46062 14.1865 8.33546 13.9361 8.08512C13.6856 7.83479 13.5604 7.53079 13.5604 7.17312V4.10212H6.38839C6.31139 4.10212 6.24089 4.13412 6.17689 4.19812C6.11272 4.26229 6.08064 4.33287 6.08064 4.40987V19.5924C6.08064 19.6694 6.11272 19.74 6.17689 19.8041C6.24089 19.8681 6.31139 19.9001 6.38839 19.9001H17.6114C17.6884 19.9001 17.7589 19.8681 17.8229 19.8041C17.8871 19.74 17.9191 19.6694 17.9191 19.5924V8.46062Z" fill="#0B9DBD"/>
            </svg>
          </Box>

          {/* Text Content */}
          <Typography
            sx={{
              flex: 1,
              fontSize:{xs: 12, sm: 14},
              color: "#3E3E3E",
              fontWeight: 400,
            }}
          >
            次回 報告書作成日時：
            <span style={{ color: "#0B9DBD", fontWeight: 700 }}>
              {batchStatus.data.next_execution_date && batchStatus.data.execution_time && batchStatus.data.weekday
                ? formatNextExecutionDate(
                    batchStatus.data.next_execution_date,
                    batchStatus.data.execution_time,
                    batchStatus.data.weekday
                  )
                : '設定なし'}
            </span>
          </Typography>

          {/* Delete Button */}
          <Box
            sx={{
              width: "20px",
              height: "20px",
              flexShrink: 0,
              cursor: "pointer",
              "&:hover": { opacity: 0.7 },
            }}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9.99977 10.8798L5.77227 15.1076C5.65685 15.2228 5.51178 15.2819 5.33706 15.2846C5.16247 15.2873 5.01477 15.2282 4.89393 15.1076C4.77324 14.9867 4.71289 14.8403 4.71289 14.6684C4.71289 14.4964 4.77324 14.3501 4.89393 14.2292L9.12164 10.0017L4.89393 5.77422C4.77865 5.6588 4.71963 5.51373 4.71685 5.33901C4.71421 5.16443 4.77324 5.01672 4.89393 4.89589C5.01477 4.77519 5.16115 4.71484 5.3331 4.71484C5.50504 4.71484 5.65143 4.77519 5.77227 4.89589L9.99977 9.12359L14.2273 4.89589C14.3427 4.78061 14.4878 4.72158 14.6625 4.7188C14.8371 4.71616 14.9848 4.77519 15.1056 4.89589C15.2263 5.01672 15.2866 5.16311 15.2866 5.33505C15.2866 5.507 15.2263 5.65339 15.1056 5.77422L10.8779 10.0017L15.1056 14.2292C15.2209 14.3446 15.2799 14.4897 15.2827 14.6644C15.2853 14.839 15.2263 14.9867 15.1056 15.1076C14.9848 15.2282 14.8384 15.2886 14.6664 15.2886C14.4945 15.2886 14.3481 15.2282 14.2273 15.1076L9.99977 10.8798Z" fill="#3E3E3E"/>
            </svg>
          </Box>
        </Box>
      )}

      {/* Output Toggle Button */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-start" }}>
        <OutputToggleButton
          value={outputMode}
          onChange={setOutputMode}
          leftLabel="自動出力設定"
          rightLabel="手動出力設定"
        />
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        {outputMode === "manual" ? (
          // Manual output mode content
          <Box>
            {/* Date Picker Section - New UI */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                margin: "10px 0 20px 0",
              }}
            >
              <Typography
                align="left"
                fontSize={{ lg: 12, xs: 10 }}
                marginBottom="8px"
                color="#3E3E3E"
                fontWeight={700}
                sx={{
                  whiteSpace: "nowrap",
                }}
              >
                期間
              </Typography>
              <Box sx={{ position: "relative", display: "flex", gap: "10px" }}>
                <Controller
                  {...register("start_date")}
                  control={control}
                  render={({ field: { onChange } }) => (
                    <CustomDateTimePicker
                      onChange={(date) => {
                        onChange(date);
                      }}
                      width={`${isMobile ? "109px" : "150px"}`}
                      showTime={false}
                      maxDate={dayjs()}
                      minDate={dayjs().subtract(150, "year")}
                    />
                  )}
                />

                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "12px",
                    color: "#3E3E3E",
                    fontWeight: "700",
                  }}
                >
                  〜
                </Typography>

                <Controller
                  {...register("end_date")}
                  control={control}
                  render={({ field: { onChange } }) => (
                    <CustomDateTimePicker
                      onChange={(date) => {
                        onChange(date);
                      }}
                      width={`${isMobile ? "109px" : "150px"}`}
                      showTime={false}
                      maxDate={dayjs()}
                      minDate={dayjs().subtract(150, "year")}
                    />
                  )}
                />

                {showCalendar && (
                  <Box sx={{ position: "absolute", zIndex: "99", top: "30px" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <CustomDatePicker
                        onDateConfirm={(date: any) => {
                          const formattedDate = date.format("YYYY-MM-DD");

                          if (activeField) {
                            setValue(activeField, formattedDate);
                          }

                          setShowCalendar(false);
                          setActiveField(null);

                          if (activeField === "start_date") {
                            setStartDate(date.toISOString());
                          } else {
                            setEndDate(date.toISOString());
                          }
                        }}
                        onCancel={() => {
                          setShowCalendar(false);
                          setActiveField(null);
                          setStartDate("");
                          setEndDate("");
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                )}
                {/* Desktop Report Creation Button - positioned on the right */}
                {!isMobile && (
                  <Button
                    type="button"
                    variant="contained"
                    disableElevation
                    onClick={handleCreateNew}
                    sx={{
                      bgcolor: "#4AABCF",
                      borderRadius: 2,
                      whiteSpace: "nowrap",
                      fontSize: { lg: "14px", xs: "10px" },
                      ml: 2,
                    }}
                  >
                    報告書作成
                  </Button>
                )}
              </Box>
            </Box>

            {/* Mobile Report Creation Button - For manual mode */}
            {isMobile && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  type="button"
                  variant="contained"
                  disableElevation
                  onClick={handleCreateNew}
                  sx={{
                    bgcolor: "#4AABCF",
                    borderRadius: 2,
                    whiteSpace: "nowrap",
                    fontSize: "11px",
                    fontWeight: "600",
                    height: "30px",
                    px: 2.5,
                    minWidth: "88px",
                    lineHeight: 1.2,
                    boxShadow: "0 1px 3px rgba(74, 171, 207, 0.2)",
                    "&:hover": {
                      bgcolor: "#3a9ac7",
                      boxShadow: "0 2px 6px rgba(74, 171, 207, 0.3)",
                    },
                    "&:active": {
                      bgcolor: "#2e8bb5",
                    },
                  }}
                >
                  報告書作成
                </Button>
              </Box>
            )}


          </Box>
        ) : (
          // Auto output mode content
          <Box>
            {/* Auto Generate Section */}
            <Box sx={{ mt: 3, mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: { lg: 2, xs: 1 },
                }}
              >
                <CustomSelect
                  label="曜日"
                  name="weekday"
                  control={control}
                  options={weekdayOptions}
                  defaultValue=""
                  required={autoGenerateWatch === true}
                  width="120px"
                  XsWidth="90px"
                  labelPosition="top"
                />

                <CustomSelect
                  label="期間（週）"
                  name="autoCreatePeriod"
                  control={control}
                  options={option2}
                  defaultValue=""
                  required={autoGenerateWatch === true}
                  width="120px"
                  XsWidth="90px"
                  labelPosition="top"
                />

                <CustomSelect
                  label="時刻"
                  name="executionTime"
                  control={control}
                  options={timeOptions}
                  defaultValue=""
                  required={autoGenerateWatch === true}
                  width="120px"
                  XsWidth="90px"
                  labelPosition="top"
                />

                {/* 設定を保存/更新ボタンを横に配置 */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, }}>
                  <Button
                    type="button"
                    variant="contained"
                    disableElevation
                    sx={{
                      bgcolor: "#4AABCF",
                      borderRadius: 2,
                      whiteSpace: 'nowrap',
                      fontSize: { lg: '14px', xs: '12px' },
                    }}
                    onClick={handleBatchConfirm}
                  >
                    {batchStatus.data && batchStatus.data.id ? '更新' : '設定を完了'}
                  </Button>
                </Box>
              </Box>
              
              {/* エラーメッセージをセレクトボックス直下に表示 */}
              {(validationErrors.weekday || validationErrors.executionTime || validationErrors.autoCreatePeriod) && (
                <Typography
                  color="error"
                  fontSize={12}
                  sx={{ mt: 0.5, ml: 0.5 }}
                >
                  設定項目を全て入力すると自動出力を設定できます
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </form>

      {/* Delete Confirmation Modal */}
      <CustomModal
        openModal={isDeleteModalOpen}
        handleCloseModal={() => setIsDeleteModalOpen(false)}
        title="スケジュールの削除"
        modalType="flexColModal"
        addTitleBorder="false"
      >
        <Box sx={{ pt: 0 }}>
          <Typography
            align="left"
            fontSize={14}
            fontWeight={400}
            sx={{ marginTop: "20px", marginBottom: "30px", lineHeight: 1.6 }}
          >
            次回の報告書生成スケジュールを削除してよろしいですか？
          </Typography>

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <CustomButton
              label="戻る"
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              buttonCategory="cancel"
            />
            <CustomButton
              label="削除"
              onClick={handleDeleteBatch}
              buttonCategory="delete"
            />
          </Box>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default ReportSearch;
