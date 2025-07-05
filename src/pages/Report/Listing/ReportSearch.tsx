import { useEffect, useState } from "react";
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

interface SearchParams {
  autoGenerate?: boolean;
  weekStartDay?: string;
  autoCreatePeriod?: string;
  period?: string;
}

// Internal form state - includes separate date fields
interface FormData {
  autoGenerate?: boolean;
  weekStartDay?: string;
  autoCreatePeriod?: string;
  start_date?: string;
  end_date?: string;
}

interface ReportSearchProps {
  onSearch: (searchParams: SearchParams) => void;
  onClear: () => void;
  currentSearchParams?: SearchParams;
  onCreateNew?: () => void;
}

const option1 = [
  { label: "月曜日", value: "monday" },
  { label: "火曜日", value: "tuesday" },
  { label: "水曜日", value: "wednesday" },
  { label: "木曜日", value: "thursday" },
  { label: "金曜日", value: "friday" },
  { label: "土曜日", value: "saturday" },
  { label: "日曜日", value: "sunday" },
];

const option2 = [
  { label: "1週間ごと", value: "1週間ごと" },
  { label: "2週間ごと", value: "2週間ごと" },
];

const ReportSearch = ({
  onSearch,
  currentSearchParams = {},
  onCreateNew,
}: ReportSearchProps) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeField, setActiveField] = useState<
    "start_date" | "end_date" | null
  >(null);
  const [, setStartDate] = useState("");
  const [, setEndDate] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");

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
      weekStartDay: currentSearchParams.weekStartDay || "",
      autoCreatePeriod: currentSearchParams.autoCreatePeriod || "",
      start_date: initialStartDate || "",
      end_date: initialEndDate || "",
    },
  });

  // Watch autoGenerate to sync with local state if needed
  const autoGenerateWatch = watch("autoGenerate");

  // Watch weekStartDay and autoCreatePeriod to control autoGenerate availability
  const weekStartDayWatch = watch("weekStartDay");
  const autoCreatePeriodWatch = watch("autoCreatePeriod");

  // Check if both required fields have values
  const canEnableAutoGenerate = weekStartDayWatch && autoCreatePeriodWatch;

  useEffect(() => {
    const { start_date, end_date } = parsePeriod(currentSearchParams.period);
    setValue("autoGenerate", currentSearchParams.autoGenerate ?? false);
    setValue("weekStartDay", currentSearchParams.weekStartDay || "");
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

  const onSubmit = (data: FormData) => {
    // Combine start_date and end_date into period format
    const period =
      data.start_date && data.end_date
        ? `${data.start_date}~${data.end_date}`
        : undefined;

    const searchParams: SearchParams = {
      autoGenerate: data.autoGenerate,
      weekStartDay: data.weekStartDay || undefined,
      autoCreatePeriod: data.autoCreatePeriod || undefined,
      period: period,
    };
    // Only filter out undefined values, keep false values
    const cleanedParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== undefined)
    );

    if (searchParams.autoGenerate === true) {
      if (searchParams.weekStartDay && searchParams.autoCreatePeriod) {
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
                  onChange={onChange}
                  width={`${isMobile ? "92px" : "150px"}`}
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
                  onChange={onChange}
                  width={`${isMobile ? "92px" : "150px"}`}
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
            <Button
              type="button"
              variant="contained"
              disableElevation
              onClick={onCreateNew}
              sx={{
                bgcolor: "#4AABCF",
                borderRadius: 2,
                whiteSpace: "nowrap",
                fontSize: { lg: "14px", xs: "10px" },
              }}
            >
              報告書作成
            </Button>
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
              render={({ field: { onChange, value } }) => (
                <IPhoneSwitcher
                  checked={Boolean(value)}
                  onChange={(checked) => {
                    // Only allow turning ON if both required fields have values
                    if (checked && !canEnableAutoGenerate) {
                      return; // Don't allow turning ON
                    }
                    onChange(checked);
                  }}
                  disabled={!canEnableAutoGenerate && !value} // Disable when can't enable and currently off
                />
              )}
            />
          </Box>

          <Box sx={{ ml: 2 }}>
            <CustomSelect
              label="開始曜日"
              name="weekStartDay"
              control={control}
              options={option1}
              defaultValue=""
              required={autoGenerateWatch === true}
            />
          </Box>

          <Box sx={{ ml: { lg: 2, xs: 0 }, mt: { lg: 0, xs: 2 } }}>
            <CustomSelect
              label="自動作成期間"
              name="autoCreatePeriod"
              control={control}
              options={option2}
              defaultValue=""
              required={autoGenerateWatch === true}
            />
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default ReportSearch;
