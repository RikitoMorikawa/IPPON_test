import { useEffect } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
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
import { Search } from "@mui/icons-material";

interface SearchParams {
  firstName?: string;
  lastName?: string;
  inquiryTimestampFrom?: string;
  inquiryTimestampTo?: string;
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
      inquiryTimestampFrom: currentSearchParams.inquiryTimestampFrom || "",
      inquiryTimestampTo: currentSearchParams.inquiryTimestampTo || "",
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
    setValue(
      "inquiryTimestampFrom",
      currentSearchParams.inquiryTimestampFrom || ""
    );
    setValue(
      "inquiryTimestampTo",
      currentSearchParams.inquiryTimestampTo || ""
    );
    setValue("inquiryMethod", currentSearchParams.inquiryMethod || "指定なし");
    setValue("employeeId", currentSearchParams.employeeId || "指定なし");
  }, [currentSearchParams, setValue]);

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
      label: employee.last_name + " " + employee.first_name,
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
      inquiryTimestampFrom: data.inquiryTimestampFrom
        ? convertDateToISO(data.inquiryTimestampFrom)
        : undefined,
      inquiryTimestampTo: data.inquiryTimestampTo
        ? convertDateToISO(data.inquiryTimestampTo)
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
      inquiryTimestampFrom: "",
      inquiryTimestampTo: "",
      inquiryMethod: "指定なし",
      employeeId: "指定なし",
    });
    onClear();
  };
  const isMobile = useMediaQuery("(max-width:600px)");
  // const dateFormat = isMobile ? "MM/DD" : "YYYY/MM/DD";
  console.log(isMobile);
  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 氏名エリア */}

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            mb: { xs: "10px", sm: "16px" },
            gap: 1,
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
            {...control.register("lastName")}
            size="small"
            placeholder="氏"
            sx={{
              width: "109px",
              bgcolor: "white",
            }}
          />
          <CustomTextField
            {...control.register("firstName")}
            size="small"
            placeholder="名"
            sx={{
              width: "109px",
              bgcolor: "white",
              ml: 1,
            }}
          />
        </Box>

        {/* 検索条件全体 */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
            mb: { xs: "10px", sm: "16px" },
          }}
        >
          {/* 日付レンジ */}
          {isMobile ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                minWidth: "400px",
                gap: 1,
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  width: { xs: "79px", sm: "105px" },
                  fontSize: { xs: "10px", sm: "12px" },
                  fontWeight: "bold",
                }}
              >
                問い合わせ期間
              </Typography>
              <Controller
                name="inquiryTimestampFrom"
                control={control}
                render={({ field }) => (
                  <CustomDateTimePicker
                    {...field}
                    showTime={false}
                    width="120px"
                    maxDate={dayjs()}
                    minDate={dayjs().subtract(10, "year")}
                    defaultValue={null}
                  />
                )}
              />
              <Typography sx={{ fontWeight: 700, fontSize: 12 }}>〜</Typography>
              <Controller
                name="inquiryTimestampTo"
                control={control}
                render={({ field }) => (
                  <CustomDateTimePicker
                    {...field}
                    showTime={false}
                    width="120px"
                    maxDate={dayjs()}
                    minDate={dayjs().subtract(10, "year")}
                    defaultValue={null}
                  />
                )}
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                minWidth: "400px",
                gap: 1,
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  width: { xs: "79px", sm: "105px" },
                  fontSize: { xs: "10px", sm: "12px" },
                  fontWeight: "bold",
                }}
              >
                問い合わせ期間
              </Typography>
              <Controller
                name="inquiryTimestampFrom"
                control={control}
                render={({ field }) => (
                  <CustomDateTimePicker
                    {...field}
                    showTime={false}
                    width="150px"
                    maxDate={dayjs()}
                    minDate={dayjs().subtract(10, "year")}
                    defaultValue={null}
                  />
                )}
              />
              <Typography sx={{ fontWeight: 700, fontSize: 12 }}>〜</Typography>
              <Controller
                name="inquiryTimestampTo"
                control={control}
                render={({ field }) => (
                  <CustomDateTimePicker
                    {...field}
                    showTime={false}
                    width="150px"
                    maxDate={dayjs()}
                    minDate={dayjs().subtract(10, "year")}
                    defaultValue={null}
                  />
                )}
              />
            </Box>
          )}

          {isMobile ? (
            <>
              <Box sx={{ minWidth: "120px" }}>
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
              <Box sx={{ minWidth: "120px" }}>
                <CustomSelect
                  label="反響元"
                  name="inquiryMethod"
                  control={control}
                  options={inquiryMethodOptions}
                  defaultValue="指定なし"
                  width="120px"
                />
              </Box>
              <Box>
                <CustomButton
                  type="submit"
                  label={`${isMobile ? "" : "検索"}`}
                  className={`${isMobile ? "serchSp" : ""}`}
                  startIcon={<Search sx={{ fontSize: "18px !important" }} />}
                />
              </Box>
              {/* 反響元 */}
            </>
          ) : (
            <>
              <Box sx={{ minWidth: "160px" }}>
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

              {/* 反響元 */}
              <Box sx={{ minWidth: "140px" }}>
                <CustomSelect
                  label="反響元"
                  name="inquiryMethod"
                  control={control}
                  options={inquiryMethodOptions}
                  defaultValue="指定なし"
                  width="120px"
                />
              </Box>
            </>
          )}
          {/* 検索・クリアボタン */}
          {isMobile ? (
            <></>
          ) : (
            <Box sx={{ display: "flex", gap: 1, minWidth: "150px" }}>
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
          )}
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
