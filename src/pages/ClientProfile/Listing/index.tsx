import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { useForm } from "react-hook-form";
import "../Listing/Update.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../../components/CustomButton";
import CustomFullWidthInputGroup from "../../../components/CustomFullWidthInputGroup";
import CustomFullWidthSelectInputGroup from "../../../components/CustomFullWidthSelectInputGroup";
import SectionTitle from "../../../components/SectionTitle";
import {
  fetchDetailedClient,
  updateDetailedClient,
} from "../../../store/clientSlice";
import { AppDispatch } from "../../../store";
import { useToast } from "../../../components/Toastify";
import Cookies from "js-cookie";

const ClientProfile = () => {
  const [, setIsFormValid] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid, isDirty },
  } = useForm();

  const client_id = Cookies.get("clientID");
  const leftInputContainerWidth = "338px";
  // More robust selector with debugging
  const detailClientData = useSelector(
    (state: any) => state.clients?.detailed?.data
  );
  const loading = useSelector((state: any) => state.clients?.detailed?.loading);
  const error = useSelector((state: any) => state.clients?.detailed?.error);

  const { addToast, toasts } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useMediaQuery("(max-width:600px)");

  const area = [
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

  useEffect(() => {
    setIsFormValid(isValid && isDirty);
  }, [isValid, isDirty]);

  const onSubmit = (data: any) => {
    const payload = {
      client_name: data.client_name,
      client_name_kana: data.client_name_kana,
      client_tell: data.client_tell,
      hp_address: data.hp_address,
      postcode: data.postcode,
      prefecture: data.prefecture,
      role: data.role,
      client_mail_address: data.client_mail_address,
      client_id: data.client_id,
      city: data.city,
      steet_address: data.steet_address,
      building: data.building,
    };
    updateClient(payload);
  };

  const updateClient = async (payload: any) => {
    try {
      let updateResult;
      let id;
      if (client_id && client_id !== undefined) {
        id = client_id;
        updateResult = await dispatch(updateDetailedClient({ id, payload }));
      }

      if (updateDetailedClient.fulfilled.match(updateResult)) {
        addToast({
          message: "更新完了 。",
          type: "success",
        });
      } else if (updateDetailedClient.rejected.match(updateResult)) {
        addToast({
          message: "fail to update",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error updating client:", err);
    }
  };

  const fetchDetailClientProfile = async () => {
    try {
      if (client_id && client_id !== undefined) {
        const id = client_id;
        await dispatch(fetchDetailedClient(id));
      } else {
        console.error("❌ No client_id found in cookies");
      }
    } catch (err) {
      console.error("❌ Error fetching client:", err);
    }
  };

  useEffect(() => {
    fetchDetailClientProfile();
  }, []);

  useEffect(() => {
    if (detailClientData) {
      setValue("client_mail_address", detailClientData.client_mail_address);
      setValue("client_tell", detailClientData.client_tell);
      setValue("hp_address", detailClientData.hp_address);
      setValue("steet_address", detailClientData.steet_address);
      setValue("client_name", detailClientData.client_name);
      setValue("client_name_kana", detailClientData.client_name_kana);
      setValue("prefecture", detailClientData.prefecture);
      setValue("building", detailClientData.building);
      setValue("client_id", detailClientData.client_id);
      setValue("postcode", detailClientData.postcode);
      setValue("city", detailClientData.city);
    } else {
      console.error("No data available to set form values");
    }
  }, [detailClientData, setValue]);

  // Show loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          width: "100%",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#344052" }} />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          width: "100%",
        }}
      >
        <div style={{ color: "red" }}>
          Error loading client data. Check console for details.
        </div>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: { xs: "24px 0", sm: "0" } }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ py: { xs: "0", sm: "24px" } }}>
          <SectionTitle title="基本情報" addBorder={false} />

          <Divider
            sx={{ borderColor: "#D9D9D9", py: { xs: "0", sm: "4px" } }}
          />

          <Box
            className={`clientFormInputsGroup ${isMobile ? "sp" : ""}`}
            sx={{
              margin: { xs: "10px 0 5px 0", sm: "16px 0" },
              maxWidth: "100%",
              pl: { lg: 5, xs: 0, md: 0, sm: 0 },
            }}
          >
            <CustomFullWidthInputGroup
              label="法人名"
              name="client_name"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isRequired
              isModalInput={false}
              labelWidth="120px"
              labelWidthSp="47%"
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="フリガナ"
              name="client_name_kana"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth="120px"
              labelWidthSp="47%"
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="電話番号"
              name="client_tell"
              type="phoneNumber"
              placeholder="12345678900(ハイフンなし)"
              register={register}
              errors={errors}
              isRequired
              isModalInput={false}
              labelWidth="120px"
              labelWidthSp="47%"
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="メールアドレス"
              name="client_mail_address"
              type="email"
              placeholder=""
              register={register}
              errors={errors}
              isRequired
              isModalInput={false}
              labelWidth="120px"
              labelWidthSp="47%"
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />

            <CustomFullWidthInputGroup
              label="HPアドレス"
              name="hp_address"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth="120px"
              labelWidthSp="47%"
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
          </Box>
        </Box>
        <Box sx={{ mb: 5 }}>
          <SectionTitle title="住所" addBorder={false} />

          <Divider
            sx={{ borderColor: "#D9D9D9", py: { xs: "0", sm: "4px" } }}
          />

          <Box
            className={`clientFormInputsGroup ${isMobile ? "sp" : ""}`}
            sx={{
              margin: { xs: "10px 0 5px 0", sm: "16px 0" },
              maxWidth: "100%",
              pl: { lg: 5, xs: 0, md: 0, sm: 0 },
            }}
          >
            <CustomFullWidthInputGroup
              label="郵便番号"
              name="postcode"
              type="number"
              placeholder="1234567(ハイフンなし)"
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth="120px"
              labelWidthSp="47%"
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthSelectInputGroup
              label="都道府県"
              name="prefecture"
              control={control} // Add this line
              placeholder="選択してください。"
              register={register}
              errors={errors}
              options={area}
              labelWidth="120px"
              labelWidthSp="47%"
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="市区町村"
              name="city"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth="120px"
              labelWidthSp="47%"
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="番地・区画"
              name="steet_address"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth="120px"
              labelWidthSp="47%"
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="建物名、部屋番号"
              name="building"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth="120px"
              labelWidthSp="47%"
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: "rgb(221, 221, 221, 0.2)",
            padding: "10px 0",
            marginTop: "auto",
            position: "sticky",
            bottom: "0",
            marginLeft: "-22px",
            marginRight: "-24px",
            width: "calc(100% + 46px)",
          }}
        >
          <Grid container>
            <Grid item xs={12} lg={12}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CustomButton
                  label="登録"
                  type="submit"
                  disabled={!isDirty}
                  isLoading={loading}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </form>
      {toasts}
    </Box>
  );
};
export default ClientProfile;
