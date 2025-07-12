import {
  Box,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { createInquiry } from "../../../store/inquirySlice";
import { getPropertyNames } from "../../../store/propertiesSlice";
import { useToast } from "../../../components/Toastify";
import { AppDispatch, RootState } from "../../../store";
import SectionTitle from "../../../components/SectionTitle";
import CustomFullWidthInputGroup from "../../../components/CustomFullWidthInputGroup";
import CustomButton from "../../../components/CustomButton";
import CustomTwoColInputGroup from "../../../components/CustomTwoColInputGroup";
import CustomRadioGroup from "../../../components/CustomRadio";
import CustomFullWidthSelectInputGroup from "../../../components/CustomFullWidthSelectInputGroup";
import CustomDateTimePicker from "../../../components/CustomDateTimePicker";
import "../Create/inquiryCreate.css";
import dayjs from "dayjs";
import { getEmployeeNames } from "../../../store/employeeSlice";
import PostalCodeAutoAddressInput from "../../../components/PostalCodeAutoAddressInput";
// Import notification utilities with types
import {
  incrementNotificationCount,
  type InquiryMethod,
} from "../../../utils/notificationUtils";
import { RequireIcon } from "../../../common/icons";
import { getClientID } from "../../../utils/authUtils";

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  furiFirstName: string;
  furiLastName: string;
  birthDate: string;
  gender: string;
  email: string;
  phone: string;
  employee_id: any;

  // Address Information
  postalCode: string;
  prefecture: string;
  city: string;
  address: string;
  buildingName: string;

  // Inquiry Information
  inquiryProperty: string;
  category: string;
  inquiryType: string;
  inquiryMethod: InquiryMethod;
  inquiryContent: string;
}

const InquiryCreate = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { addToast, toasts } = useToast();
  const clientId = getClientID();
  const leftInputContainerWidth = "338px";

  // Redux state
  const { loading } = useSelector((state: RootState) => state.inquiry.new);
  // Get property names from Redux store
  const { data: propertyNames, loading: propertyNamesLoading } = useSelector(
    (state: RootState) => state.properties.names
  );

  const { data: employeeNames, loading: employeeNamesLoading } = useSelector(
    (state: RootState) => state.employees.names
  );

  // Form setup
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      gender: "3",
      category: "問い合わせ（新規）",
    },
    mode: "onChange",
  });

  // Fetch property names when component mounts
  useEffect(() => {
    dispatch(getPropertyNames({}));
    dispatch(getEmployeeNames({}));
  }, [dispatch]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // true for xs

  // Prefecture options
  const prefectureOptions = [
    { value: "01", label: "北海道" },
    { value: "02", label: "青森県" },
    { value: "03", label: "岩手県" },
    { value: "04", label: "宮城県" },
    { value: "05", label: "秋田県" },
    { value: "06", label: "山形県" },
    { value: "07", label: "福島県" },
    { value: "08", label: "茨城県" },
    { value: "09", label: "栃木県" },
    { value: "10", label: "群馬県" },
    { value: "11", label: "埼玉県" },
    { value: "12", label: "千葉県" },
    { value: "13", label: "東京都" },
    { value: "14", label: "神奈川県" },
    { value: "15", label: "新潟県" },
    { value: "16", label: "富山県" },
    { value: "17", label: "石川県" },
    { value: "18", label: "福井県" },
    { value: "19", label: "山梨県" },
    { value: "20", label: "長野県" },
    { value: "21", label: "岐阜県" },
    { value: "22", label: "静岡県" },
    { value: "23", label: "愛知県" },
    { value: "24", label: "三重県" },
    { value: "25", label: "滋賀県" },
    { value: "26", label: "京都府" },
    { value: "27", label: "大阪府" },
    { value: "28", label: "兵庫県" },
    { value: "29", label: "奈良県" },
    { value: "30", label: "和歌山県" },
    { value: "31", label: "鳥取県" },
    { value: "32", label: "島根県" },
    { value: "33", label: "岡山県" },
    { value: "34", label: "広島県" },
    { value: "35", label: "山口県" },
    { value: "36", label: "徳島県" },
    { value: "37", label: "香川県" },
    { value: "38", label: "愛媛県" },
    { value: "39", label: "高知県" },
    { value: "40", label: "福岡県" },
    { value: "41", label: "佐賀県" },
    { value: "42", label: "長崎県" },
    { value: "43", label: "熊本県" },
    { value: "44", label: "大分県" },
    { value: "45", label: "宮崎県" },
    { value: "46", label: "鹿児島県" },
    { value: "47", label: "沖縄県" },
  ];

  const propertyOptions =
    propertyNames?.map((property: any) => ({
      value: property.name,
      label: property.name,
    })) || [];

  const employeeOptions =
    employeeNames?.map((employee: any) => ({
      value: employee.id,
      label: employee.last_name + " " + employee.first_name,
    })) || [];

  const navigate = useNavigate();

  // Gender options
  const genderOptions = [
    { value: "男性", label: "男性" },
    { value: "女性", label: "女性" },
    { value: "設定しない", label: "設定しない" },
  ];

  // Category options
  const categoryOptions = [
    { value: "問い合わせ（新規）", label: "問い合わせ（新規）" },
    { value: "問い合わせ（既存）", label: "問い合わせ（既存）" },
    { value: "苦情", label: "苦情" },
    { value: "要望", label: "要望" },
  ];

  // Inquiry type options
  const inquiryTypeOptions = [
    { value: "空き状況の確認", label: "空き状況の確認" },
    { value: "賃料・価格について", label: "賃料・価格について" },
    { value: "内見希望", label: "内見希望" },
    {
      value: "物件の詳細情報（設備、周辺環境など）",
      label: "物件の詳細情報（設備、周辺環境など）",
    },
  ];

  // Inquiry method options
  const inquiryMethodOptions = [
    { value: "SUUMO", label: "SUUMO" },
    { value: "電話", label: "電話" },
    { value: "その他", label: "その他" },
  ];

  // Update form validity - button will be disabled until all required fields are filled
  useEffect(() => {
    setIsFormValid(isValid && isDirty);
  }, [isValid, isDirty]);

  // Form submission handler
  const onSubmit = async (data: FormData) => {
    try {
      // Create FormData object
      const formData = new FormData();

      // Personal Information
      formData.append("first_name", data.firstName);
      formData.append("last_name", data.lastName);
      formData.append("middle_name", "sample");
      formData.append("first_name_kana", data.furiFirstName);
      formData.append("middle_name_kana", "sample");
      formData.append("last_name_kana", data.furiLastName);
      formData.append("birthday", data.birthDate || "");
      formData.append("gender", data.gender || "");
      formData.append("mail_address", data.email || "");
      formData.append("phone_number", data.phone || "");
      formData.append("employee_id", data.employee_id || "");

      // Address Information
      formData.append("postcode", data.postalCode || "");
      formData.append("prefecture", data.prefecture || "");
      formData.append("city", data.city || "");
      formData.append("street_address", data.address || "");
      formData.append("building_room_and_number", data.buildingName || "");

      // Inquiry Information
      formData.append("property_name", data.inquiryProperty || "");
      formData.append("category", data.category || "");
      formData.append("type", data.inquiryType || "");
      formData.append("method", data.inquiryMethod || "");
      formData.append("summary", data.inquiryContent || "");

      // Additional Information
      formData.append("client_id", clientId || "");
      formData.append("created_at", new Date().toISOString());

      // Dispatch the createInquiry action
      await dispatch(createInquiry(formData)).unwrap();

      // INCREMENT NOTIFICATION COUNT BASED ON METHOD
      if (data.inquiryMethod) {
        incrementNotificationCount(data.inquiryMethod);
      }

      // Show success toast
      addToast({
        type: "success",
        message: "顧客情報が正常に登録されました。",
      });

      // Reset form
      reset();

      // Optional: Navigate to another page
      setTimeout(() => {
        navigate("/inquiry");
      }, 3000);
    } catch (error: any) {
      // Show error toast
      addToast({
        type: "error",
        message:
          error?.message ||
          "顧客登録中にエラーが発生しました。再度お試しください。",
      });

      console.error("Error creating inquiry:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        {/* Personal Information Section */}
        <Box
          pt={{ xs: "10px", sm: "24px" }}
          className={`inquiry ${isMobile ? "sp" : ""}`}
        >
          <SectionTitle title="顧客の新規登録" addBorder={false} />
          <Divider
            sx={{ borderColor: "#D9D9D9", py: { xs: "0", sm: "4px" } }}
          />

          {/* Form Validation Info */}
          {/* <Box sx={{ pl: 7, py: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <span style={{ color: "#d32f2f" }}>*</span> は必須項目です
            </Typography>
          </Box> */}

          <Box
            className="inquiryFormInputsGroup"
            sx={{
              my: { xs: "10px", sm: "16px" },
              maxWidth: "100%",
              pl: { lg: 5, xs: 0, md: 0, sm: 0 },
            }}
          >
            <CustomTwoColInputGroup
              label="氏名"
              firstName="firstName"
              lastName="lastName"
              placeholderOne="氏"
              placeholderTwo="名"
              register={register}
              errors={errors}
              isRequired={true}
              isModalInput={true}
              labelWidth={`${isMobile ? "" : "100px"}`}
              labelWidthSp="42%"
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />

            <CustomTwoColInputGroup
              label="フリガナ"
              firstName="furiFirstName"
              lastName="furiLastName"
              placeholderOne="ミョウジ"
              placeholderTwo="ナマエ"
              register={register}
              errors={errors}
              isModalInput={true}
              labelWidth={`${isMobile ? "" : "100px"}`}
              labelWidthSp="42%"
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />

            <Box
              sx={{
                display: "block !important", // Force block display
                width: "100%",
                marginBottom: 2,
              }}
            >
              <Typography
                color="#3E3E3E"
                fontWeight={700}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: { xs: "10px", sm: "12px" },
                  width: "100%", // Take full width instead of fixed width
                  marginBottom: 1, // Add some spacing between label and input
                  // Remove justifyContent: 'flex-end' and marginRight
                }}
              >
                生年月日
                <span style={{ display: "flex" }}>
                  <RequireIcon />
                </span>
              </Typography>

              <Box>
                <Controller
                  name="birthDate"
                  control={control}
                  rules={{ required: "生年月日は必須項目です" }}
                  render={({ field: { onChange } }) => (
                    <CustomDateTimePicker
                      onChange={onChange}
                      width={`${isMobile ? "100%" : "338px"}`}
                      showTime={false}
                      maxDate={dayjs()}
                      minDate={dayjs().subtract(150, "year")}
                    />
                  )}
                />
              </Box>
              {errors.birthDate && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.birthDate.message}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                display: "block !important", // Force block display
                width: "100%",
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "10px !important", sm: "12px !important" },
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  width: { lg: "100%", xs: "100%" },
                  alignItems: "center",
                  mb: 1,
                }}
              >
                性別
              </Typography>
              <CustomRadioGroup
                name="gender"
                control={control}
                label=""
                options={genderOptions}
                containerStyle={{
                  marginBottom: "0px !important",
                  width: "inherit",
                }}
              />
            </Box>

            <CustomFullWidthInputGroup
              label="メールアドレス"
              name="email"
              type="email"
              placeholder="example@email.com"
              register={register}
              errors={errors}
              isRequired
              isModalInput={false}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />

            <CustomFullWidthInputGroup
              label="電話番号"
              name="phone"
              type="tel"
              placeholder="09012345678（ハイフンなし）"
              register={register}
              errors={errors}
              isRequired={true}
              isModalInput={false}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />

            <CustomFullWidthSelectInputGroup
              label="担当者"
              name="employee_id"
              control={control}
              placeholder={
                employeeNamesLoading
                  ? "物件を読み込み中..."
                  : "物件を選択してください"
              }
              register={register}
              errors={errors}
              isRequired={true}
              options={employeeOptions}
              disabled={employeeNamesLoading}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
          </Box>
        </Box>

        {/* Address Information Section */}
        <Box
          className={`inquiry ${isMobile ? "sp" : ""}`}
          sx={{ py: { lg: 2, xs: 2 } }}
        >
          <SectionTitle title="現住所" addBorder={false} />
          <Divider
            sx={{ borderColor: "#D9D9D9", py: { xs: "0", sm: "4px" } }}
          />

          <Box
            className="inquiryFormInputsGroup"
            sx={{
              my: { xs: "10px", sm: "16px" },
              maxWidth: "100%",
              pl: { lg: 5, xs: 0, md: 0, sm: 0 },
            }}
          >
            {/* <CustomFullWidthInputGroup
              label="郵便番号"
              name="postalCode"
              type="text"
              placeholder="1234567（ハイフンなし）"
              register={register}
              errors={errors}
              isModalInput={false}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
              autoSetAddress={autoSetAddress}
            />

            <CustomFullWidthSelectInputGroup
              label="都道府県"
              name="prefecture"
              control={control}
              placeholder="選択してください。"
              register={register}
              errors={errors}
              options={prefectureOptions}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />

            <CustomFullWidthInputGroup
              label="市区町村"
              name="city"
              type="text"
              placeholder="市区町村を入力してください"
              register={register}
              errors={errors}
              isModalInput={false}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            /> */}
            <PostalCodeAutoAddressInput
              register={register}
              errors={errors}
              setValue={setValue}
              prefectureOptions={prefectureOptions}
              inputWidth={leftInputContainerWidth}
              inputWidthSp="100%"
              control={control}
            />
            <CustomFullWidthInputGroup
              label="番地・区画"
              name="address"
              type="text"
              placeholder="番地・区画を入力してください"
              register={register}
              errors={errors}
              isModalInput={false}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />

            <CustomFullWidthInputGroup
              label="建物名、部屋番号"
              name="buildingName"
              type="text"
              placeholder="建物名、部屋番号を入力してください"
              register={register}
              errors={errors}
              isModalInput={false}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
          </Box>
        </Box>

        {/* Inquiry Information Section */}
        <Box
          className={`inquiry ${isMobile ? "sp" : ""}`}
          sx={{ py: { lg: 1, xs: 0 } }}
        >
          <SectionTitle title="お問い合わせ内容" addBorder={false} />
          <Divider
            sx={{ borderColor: "#D9D9D9", py: { xs: "0", sm: "4px" } }}
          />

          <Box
            className="inquiryFormInputsGroup"
            sx={{
              my: { xs: "10px", sm: "16px" },
              maxWidth: "100%",
              pl: { lg: 5, xs: 0, md: 0, sm: 0 },
            }}
          >
            <CustomFullWidthSelectInputGroup
              label="お問い合わせ物件"
              name="inquiryProperty"
              control={control}
              placeholder={
                propertyNamesLoading
                  ? "物件を読み込み中..."
                  : "物件を選択してください"
              }
              register={register}
              isRequired={true}
              errors={errors}
              options={propertyOptions}
              disabled={propertyNamesLoading}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />

            <CustomFullWidthSelectInputGroup
              label="カテゴリ"
              name="category"
              control={control}
              placeholder="カテゴリを選択してください"
              register={register}
              errors={errors}
              readonly={true}
              options={categoryOptions}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />

            <CustomFullWidthSelectInputGroup
              label="お問い合わせ種別"
              name="inquiryType"
              control={control}
              placeholder="選択してください。"
              register={register}
              errors={errors}
              isRequired={true}
              options={inquiryTypeOptions}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />

            <CustomFullWidthSelectInputGroup
              label="問い合わせ方法"
              name="inquiryMethod"
              control={control}
              placeholder="選択してください。"
              register={register}
              isRequired={true}
              errors={errors}
              options={inquiryMethodOptions}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />

            <CustomFullWidthInputGroup
              label="問い合わせ内容"
              name="inquiryContent"
              type="text"
              placeholder="お問い合わせ内容を入力してください"
              multiline={true}
              rows={4}
              register={register}
              errors={errors}
              isModalInput={false}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
          </Box>
        </Box>

        {/* Submit Button Section */}
        <Box
          sx={{
            backgroundColor: "rgba(221, 221, 221, 0.2)",
            width: "auto",
            // padding: "20px 0",
            marginTop: "auto",
            marginLeft: -3,
            position: "relative",
            left: 0,
            marginRight: -3,
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
                <CustomButton
                  label={loading ? "登録中..." : "登録"}
                  type="submit"
                  disabled={!isFormValid || loading}
                  sx={{
                    minWidth: 100,
                    height: 42,
                    backgroundColor:
                      !isFormValid || loading ? "#ccc" : "#3F97D5",
                    "&:hover": {
                      backgroundColor:
                        !isFormValid || loading ? "#ccc" : "#2E7BC6",
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </form>

      {/* Toast Notifications */}
      {toasts}
    </>
  );
};

export default InquiryCreate;
