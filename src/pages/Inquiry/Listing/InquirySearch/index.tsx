import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useForm, Controller } from "react-hook-form";
import CustomButton from "../../../../components/CustomButton";
import CustomSelect from "../../../../components/CustomSelect";
import CustomTextField from "../../../../components/CustomTextField";
import CustomDateTimePicker from "../../../../components/CustomDateTimePicker";
import dayjs from "dayjs";
import { getEmployeeNames } from "../../../../store/employeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";

interface SearchParams {
  firstName?: string;
  lastName?: string;
  inquiryTimestamp?: string;
  inquiryMethod?: string;
  employeeId?: string;
}

interface InquirySearchProps {
  onSearch: (searchParams: SearchParams) => void;
  onClear: () => void;
  currentSearchParams?: SearchParams;
  totalCount?: any;
}

const InquirySearch = ({
  onSearch,
  onClear,
  currentSearchParams = {},
  totalCount,
}: InquirySearchProps) => {
  const { control, handleSubmit, reset, setValue } = useForm<SearchParams>({
    defaultValues: {
      firstName: currentSearchParams.firstName || "",
      lastName: currentSearchParams.lastName || "",
      inquiryTimestamp: currentSearchParams.inquiryTimestamp || "",
      inquiryMethod: currentSearchParams.inquiryMethod || "指定なし",
      employeeId: currentSearchParams.employeeId || "指定なし",
    },
  });

  const dispatch = useDispatch<AppDispatch>();
  const { data: employeeNames, loading: employeeNamesLoading } = useSelector(
    (state: RootState) => state.employees.names
  );

  useEffect(() => {
    setValue("firstName", currentSearchParams.firstName || "");
    setValue("lastName", currentSearchParams.lastName || "");
    setValue("inquiryTimestamp", currentSearchParams.inquiryTimestamp || "");
    setValue("inquiryMethod", currentSearchParams.inquiryMethod || "指定なし");
    setValue("employeeId", currentSearchParams.employeeId || "指定なし");
  }, [currentSearchParams, setValue]);

  // 初期化時に「指定なし」を確実に表示
  useEffect(() => {
    if (!currentSearchParams.inquiryMethod) {
      setValue("inquiryMethod", "指定なし");
    }
    if (!currentSearchParams.employeeId) {
      setValue("employeeId", "指定なし");
    }
  }, [currentSearchParams, setValue]);

  const inquiryMethodOptions = [
    { label: "SUUMO", value: "SUUMO" },
    { label: "電話", value: "電話" },
    { label: "その他", value: "その他" },
    { label: "指定なし", value: "指定なし" },
  ];

  const employeeOptions = [
    ...(employeeNames?.map((employee: any) => ({
      value: employee.id,
      label: employee.first_name + " " + employee.family_name,
    })) || []),
    { label: "指定なし", value: "指定なし" },
  ];

  const convertDateToISO = (dateString: string): string => {
    if (!dateString) return dateString;

    if (dateString.includes("T")) return dateString;

    const date = new Date(dateString + "T00:00:00.000Z");
    return date.toISOString();
  };

  const onSubmit = (data: SearchParams) => {
    const searchParams: SearchParams = {
      firstName: data.firstName?.trim() || undefined,
      lastName: data.lastName?.trim() || undefined,
      inquiryTimestamp: data.inquiryTimestamp
        ? convertDateToISO(data.inquiryTimestamp)
        : undefined,
      inquiryMethod:
        data.inquiryMethod && data.inquiryMethod !== "指定なし"
          ? data.inquiryMethod
          : undefined,
      employeeId:
        data.employeeId && data.employeeId !== "指定なし"
          ? data.employeeId
          : undefined,
    };

    // Remove undefined values to clean up the search params
    const cleanedParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== undefined)
    );

    onSearch(cleanedParams);
  };

  useEffect(() => {
    dispatch(getEmployeeNames({}));
  }, [dispatch]);

  const clearSearch = () => {
    reset({
      firstName: "",
      lastName: "",
      inquiryTimestamp: "",
      inquiryMethod: "指定なし",
      employeeId: "指定なし",
    });
    onClear();
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: { xs: "10px", sm: "16px" },
          }}
        >
          <Typography
            sx={{
              width: { xs: "28px", sm: "40px" },
              fontSize: { xs: "10px", sm: "0.85rem" },
              fontWeight: "bold",
            }}
          >
            氏名
          </Typography>

          <CustomTextField
            {...control.register("firstName")}
            size="small"
            placeholder="氏"
            sx={{
              width: "109px",
              bgcolor: "white",
            }}
          />

          <CustomTextField
            {...control.register("lastName")}
            size="small"
            placeholder="名"
            sx={{
              width: "109px",
              bgcolor: "white",
              ml: 1,
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: { xs: "10px", sm: "16px" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: { xs: "10px", sm: "initial" },
            }}
          >
            <Typography
              sx={{
                width: { xs: "79px", sm: "105px" },
                fontSize: { xs: "10px", sm: "12px" },
                fontWeight: "bold",
              }}
            >
              問い合わせ日時
            </Typography>

            <Box
              sx={{
                width: { xs: "120px", sm: "150px" },
                marginRight: { xs: "10px", sm: "inherit" },
              }}
            >
              <Controller
                name="inquiryTimestamp"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomDateTimePicker
                    onChange={onChange}
                    value={value}
                    showTime={false} // No time for search dates
                    width="150px"
                    maxDate={dayjs()} // Can't search future dates
                    minDate={dayjs().subtract(10, "year")} // Reasonable search range
                    defaultValue={null} // Start with empty date
                  />
                )}
              />
            </Box>
          </Box>

          <Box
            sx={{
              ml: { xs: "0", sm: "24px" },
              marginBottom: { xs: "10px", sm: "initial" },
              marginRight: { xs: "10px", sm: "inherit" },
            }}
          >
            <CustomSelect
              label="担当者"
              name="employeeId"
              control={control}
              options={employeeOptions}
              defaultValue="指定なし"
              placeholder={
                employeeNamesLoading
                  ? "物件を読み込み中..."
                  : "物件を選択してください"
              }
              disabled={employeeNamesLoading}
              width="120px"
            />
          </Box>

          <Box
            sx={{
              ml: { xs: "0", sm: "24px" },
              marginBottom: { xs: "10px", sm: "initial" },
              marginRight: { xs: "10px", sm: "inherit" },
            }}
          >
            <CustomSelect
              label="反響元"
              name="inquiryMethod"
              control={control}
              options={inquiryMethodOptions}
              defaultValue="指定なし"
              width="120px"
            />
          </Box>

          <Box sx={{ ml: { xs: "0", sm: "24px" } }}>
            <CustomButton
              type="submit"
              label="検索"
              startIcon={<SearchIcon sx={{ fontSize: "18px !important" }} />}
            />
            <CustomButton
              type="button"
              label="クリア"
              onClick={clearSearch}
              sx={{ marginLeft: "8px" }}
            />
          </Box>
        </Box>
      </form>

      {/* Results count */}
      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <Typography
          sx={{
            color: "#555",
            fontSize: { xs: "10px", sm: "0.85rem" },
            fontWeight: "bold",
          }}
        >
          検索結果
        </Typography>
        <Typography
          sx={{
            mx: 1,
            fontWeight: "bold",
            fontSize: { xs: "12px", sm: "1rem" },
          }}
        >
          {totalCount}
        </Typography>
        <Typography
          sx={{ color: "#555", fontSize: { xs: "10px", sm: "0.85rem" } }}
        >
          件
        </Typography>
      </Box>
    </Box>
  );
};

export default InquirySearch;
