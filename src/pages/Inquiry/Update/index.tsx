import { Box, Divider, Grid, Typography, useMediaQuery } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"; // Add this import
import { useDispatch, useSelector } from "react-redux"; // Add these imports
import { AppDispatch, RootState } from "../../../store"; // Add AppDispatch import
import {
  fetchDetailInquiry,
  updateDetailedInquiry,
} from "../../../store/inquirySlice"; // Update the import path
import "../Update/Update.css";
import SectionTitle from "../../../components/SectionTitle";
import CustomFullWidthInputGroup from "../../../components/CustomFullWidthInputGroup";
import CustomButton from "../../../components/CustomButton";
import CustomTwoColInputGroup from "../../../components/CustomTwoColInputGroup";
import CustomRadioGroup from "../../../components/CustomRadio";
import CustomFullWidthSelectInputGroup from "../../../components/CustomFullWidthSelectInputGroup";
import { useToast } from "../../../components/Toastify";
import { getPropertyNames } from "../../../store/propertiesSlice";
import { getEmployeeNames } from "../../../store/employeeSlice";
import { RequireIcon } from "../../../common/icons";
import CustomDateTimePicker from "../../../components/CustomDateTimePicker";
import dayjs from "dayjs";
import CustomLoadingOverlay from "../../../components/Loading/LoadingOverlay";

const InquiryUpdate = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const params = useParams();
  const { inquiry_id: id } = params;
  const dispatch = useDispatch<AppDispatch>(); // Use typed dispatch
  const { addToast, toasts } = useToast();
  const leftInputContainerWidth = "338px";
  const navigate = useNavigate();
  const [, setRegisterTimestamp]: any = useState(null);
  const { data: propertyNames } = useSelector(
    (state: RootState) => state.properties.names
  );

  const { data: employeeNames, loading: employeeNamesLoading } = useSelector(
    (state: RootState) => state.employees.names
  );

  // Get inquiry data from Redux store
  const { data: inquiryData, loading } = useSelector(
    (state: any) => state.inquiry.detailed
  );

  const {
    register,
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm();

  const isMobile = useMediaQuery("(max-width:600px)");
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

  const genderOptions = [
    { value: "1", label: "男性" },
    { value: "2", label: "女性" },
    { value: "3", label: "設定しない" },
  ];

  const categoryOptions = [
    { value: "問い合わせ（新規）", label: "問い合わせ（新規）" },
    { value: "問い合わせ（既存）", label: "問い合わせ（既存）" },
    { value: "苦情", label: "苦情" },
    { value: "要望", label: "要望" },
  ];

  const inquiryTypeOptions = [
    { value: "空き状況の確認", label: "空き状況の確認" },
    { value: "賃料・価格について", label: "賃料・価格について" },
    { value: "内見希望", label: "内見希望" },
    {
      value: "物件の詳細情報（設備、周辺環境など）",
      label: "物件の詳細情報（設備、周辺環境など）",
    },
  ];

  const inquiryMethodOptions = [
    { value: "SUUMO", label: "SUUMO" },
    { value: "電話", label: "電話" },
    { value: "その他", label: "その他" },
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

  const [initialFormData, setInitialFormData] = useState<any>({});

  // Fetch inquiry data when component mounts
  useEffect(() => {
    if (id) {
      dispatch(fetchDetailInquiry(id));
    }
  }, [id, dispatch]);

  // Populate form when inquiry data is fetched
  useEffect(() => {
    if (inquiryData && Object.keys(inquiryData).length > 0) {
      // Map the API response to form field names
      setValue("firstName", inquiryData?.inquiry?.customer?.first_name || "");
      setValue("lastName", inquiryData?.inquiry?.customer?.last_name || "");
      setValue(
        "furiFirstName",
        inquiryData?.inquiry?.customer?.first_name_kana || ""
      );
      setValue(
        "furiLastName",
        inquiryData?.inquiry?.customer?.last_name_kana || ""
      );
      setValue("birthDate", inquiryData?.inquiry?.customer?.birthday || "");
      setValue("gender", inquiryData?.inquiry?.customer?.gender || "");
      setValue("email", inquiryData?.inquiry?.customer?.mail_address || "");
      setValue("phone", inquiryData?.inquiry?.customer?.phone_number || "");
      setValue(
        "employee_id",
        inquiryData?.inquiry?.customer?.employee_id || ""
      );
      setValue("postalCode", inquiryData?.inquiry?.customer?.postcode || "");
      setValue("prefecture", inquiryData?.inquiry?.customer?.prefecture || "");
      setValue("city", inquiryData?.inquiry?.customer?.city || "");
      setValue("address", inquiryData?.inquiry?.customer?.street_address || "");
      setValue("buildingName", inquiryData?.inquiry?.property?.building || "");
      setValue("inquiryProperty", inquiryData?.inquiry?.property?.name || "");
      setValue("inquiryType", inquiryData?.inquiry?.type || "");
      setValue("inquiryMethod", inquiryData?.inquiry?.method || "");
      setValue("inquiryContent", inquiryData?.inquiry?.summary || "");
      setValue("role", inquiryData.role || "general");
    }
  }, [inquiryData, setValue]);

  useEffect(() => {
    dispatch(getPropertyNames({}));
    dispatch(getEmployeeNames({}));
  }, [dispatch]);

  // Update form validity whenever validation state changes
  useEffect(() => {
    setIsFormValid(isDirty);
    setRegisterTimestamp(new Date().toISOString());
  }, [isValid, isDirty]);

  useEffect(() => {
    if (inquiryData && Object.keys(inquiryData).length > 0) {
      const defaultValues = {
        firstName: inquiryData?.inquiry?.customer?.first_name || "",
        lastName: inquiryData?.inquiry?.customer?.last_name || "",
        furiFirstName: inquiryData?.inquiry?.customer?.first_name_kana || "",
        furiLastName: inquiryData?.inquiry?.customer?.last_name_kana || "",
        birthDate: inquiryData?.inquiry?.customer?.birthday || "",
        gender: inquiryData?.inquiry?.customer?.gender || "",
        email: inquiryData?.inquiry?.customer?.mail_address || "",
        phone: inquiryData?.inquiry?.customer?.phone_number || "",
        employee_id: inquiryData?.inquiry?.customer?.employee_id || "",
        postalCode: inquiryData?.inquiry?.customer?.postcode || "",
        prefecture: inquiryData?.inquiry?.customer?.prefecture || "",
        city: inquiryData?.inquiry?.customer?.city || "",
        address: inquiryData?.inquiry?.customer?.street_address || "",
        buildingName: inquiryData?.inquiry?.property?.building || "",
        inquiryProperty: inquiryData?.inquiry?.property?.name || "",
        inquiryType: inquiryData?.inquiry?.type || "",
        inquiryMethod: inquiryData?.inquiry?.method || "",
        inquiryContent: inquiryData?.inquiry?.summary || "",
      };

      Object.entries(defaultValues).forEach(([key, value]) => {
        setValue(key as any, value);
      });

      setInitialFormData(defaultValues);
    }
  }, [inquiryData, setValue]);

  const watchedFields = watch();
  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    const hasChanged = Object.keys(initialFormData).some((key) => {
      return initialFormData[key] !== watchedFields[key];
    });

    setIsFormChanged(hasChanged);
  }, [watchedFields, initialFormData]);

  const onSubmit = async (data: any) => {
    try {
      // Create FormData object
      const formData = new FormData();

      // Personal Information - handle undefined values
      formData.append("first_name", data.firstName || "");
      formData.append("last_name", data.lastName || "");
      formData.append("middle_name", "sample");
      formData.append("first_name_kana", data.furiFirstName || "");
      formData.append("middle_name_kana", "sample");
      formData.append("last_name_kana", data.furiLastName || "");
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
      formData.append("client_id", inquiryData.inquiry.client_id || "");
      formData.append("customer_id", inquiryData.inquiry.customer.id || "");
      formData.append(
        "customer_created_at",
        inquiryData.inquiry.customer.created_at
      );
      formData.append("inquiry_created_at", inquiryData.inquiry.created_at);
      formData.append("updated_at", new Date().toISOString());

      // Convert FormData to regular object for Redux (if your createInquiry expects JSON)
      const payload: any = {};
      formData.forEach((value, key) => {
        payload[key] = value;
      });
      const id = inquiryData.inquiry.customer.id;

      await dispatch(updateDetailedInquiry({ id, payload: formData })).unwrap();

      addToast({
        type: "success",
        message: "顧客情報が正常に登録されました。",
      });

      setTimeout(() => {
        navigate("/inquiry");
      }, 3000);
    } catch (error: any) {
      addToast({
        type: "error",
        message:
          error?.message ||
          "顧客登録中にエラーが発生しました。再度お試しください。",
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ position: "relative", minHeight: "200px" }}>
        <CustomLoadingOverlay />
      </Box>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Box className={`inquiry ${isMobile ? "sp" : ""}`}>
          <SectionTitle title="顧客情報" addBorder={false} />

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
            <CustomTwoColInputGroup
              label="氏名"
              firstName="firstName"
              lastName="lastName"
              placeholderOne="氏"
              placeholderTwo="名"
              register={register}
              errors={errors}
              isRequired
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
              isRequired
              isModalInput={true}
              labelWidth={`${isMobile ? "" : "100px"}`}
              labelWidthSp="42%"
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />

            {/* <CustomFullWidthInputGroup
              label="生年月日"
              name="birthDate"
              type="date"
              placeholder=""
              register={register}
              isRequired
              errors={errors}
              isModalInput={false}
            /> */}
            <Box
              sx={{
                display: "block",
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
                  mb: 1,
                  fontSize: { xs: "10px", sm: "12px" },
                  width: { xs: "40%", sm: "100px" },
                }}
              >
                生年月日
                <span style={{ display: "flex" }}>
                  <RequireIcon />
                </span>
              </Typography>
              <Controller
                name="birthDate"
                control={control}
                rules={{ required: "生年月日は必須項目です" }}
                render={({ field: { onChange, value } }) => (
                  <CustomDateTimePicker
                    onChange={onChange}
                    width={`${isMobile ? "100%" : "338px"}`}
                    value={value}
                    showTime={false}
                    maxDate={dayjs()}
                    minDate={dayjs().subtract(150, "year")}
                  />
                )}
              />
            </Box>
            <Box
              sx={{
                display: "block",
                mb: 1,
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "10px !important", sm: "12px !important" },
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  width: { lg: "100px", xs: "38%" },
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
                  ml: { lg: 0, xs: 2.5 },
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
              isRequired
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
              isRequired
              options={employeeOptions}
              disabled={employeeNamesLoading}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
          </Box>
        </Box>
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
            <CustomFullWidthInputGroup
              label="郵便番号"
              name="postalCode"
              type="text"
              placeholder="1234567（ハイフンなし）"
              register={register}
              errors={errors}
              isModalInput={false}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
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
        <Box
          className={`inquiry ${isMobile ? "sp" : ""}`}
          sx={{ py: { lg: 1, xs: 1 } }}
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
              placeholder="物件を選択してください"
              register={register}
              errors={errors}
              options={propertyOptions}
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
              disabled
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
              options={inquiryTypeOptions}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />

            <CustomFullWidthSelectInputGroup
              label="お問い合わせ方法"
              name="inquiryMethod"
              control={control}
              placeholder="選択してください。"
              register={register}
              errors={errors}
              options={inquiryMethodOptions}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />

            <CustomFullWidthInputGroup
              label="お問い合わせ内容"
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
        <Box
          sx={{
            backgroundColor: "rgb(221, 221, 221, 0.2)",
            width: "auto",
            padding: "10px 0",
            marginTop: "auto",
            marginLeft: -3,
            position: "relative",
            left: 0,
            marginRight: -3,
          }}
        >
          <Grid container>
            <Grid item xs={12} lg={12}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CustomButton
                  label="更新"
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
                  type="submit"
                  disabled={!isFormValid || loading || !isFormChanged}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </form>
      {toasts}
    </>
  );
};

export default InquiryUpdate;
