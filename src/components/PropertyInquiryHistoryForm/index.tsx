import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CustomFullWidthInputGroup from "../CustomFullWidthInputGroup";
import CustomFullWidthSelectInputGroup from "../CustomFullWidthSelectInputGroup";
import CustomButton from "../CustomButton";
import { useEffect, useState } from "react";
import { PropertyFormProps } from "../../types";
import { getEmployeeNames } from "../../store/employeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import {
  createInquiryHistory,
  updateInquiryHistory,
} from "../../store/propertiesInquiriesSlice";
import { useToast } from "../Toastify";
import dayjs from "dayjs";
import CustomDateTimePicker from "../CustomDateTimePicker";

const PropertyInquiryHistoryForm = ({
  defaultValues,
  formType,
  onSuccess,
}: PropertyFormProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();
  const { data: employeesNameData } = useSelector(
    (state: any) => state.employees.names
  );
  const [managersName, setManagersName] = useState([]);
  const [, setSelectedDate] = useState<string>();
  const { addToast, toasts } = useToast();
  const { loading } = useSelector(
    (state: any) => state.propertiesInquiries.newInquiryHistory
  );
  const [createdAt, setCreatedAt] = useState("");
  // const {loading: newLoading} = useSelector((state: any) => state.propertiesInquiries.newInquiryHistory);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    defaultValues:
      defaultValues ||
      {
        // role: 'general',
      },
    mode: "onChange",
  });
  const leftInputContainerWidth = "338px";

  const categories = [
    { value: "お問い合わせ", label: "お問い合わせ" },
    { value: "商談", label: "商談" },
    { value: "内見", label: "内見" },
  ];

  const fetchEmployeeName = async () => {
    try {
      await dispatch(getEmployeeNames("99"));
    } catch (err) {
      console.error("Error fetching properties:", err);
    }
  };

  useEffect(() => {
    fetchEmployeeName();
  }, []);

  useEffect(() => {
    if (employeesNameData) {
      const transformedArray = employeesNameData.map((user: any) => ({
        value: user.id,
        label: `${user.first_name} ${user.family_name}`,
      }));
      setManagersName(transformedArray);
    }
  }, [employeesNameData]);

  useEffect(() => {
    if (defaultValues) {
      const formattedValues = {
        ...defaultValues,
        inquired_at: dayjs(defaultValues.inquired_at).format("YYYY/MM/DD"),
      };
      reset(formattedValues);
      setCreatedAt(defaultValues?.created_at);
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    if (formType !== "update") {
      setSelectedDate("");
      setValue("employee_id", "");
    }
  }, [formType]);
  const handleFormSubmit = async (data: any) => {
    if (formType === "update") {
      const { inquired_at, ...rest } = data;
      const formData = new FormData();
      const selectedDate = new Date(inquired_at).toISOString();
      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== inquired_at) {
          const formattedValue =
            typeof value === "object" ? JSON.stringify(value) : String(value);
          formData.append(key, formattedValue);
        }
      });
      if (selectedDate !== undefined) {
        formData.append("inquired_at", selectedDate);
      }
      formData.append("created_at", createdAt);
      await updateInquiriesHistory(formData);
    } else {
      const { inquired_at, ...rest } = data;
      const formData = new FormData();
      const selectedDate = new Date(inquired_at).toISOString();
      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== inquired_at) {
          const formattedValue =
            typeof value === "object" ? JSON.stringify(value) : String(value);
          formData.append(key, formattedValue);
        }
      });
      if (selectedDate !== undefined) {
        formData.append("inquired_at", selectedDate);
      }
      await createInquiriesHistory(formData);
    }
  };

  const createInquiriesHistory = async (uploadFormData: any) => {
    try {
      const registeredResult = await dispatch(
        createInquiryHistory(uploadFormData)
      );
      if (createInquiryHistory.fulfilled.match(registeredResult)) {
        addToast({
          message: "登録完了 。",
          type: "success",
        });
        onSuccess?.("created");
      } else if (createInquiryHistory.rejected.match(registeredResult)) {
        const responseData = registeredResult.payload as any;
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

  const updateInquiriesHistory = async (uploadFormData: any) => {
    try {
      const updatedResult = await dispatch(
        updateInquiryHistory(uploadFormData)
      );
      if (createInquiryHistory.fulfilled.match(updatedResult)) {
        addToast({
          message: "登録完了 。",
          type: "success",
        });
        onSuccess?.("updated");
      } else if (createInquiryHistory.rejected.match(updatedResult)) {
        const responseData = updatedResult.payload as any;
        const message = responseData?.message;
        addToast({
          message: message,
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error updating properties:", err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box sx={{ mb: 5 }}>
          <Box
            className="propertiesFormInputsGroup"
            sx={{ my: 2, maxWidth: "100%", pl: { lg: 5, xs: 0 } }}
          >
            <Box
              sx={{
                display: "block",
                width: "100%",
                marginBottom: "10px",
              }}
            >
              <Typography
                fontSize={12}
                marginBottom="10px"
                color="#3E3E3E"
                fontWeight={700}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: { lg: "12px !important", xs: "10px !important" },
                  width: { xs: "60%", sm: "100px" },
                  justifyContent: { lg: "flex-start", xs: "flex-start" },
                }}
              >
                日付
              </Typography>
              <Controller
                name="inquired_at"
                control={control}
                render={({ field: { onChange } }) => (
                  <CustomDateTimePicker
                    onChange={onChange}
                    width={{ lg: "338px", xs: "100%" }}
                    showTime={false}
                    maxDate={dayjs()}
                    minDate={dayjs().subtract(150, "year")}
                  />
                )}
              />
            </Box>
            <CustomFullWidthInputGroup
              label="タイトル"
              name="title"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              extraClassName={isMobile ? "" : "flexCol"}
              isRequired
              isModalInput={false}
              isShowInColumn={isMobile ? false : true}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
              // labelSx={{pl: {lg: '15px', xs: 0}}}
            />
            <CustomFullWidthSelectInputGroup
              label="カテゴリ"
              name="category"
              control={control}
              placeholder="選択してください。"
              register={register}
              errors={errors}
              options={categories}
              isShowInColumn={isMobile ? false : true}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthSelectInputGroup
              label="担当者"
              name="employee_id"
              control={control}
              placeholder="選択してください。"
              register={register}
              errors={errors}
              isRequired
              options={managersName}
              isShowInColumn={isMobile ? false : true}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="本文"
              name="summary"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isRequired
              isModalInput={false}
              extraClassName={isMobile ? "" : "flexCol"}
              isShowInColumn={isMobile ? false : true}
              multiline={true}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
              rows={3}
            />
          </Box>
        </Box>
        <Box
          sx={{
            background: "#F7FBFD",
            display: "flex",
            justifyContent: "center",
            padding: "10px 0",
            position: "fixed",
            bottom: "0",
            width: { lg: "calc(100% - 354px)", xs: "calc(100% + -64px)" },
            marginRight: "-24px",
          }}
        >
          <CustomButton
            label="登録"
            sx={{ width: { lg: "100px", xs: "80px" } }}
            type="submit"
            disabled={!isDirty}
            isLoading={formType !== "update" ? loading : false}
          />
        </Box>
        {/* <Box sx={{
          backgroundColor: "rgba(221, 221, 221, 0.2)",
          width: "auto",
          // padding: "20px 0",
          marginTop: "auto",
          marginLeft: '-1px',
          position: "relative",
          left: 0,
          marginRight: -3,
        }}>
          <Grid container>
            <Grid item xs={12}>         
              <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
                <CustomButton
                  label={loading ? "登録中..." : "登録"}
                  type="submit"
                  disabled={!isDirty || loading}
                  sx={{
                    minWidth: 100,
                    height: 42,
                    backgroundColor: (!isDirty || loading) ? "#ccc" : "#3F97D5",
                    "&:hover": {
                      backgroundColor: (!isDirty || loading) ? "#ccc" : "#2E7BC6",
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box> */}
      </form>
      {toasts}
    </>
  );
};

export default PropertyInquiryHistoryForm;
