import { useEffect, useState, useRef, useMemo } from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import SectionTitle from "../../../components/SectionTitle";
// import CustomTextField from '../../../components/CustomTextField';
import CustomSelect from "../../../components/CustomSelect";
import { useForm, Controller } from "react-hook-form";
import IPhoneSwitcher from "../../../components/IPhoneSwitcher";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CustomDatePicker } from "../../../components/DatePicker";
// import { ReportCalendarIcon } from "../../../common/icons";
import CustomDateTimePicker from "../../../components/CustomDateTimePicker";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
  setupReportBatch,
  fetchBatchStatus,
  updateBatchStatus,
} from "../../../store/reportSlice";
import { useToast } from "../../../components/Toastify";
import CustomModal from "../../../components/CustomModal";
import CustomButton from "../../../components/CustomButton";
import { useTheme } from "@mui/material";
interface SearchParams {
  autoGenerate?: boolean;
  startDate?: string;
  autoCreatePeriod?: string;
  period?: string;
}

// Internal form state - includes separate date fields
interface FormData {
  autoGenerate?: boolean;
  startDate?: string;
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

// 自動作成期間に応じた日付選択肢を動的に生成
const generateStartDateOptions = (period?: string) => {
  const options = [];
  let days = 7; // デフォルトは7日

  // 期間に応じて日数を設定
  if (period === "1週間ごと") {
    days = 7;
  } else if (period === "2週間ごと") {
    days = 14;
  }

  const startDate = dayjs().add(7, "day"); // 一週間後から

  for (let i = 0; i < days; i++) {
    const date = startDate.add(i, "day");
    const weekdayNames = ["日", "月", "火", "水", "木", "金", "土"];
    const weekday = weekdayNames[date.day()];

    options.push({
      label: `${date.format("YYYY/MM/DD")}（${weekday}）`,
      value: date.format("YYYY-MM-DD"),
    });
  }

  return options;
};

const option2 = [
  { label: "1週間ごと", value: "1週間ごと" },
  { label: "2週間ごと", value: "2週間ごと" },
];

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
  const [isConfirmBatchOpen, setIsConfirmBatchOpen] = useState(false);
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
      startDate: currentSearchParams.startDate || "",
      autoCreatePeriod: currentSearchParams.autoCreatePeriod || "",
      start_date: initialStartDate || "",
      end_date: initialEndDate || "",
    },
  });

  // Watch autoGenerate to sync with local state if needed
  const autoGenerateWatch = watch("autoGenerate");

  // Watch startDate and autoCreatePeriod to control autoGenerate availability
  const startDateWatch = watch("startDate");
  const autoCreatePeriodWatch = watch("autoCreatePeriod");

  // 自動作成期間に応じて開始日のオプションを動的に生成
  const startDateOptions = useMemo(() => {
    return generateStartDateOptions(autoCreatePeriodWatch);
  }, [autoCreatePeriodWatch]);

  // Check if both required fields have values
  const canEnableAutoGenerate = startDateWatch && autoCreatePeriodWatch;

  // Fetch batch status when component mounts or property_id changes
  useEffect(() => {
    if (property_id) {
      dispatch(fetchBatchStatus({ property_id }));
    }
  }, [dispatch, property_id]);

  // Update form values when batch status is loaded
  useEffect(() => {
    if (batchStatus.data && !batchStatus.loading) {
      const data = batchStatus.data;
      if (data.start_date) {
        setValue("startDate", data.start_date);
        prevStartDateRef.current = data.start_date;
      }
      if (data.auto_create_period) {
        setValue("autoCreatePeriod", data.auto_create_period);
        prevAutoCreatePeriodRef.current = data.auto_create_period;
      }
      if (typeof data.auto_generate === "boolean") {
        setValue("autoGenerate", data.auto_generate);
      }

      // 次のレンダーサイクルで初期ロード完了フラグを設定
      setTimeout(() => {
        initialLoadCompleted.current = true;
      }, 0);
    }
  }, [batchStatus.data, batchStatus.loading, setValue]);

  useEffect(() => {
    const { start_date, end_date } = parsePeriod(currentSearchParams.period);
    setValue("autoGenerate", currentSearchParams.autoGenerate ?? false);
    setValue("startDate", currentSearchParams.startDate || "");
    setValue("autoCreatePeriod", currentSearchParams.autoCreatePeriod || "");
    setValue("start_date", start_date || "");
    setValue("end_date", end_date || "");
  }, [currentSearchParams, setValue]);

  // Auto-disable autoGenerate when required fields become empty
  useEffect(() => {
    if (autoGenerateWatch && !canEnableAutoGenerate) {
      setValue("autoGenerate", false);
    }
  }, [autoGenerateWatch, canEnableAutoGenerate, setValue]);

  // Detect changes in startDate and autoCreatePeriod and update via PUT API
  useEffect(() => {
    if (
      !initialLoadCompleted.current ||
      !property_id ||
      !batchStatus.data?.id
    ) {
      return;
    }

    const hasStartDateChanged =
      prevStartDateRef.current !== (startDateWatch ?? "");
    const hasAutoCreatePeriodChanged =
      prevAutoCreatePeriodRef.current !== (autoCreatePeriodWatch ?? "");

    if (hasStartDateChanged || hasAutoCreatePeriodChanged) {
      // Update the batch status via PUT API
      const updateBatch = async () => {
        try {
          await dispatch(
            updateBatchStatus({
              batch_id: batchStatus.data.id,
              start_date: startDateWatch ?? "",
              auto_create_period: autoCreatePeriodWatch ?? "",
              auto_generate: autoGenerateWatch ?? false,
            })
          ).unwrap();

          addToast({
            type: "success",
            message: "報告書自動生成の設定を更新しました。",
          });
        } catch (error) {
          console.error("Error updating batch status:", error);
          addToast({
            type: "error",
            message: "報告書自動生成の設定更新中にエラーが発生しました。",
          });
        }
      };

      updateBatch();

      // Update the previous values
      prevStartDateRef.current = startDateWatch ?? "";
      prevAutoCreatePeriodRef.current = autoCreatePeriodWatch ?? "";
    }
  }, [
    startDateWatch,
    autoCreatePeriodWatch,
    autoGenerateWatch,
    property_id,
    batchStatus.data?.id,
    dispatch,
    addToast,
  ]);

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

  const handleToggleChange = async (checked: boolean) => {
    if (checked && canEnableAutoGenerate) {
      // トグルをONにしようとした場合は確認モーダルを表示
      setIsConfirmBatchOpen(true);
    } else if (!checked) {
      if (!property_id || !batchStatus.data?.id) {
        console.error(
          "Missing IDs - property_id:",
          property_id,
          "batch_id:",
          batchStatus.data?.id
        );
        addToast({
          type: "error",
          message: "物件IDまたはバッチIDが見つかりません。",
        });
        return;
      }

      try {
        await dispatch(
          updateBatchStatus({
            batch_id: batchStatus.data.id,
            start_date: startDateWatch ?? "",
            auto_create_period: autoCreatePeriodWatch ?? "",
            auto_generate: false,
          })
        ).unwrap();

        setValue("autoGenerate", false);

        addToast({
          type: "success",
          message: "報告書自動生成をオフにしました。",
        });
      } catch (error) {
        console.error("Error updating batch status:", error);
        addToast({
          type: "error",
          message: "報告書自動生成の設定更新中にエラーが発生しました。",
        });
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

    try {
      await dispatch(
        setupReportBatch({
          property_id: property_id,
          start_date: startDateWatch,
          auto_create_period: autoCreatePeriodWatch,
          auto_generate: true,
        })
      ).unwrap();

      setValue("autoGenerate", true);
      setIsConfirmBatchOpen(false);

      addToast({
        type: "success",
        message: "報告書自動生成の設定が完了しました。",
      });
    } catch (error) {
      console.error("Error setting up batch:", error);
      addToast({
        type: "error",
        message: "報告書自動生成の設定中にエラーが発生しました。",
      });
    }
  };

  const handleBatchCancel = () => {
    setIsConfirmBatchOpen(false);
    // トグルはOFFのままにする
  };

  const onSubmit = (data: FormData) => {
    // Combine start_date and end_date into period format
    const period =
      data.start_date && data.end_date
        ? `${data.start_date}~${data.end_date}`
        : undefined;

    const searchParams: SearchParams = {
      autoGenerate: data.autoGenerate,
      startDate: data.startDate || undefined,
      autoCreatePeriod: data.autoCreatePeriod || undefined,
      period: period,
    };
    // Only filter out undefined values, keep false values
    const cleanedParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== undefined)
    );

    if (searchParams.autoGenerate === true) {
      if (searchParams.startDate && searchParams.autoCreatePeriod) {
        onSearch(cleanedParams);
      }
    } else {
      onSearch(cleanedParams);
    }
  };

  // const clearSearch = () => {
  //   // const today = new Date().toISOString().split('T')[0];
  //   reset({
  //     autoGenerate: false,
  //     weekStartDay: "",
  //     autoCreatePeriod: "",
  //     start_date: "",
  //     end_date: "",
  //   });
  //   setStartDate('');
  //   setEndDate('');
  //   onClear();
  // };

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
        <SectionTitle title={"報告書管理"} addBorder={false} />
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Date Picker Section - New UI */}
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
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
            }}
          >
            期間で検索
          </Typography>
          {/*           
          <span style={{paddingRight: '10px', display:'flex'}}>
            <ReportCalendarIcon/>
          </span>
           */}
          <Box sx={{ position: "relative", display: "flex", gap: "10px" }}>
            {/* <CustomTextField
              fullWidth
              label=""
              placeholder="開始日"
              {...register('start_date')}
              onClick={() => {
                setActiveField('start_date');
                setShowCalendar(true);
              }}
              InputProps={{ readOnly: true }}
            /> */}

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
          </Box>

          <Box sx={{ ml: { lg: 3, xs: 1 } }}>
            {isMobile ? (
              <></>
            ) : (
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
                }}
              >
                報告書作成
              </Button>
            )}
            {/* <Button
              type="button"
              variant="contained"
              disableElevation
              onClick={clearSearch}
              sx={{ 
                bgcolor: '#4AABCF', 
                borderRadius: 2,
                ml: 1,
                fontSize: '14px'
              }}
            >
              クリア
            </Button> */}
          </Box>
        </Box>

        {/* Auto Generate Section */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            mb: 2,
            mt: 3,
          }}
        >
          {isMobile ? (
            <CustomSelect
              label="開始日"
              name="startDate"
              control={control}
              options={startDateOptions}
              defaultValue=""
              required={autoGenerateWatch === true}
              width="150px"
              XsWidth="100px"
            />
          ) : (
            <>
              <Typography
                sx={{
                  width: { lg: "104px" },
                  fontSize: { lg: "14px", xs: "10px" },
                  fontWeight: "bold",
                }}
              >
                報告書自動作成
              </Typography>

              <Box sx={{ ml: { lg: 0, xs: 1 } }}>
                <Controller
                  name="autoGenerate"
                  control={control}
                  render={({ field: { value } }) => (
                    <IPhoneSwitcher
                      checked={Boolean(value)}
                      onChange={handleToggleChange}
                      disabled={!canEnableAutoGenerate && !value} // Disable when can't enable and currently off
                    />
                  )}
                />
              </Box>
            </>
          )}

          <Box sx={{ ml: 2 }}>
            <CustomSelect
              label="自動作成期間"
              name="autoCreatePeriod"
              control={control}
              options={option2}
              defaultValue=""
              required={autoGenerateWatch === true}
            />
          </Box>

          <Box
            sx={{
              ml: { lg: 2, xs: 0 },
              mt: { lg: 0, xs: 2 },
              display: "flex",
              alignItems: "flex-end",
              gap: { lg: 0, xs: 1.5 },
            }}
          >
            {isMobile ? (
              <>
                <Typography
                  sx={{
                    width: { lg: "104px" },
                    fontSize: { lg: "14px", xs: "10px" },
                    fontWeight: "bold",
                    mb: 0.5,
                    mt: 1,
                  }}
                >
                  報告書自動作成
                </Typography>

                <Box sx={{ ml: { lg: 0, xs: 1 } }}>
                  <Controller
                    name="autoGenerate"
                    control={control}
                    render={({ field: { value } }) => (
                      <IPhoneSwitcher
                        checked={Boolean(value)}
                        onChange={handleToggleChange}
                        disabled={!canEnableAutoGenerate && !value} // Disable when can't enable and currently off
                      />
                    )}
                  />
                </Box>
              </>
            ) : (
              <CustomSelect
                label="開始日"
                name="startDate"
                control={control}
                options={startDateOptions}
                defaultValue=""
                required={autoGenerateWatch === true}
                width="150px"
                XsWidth="100px"
              />
            )}

            {/* Mobile Report Creation Button - Aligned with select box */}
            {isMobile && (
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
                  height: "30px", // Match typical CustomSelect height
                  px: 2.5,
                  ml: 3,
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
            )}
          </Box>
        </Box>
      </form>

      {/* 報告書自動生成確認モーダル */}
      <CustomModal
        openModal={isConfirmBatchOpen}
        handleCloseModal={handleBatchCancel}
        title="報告書自動生成の確認"
        modalType="otherModal"
        addTitleBorder="true"
      >
        <Box sx={{ pt: 0 }}>
          <Typography
            align="left"
            fontSize={14}
            fontWeight={400}
            sx={{ marginBottom: "20px", lineHeight: 1.6 }}
          >
            報告書自動生成を下記のスケジュールで実施します
          </Typography>

          <Box
            sx={{
              marginBottom: "20px",
              padding: "16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <Typography fontSize={12} sx={{ marginBottom: "8px" }}>
              <strong>開始日付：</strong>
              {startDateWatch
                ? startDateOptions.find(
                    (opt: any) => opt.value === startDateWatch
                  )?.label
                : "未選択"}
            </Typography>
            <Typography fontSize={12}>
              <strong>自動作成期間：</strong>
              {autoCreatePeriodWatch || "未選択"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <CustomButton
              label="戻る"
              onClick={handleBatchCancel}
              sx={{
                width: "100px",
                height: "40px",
                backgroundColor: "#989898 !important",
              }}
            />
            <CustomButton
              label="承認"
              onClick={handleBatchConfirm}
              sx={{
                width: "100px",
                height: "40px",
                backgroundColor: "#4AA3C9",
              }}
            />
          </Box>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default ReportSearch;
