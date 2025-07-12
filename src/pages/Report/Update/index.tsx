import { 
  Box, 
  Divider, 
  Grid, 
  Typography, 
  useMediaQuery, 
  useTheme 
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
import "../Update/Update.css";
// import { useToast } from "../../../components/Toastify";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../../../store";
import SectionTitle from "../../../components/SectionTitle";
import CustomFullWidthInputGroup from "../../../components/CustomFullWidthInputGroup";
import CustomButton from "../../../components/CustomButton";
import CustomFullWidthSelectInputGroup from "../../../components/CustomFullWidthSelectInputGroup";
import CustomFullWidthCheckboxGroup from "../../../components/CustomFullWidthCheckboxInputGroup";
import MiniTableList from "../../../components/MiniTableList";
import CustomModal from "../../../components/CustomModal";

const ReportUpdate = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const openModal = () => setIsConfirmOpen(true);
  const closeModal = () => setIsConfirmOpen(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    defaultValues: { role: "general" },
    mode: "onChange", // This enables validation on change
  });

  const [customerData, setCustomerData] = useState<any[]>([]);

  // Handle customer data changes
  const handleCustomerDataChange = (newData: any[]) => {
    setCustomerData(newData);
  };

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

  // const { addToast, toasts } = useToast();
  // const dispatch = useDispatch<AppDispatch>();
  // Update form validity whenever validation state changes
  useEffect(() => {
    setIsFormValid(isValid && isDirty);
  }, [isValid, isDirty]);

  const onSubmit = (data: any) => {
    const payload = {
      name: data.name,
      condition: data.condition,
      general: data.general,
      suumo_list: data.suumo_list,
      count: data.count,
      investigation: data.investigation,
      negotiation: data.negotiation,
      owner_count: data.owner_count,
      customer_interactions: customerData,
    };
    createInquiryData(payload);
  };

  const handleConfirmExport = () => {
    closeModal();
  };

  const createInquiryData = async (_payload: any) => {
    alert("submit");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className={`report ${isMobile ? "sp" : ""}`} pt={{ lg: 3, xs: 1 }}>
          <SectionTitle title='新規報告書' addBorder={false} />

          <Divider sx={{ borderColor: "#D9D9D9", py: 0.5 }} />

          <Box
            className='reportFormInputsGroup'
            sx={{ 
              my: { xs: "10px", sm: "16px" }, 
              maxWidth: "100%", 
              pl: { xs: "0", sm: 7 } 
            }}>
            <CustomFullWidthInputGroup
              label='報告書名'
              name='name'
              type='text'
              placeholder=''
              register={register}
              errors={errors}
              isModalInput={false}
            />
            <CustomFullWidthSelectInputGroup
              label='現在の状況'
              name='condition'
              control={control} // Add this line
              labelWidth='100'
              placeholder='選択してください。'
              register={register}
              errors={errors}
              options={area}
            />
            <CustomFullWidthInputGroup
              label='全体報告 (AI生成)'
              name='general'
              type='text'
              placeholder=''
              register={register}
              errors={errors}
              isModalInput={false}
              multiline={true}
              rows={3}
            />
            <CustomFullWidthCheckboxGroup
              label='SUUMOへの掲載'
              name='suumo_list'
              register={register}
              errors={errors}
              options={[{ value: "email", label: "掲載済み" }]}
            />
            <CustomFullWidthInputGroup
              label='閲覧数'
              name='count'
              type='text'
              placeholder=''
              register={register}
              errors={errors}
              isModalInput={false}
            />
            <CustomFullWidthInputGroup
              label='お問い合わせ件数'
              name='investigation'
              type='text'
              placeholder=''
              register={register}
              errors={errors}
              isModalInput={false}
            />
            <CustomFullWidthInputGroup
              label='期間内の商談実施人数'
              name='negotiation'
              type='text'
              placeholder=''
              register={register}
              errors={errors}
              isModalInput={false}
            />
            <CustomFullWidthInputGroup
              label='期間内の物件見学人数'
              name='owner_count'
              type='text'
              placeholder=''
              register={register}
              errors={errors}
              isModalInput={false}
            />
          </Box>
        </Box>
        <Box sx={{ mt: 2, mb: 5, maxWidth: "100%", pl: { lg: 7.5, xs: 0 } }}>
          <Box className='inputGroupWrapper flexRow'>
            <Typography
              className={isMobile ? "" : `inputLabel`}
              sx={{
                width: { xs: "100%", md: "100px" },
                alignSelf: "center",
                paddingTop: "0",
                fontSize: { xs: "10px", md: "14px" },
                fontWeight: { xs: 700, md: 400 },
                mb: { xs: 2, md: 0 },
                whiteSpace: "nowrap",
              }}>
              顧客対応内容
            </Typography>
          </Box>
                     <MiniTableList 
             data={customerData} 
             onChange={handleCustomerDataChange}
           />
        </Box>
        <Box
          sx={{
            backgroundColor: "rgb(221, 221, 221, 0.2)",
            width: "auto",
            padding: 2,
            marginTop: "auto",
            marginLeft: -3,
            zIndex: 10,
            marginRight: -3,
            position: "relative",
          }}>
          <Grid container>
            <Grid item xs={12} lg={12}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CustomButton
                  label='キャンセル'
                  sx={{
                    width: 150,
                    height: 43,
                    mx: 2,
                    backgroundColor: "#3F97D5",
                  }}
                  // type='submit'
                />
                <CustomButton
                  label='保存（Excel出力)'
                  onClick={() => openModal()}
                  sx={{ width: 150, height: 43, backgroundColor: "#3F97D5" }}
                  disabled={!isFormValid}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
        <CustomModal
          openModal={isConfirmOpen}
          handleCloseModal={closeModal}
          title='保存の確認'
          modalType='otherModal'
          addTitleBorder='true'>
          <Box sx={{}}>
            <Typography
              align='left'
              fontSize={14}
              fontWeight={400}
              sx={{ marginBottom: "30px", lineHeight: 1.6, px: 1 }}>
              報告書の作成を完了し、Excelに出力してよろしいですか？
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                px: 3,
              }}>
              <CustomButton
                label='キャンセル'
                onClick={closeModal}
                sx={{
                  width: "150px",
                  height: "36px",
                  backgroundColor: "#989898 !important",
                }}
              />
              <CustomButton
                label='完了'
                onClick={handleConfirmExport}
                sx={{
                  width: "100px",
                  height: "36px",
                  backgroundColor: "#4AA3C9",
                }}
              />
            </Box>
          </Box>
        </CustomModal>
      </form>
      {/* {toasts} */}
    </>
  );
};

export default ReportUpdate;
