import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import "../Create/reportCreate.css";
import SectionTitle from "../../../components/SectionTitle";
import CustomFullWidthInputGroup from "../../../components/CustomFullWidthInputGroup";
import CustomButton from "../../../components/CustomButton";
import CustomFullWidthSelectInputGroup from "../../../components/CustomFullWidthSelectInputGroup";
import CustomFullWidthCheckboxGroup from "../../../components/CustomFullWidthCheckboxInputGroup";
import MiniTableList from "../../../components/MiniTableList";
import CustomModal from "../../../components/CustomModal";
import { useToast } from "../../../components/Toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { createReport, fetchDetailedReport } from "../../../store/reportSlice";

interface ReportCreateProps {
  reportId?: string; // Optional report ID for editing
  propertyId?: string; // Optional property ID for creating report for specific property
  aiGeneratedData?: any; // Optional AI generated data for new reports
  onBack?: () => void; // Callback to go back to listing
  onSaveSuccess?: () => void; // Callback after successful save
}

const ReportCreate: React.FC<ReportCreateProps> = ({
  reportId,
  propertyId,
  aiGeneratedData,
  onBack,
  onSaveSuccess,
}) => {
  const [, setIsFormValid] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  // const [propertyId, setPropertyId] = useState(false);
  // const [reportName, setReportName] = useState(false);
  const [customerInteractions, setCustomerInteractions] = useState<any[]>([]);

  // Handle customer interactions changes
  const handleCustomerInteractionsChange = (newData: any[]) => {
    setCustomerInteractions(newData);
  };
  const [saveType, setSaveType] = useState<"draft" | "completed">("completed");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const openModal = () => setIsConfirmOpen(true);
  const dispatch = useDispatch<AppDispatch>();
  const { addToast, toasts } = useToast();
  const closeModal = () => setIsConfirmOpen(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // true for xs

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm({
    defaultValues: {
      role: "general",
      report_name: "",
      current_status: "",
      summary: "",
      suumo: false,
      views_count: "",
      inquiries_count: "",
      property_id: propertyId || "",
      report_route_name: "",
      viewing_count: "",
      business_meeting_count: "",
    },
    mode: "onChange",
  });

  const area = [
    { value: "募集中", label: "募集中" },
    { value: "申し込みあり", label: "申し込みあり" },
    { value: "契約済み", label: "契約済み" },
    { value: "掲載終了", label: "掲載終了" },
  ];

  // Load report data when reportId is provided
  useEffect(() => {
    console.log("ReportCreate useEffect - reportId:", reportId, "aiGeneratedData:", aiGeneratedData);
    
    if (reportId) {
      setIsEditMode(true);
      loadReportData(reportId);
    } else if (aiGeneratedData) {
      setIsEditMode(false);
      console.log("Setting up new report with data:", aiGeneratedData);
      console.log("Customer interactions:", aiGeneratedData.customer_interactions);
      
      // Set AI generated data for new report
      reset({
        role: "general",
        report_name: aiGeneratedData.report_name || "",
        current_status: aiGeneratedData.current_status || "",
        summary: aiGeneratedData.summary || "",
        suumo: aiGeneratedData.suumo || false,
        views_count: aiGeneratedData.views_count?.toString() || "",
        inquiries_count: aiGeneratedData.inquiries_count?.toString() || "",
        viewing_count: aiGeneratedData.viewing_count?.toString() || "",
        business_meeting_count:
          aiGeneratedData.business_meeting_count?.toString() || "",
        property_id: propertyId || "",
        report_route_name: aiGeneratedData.report_route_name || "",
      });
      
      const interactions = aiGeneratedData.customer_interactions || [];
      console.log("Setting customer interactions:", interactions);
      setCustomerInteractions(interactions);
    } else {
      setIsEditMode(false);
      console.log("Setting up empty manual report");
      setCustomerInteractions([]); // Reset customer interactions
      // Reset form for new report
      reset({
        role: "general",
        report_name: "",
        current_status: "",
        summary: "",
        suumo: false,
        views_count: "",
        inquiries_count: "",
        viewing_count: "",
        property_id: propertyId || "",
        report_route_name: "",
        business_meeting_count: "",
      });
    }
  }, [reportId, aiGeneratedData, propertyId, reset]);

  const loadReportData = async (id: string) => {
    try {
      setIsLoading(true);
      const result = await dispatch(fetchDetailedReport(id)).unwrap();

      // Populate form with existing data
      reset({
        report_name: result.title || "",
        current_status: result.current_status || "",
        summary: result.summary || "",
        property_id: result.property_id || "",
        report_route_name: result.id || "",
        suumo: result.is_suumo_published || false,
        views_count: result.views_count?.toString() || "",
        inquiries_count: result.inquiries_count?.toString() || "",
        viewing_count: result.viewing_count?.toString() || "",
        business_meeting_count: result.business_meeting_count?.toString() || "",
      });

      // setReportName(result.res)
      setCustomerInteractions(result.customer_interactions || []);
    } catch (error) {
      console.error("Error loading report data:", error);
      addToast({
        type: "error",
        message: "報告書データの読み込み中にエラーが発生しました。",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update form validity whenever validation state changes
  useEffect(() => {
    setIsFormValid(isValid && isDirty);
  }, [isValid, isDirty]);

  // Helper function to download file
  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Helper function to extract filename from Content-Disposition header
  const getFilenameFromHeaders = (headers: any): string => {
    const contentDisposition =
      headers["content-disposition"] || headers["Content-Disposition"];
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      );
      if (filenameMatch && filenameMatch[1]) {
        return filenameMatch[1].replace(/['"]/g, "");
      }
    }
    // Default filename if not found in headers
    return `報告書_${new Date().toISOString().split("T")[0]}.xlsx`;
  };

  const leftInputContainerWidth = "338px";

  const onSubmit = (data: any, saveTypeParam?: "draft" | "completed") => {
    const currentSaveType = saveTypeParam || saveType;

    const payload = {
      ...(isEditMode && reportId && { id: reportId }), // Include ID for updates
      report_name: data.report_name,
      current_status: data.current_status,
      property_id: propertyId || data.property_id, // Use prop propertyId if available
      summary: data.summary,
      report_date: "2025-06-02",
      publish_status: "published",
      suumo: Boolean(data.suumo), // Convert to boolean explicitly
      homes: false,
      at_home: false,
      save_type: currentSaveType,
      views_count: parseInt(data.views_count) || 0,
      inquiries_count: parseInt(data.inquiries_count) || 0,
      business_meeting_count: parseInt(data.business_meeting_count) || 0,
      viewing_count: parseInt(data.viewing_count) || 0,
      customer_interactions: customerInteractions,
      is_new: !isEditMode, // report_idがない場合は手動作成（新規）
    };
    createReportData(payload);
  };

  // Handle draft save
  const handleDraftSave = () => {
    setSaveType("draft");
    handleSubmit((data) => onSubmit(data, "draft"))();
  };

  // Handle complete save (from modal)
  const handleCompleteSave = () => {
    setSaveType("completed");
    closeModal();
    handleSubmit((data) => onSubmit(data, "completed"))();
  };

  const createReportData = async (payload: any) => {
    setIsSubmitting(true);

    try {
      const result = await dispatch(createReport(payload)).unwrap();

      if (payload.save_type === "completed") {
        // Handle file download for completed reports
        if (result.isFile && result.file) {
          const filename = getFilenameFromHeaders(result.headers);
          downloadFile(result.file, filename);

          addToast({
            type: "success",
            message:
              "報告書が正常に作成され、Excelファイルがダウンロードされました。",
          });
        } else {
          // Fallback if no file received
          addToast({
            type: "success",
            message: "報告書が正常に作成されました。",
          });
        }
      } else {
        // For draft saves
        addToast({
          type: "success",
          message: "下書きが正常に保存されました。",
        });
      }

      // Call success callback and navigate back to listing
      if (onSaveSuccess) {
        onSaveSuccess();
      }

      // Go back to listing after successful save
      setTimeout(() => {
        if (onBack) {
          onBack();
        }
      }, 1500);
    } catch (error) {
      console.error("Error creating report:", error);
      addToast({
        type: "error",
        message: "報告書の作成中にエラーが発生しました。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          width: "100%",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#344052" }} />
      </Box>
    );
  }

  return (
    <>
      <form>
        <Box className={`report ${isMobile ? "sp" : ""}`} pt={{ lg: 3, xs: 1 }}>
          <SectionTitle
            title={isEditMode ? "報告書編集" : "新規報告書"}
            addBorder={false}
          />

          <Divider sx={{ borderColor: "#D9D9D9", py: 0.5 }} />

          <Box
            sx={{
              my: { xs: "10px", sm: "16px" },
              maxWidth: "100%",
              pl: { xs: "0", sm: 7 },
            }}
          >
            <CustomFullWidthInputGroup
              label="報告書名"
              name="report_name"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"40%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthSelectInputGroup
              label="現在の状況"
              name="current_status"
              control={control}
              placeholder="選択してください。"
              register={register}
              errors={errors}
              options={area}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"40%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="全体報告 (AI生成)"
              name="summary"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              multiline={true}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"40%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
              rows={3}
            />
            <CustomFullWidthCheckboxGroup
              label="SUUMOへの掲載"
              name="suumo"
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              // boxSx={{ ml: {lg: 4, xs: 1} }}
              options={[{ value: true, label: "掲載済み" }]}
            />
            <CustomFullWidthInputGroup
              label="閲覧数"
              name="views_count"
              type="number"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
              labelWidthSp={"40%"}
            />
            <CustomFullWidthInputGroup
              label="お問い合わせ件数"
              name="inquiries_count"
              type="number"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"40%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="期間内の商談実施人数"
              name="viewing_count"
              type="number"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"40%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="期間内の物件見学人数"
              name="business_meeting_count"
              type="number"
              placeholder=""
              register={register}
              errors={errors}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"40%"}
              isModalInput={false}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
          </Box>
        </Box>
        <Box sx={{ mt: 2, mb: 5, maxWidth: "100%", pl: { lg: 7.5, xs: 0 } }}>
          <Box className="inputGroupWrapper flexRow">
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
              }}
            >
              顧客対応内容
            </Typography>
          
          </Box>
                     <MiniTableList 
             data={customerInteractions} 
             onChange={handleCustomerInteractionsChange}
           />
        </Box>
        <Box
          sx={{
            backgroundColor: "rgba(221, 221, 221, 0.2)",
            width: "auto",
            marginTop: "auto",
            marginLeft: -3,
            position: "relative",
            left: 0,
            padding: 2,
            marginRight: -3,
          }}
        >
          <Grid container>
            <Grid item xs={12} lg={12}>
              <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
                <CustomButton
                  label="下書きを保存"
                  onClick={handleDraftSave}
                  sx={{
                    width: 150,
                    height: 43,
                    backgroundColor: "#3F97D5",
                    whiteSpace: "nowrap",
                    fontSize: { lg: "14px !important", xs: "10px !important" },
                  }}
                  // disabled={!isFormValid || isSubmitting}
                />
                <CustomButton
                  label="キャンセル"
                  onClick={() => {
                    if (onBack) {
                      onBack();
                    }
                  }}
                  sx={{
                    width: 150,
                    height: 43,
                    mx: 2,
                    fontSize: { lg: "14px !important", xs: "10px !important" },
                    backgroundColor: "#3F97D5",
                    whiteSpace: "nowrap",
                  }}
                  // disabled={isSubmitting}
                />
                <CustomButton
                  label={
                    isSubmitting
                      ? "処理中..."
                      : isEditMode
                      ? "更新（Excel出力）"
                      : "保存（Excel出力)"
                  }
                  onClick={() => openModal()}
                  sx={{
                    width: 150,
                    height: 43,
                    fontSize: { lg: "14px !important", xs: "10px !important" },
                    backgroundColor: "#3F97D5",
                    whiteSpace: "nowrap",
                  }}
                  // disabled={!isFormValid || isSubmitting}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
        <CustomModal
          openModal={isConfirmOpen}
          handleCloseModal={closeModal}
          title={isEditMode ? "更新の確認" : "保存の確認"}
          modalType="otherModal"
          addTitleBorder="true"
        >
          <Box sx={{ pt: 0 }}>
            <Typography
              align="left"
              fontSize={14}
              fontWeight={400}
              sx={{ marginBottom: "30px", lineHeight: 1.6 }}
            >
              {isEditMode
                ? "報告書の更新を完了し、Excelに出力してよろしいですか？"
                : "報告書の作成を完了し、Excelに出力してよろしいですか？"}
            </Typography>

            <Box
              sx={{ display: "flex", justifyContent: "center", gap: "20px" }}
            >
              <CustomButton
                label="キャンセル"
                onClick={closeModal}
                sx={{
                  width: "150px",
                  height: "45px",
                  backgroundColor: "#989898 !important",
                }}
                disabled={isSubmitting}
              />
              <CustomButton
                label={isSubmitting ? "処理中..." : "完了"}
                onClick={handleCompleteSave}
                sx={{
                  width: "100px",
                  height: "45px",
                  backgroundColor: "#4AA3C9",
                }}
                disabled={isSubmitting}
              />
            </Box>
          </Box>
        </CustomModal>
      </form>
      {toasts}
    </>
  );
};

export default ReportCreate;
