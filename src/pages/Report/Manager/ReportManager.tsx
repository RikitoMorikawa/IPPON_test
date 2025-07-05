import { useState } from "react";
import ReportListing from "../Listing";
import ReportCreate from "../Create";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import { generateReportWithAI } from "../../../store/reportSlice";
import { Box } from "@mui/material";
import { useToast } from "../../../components/Toastify";
import dayjs from "dayjs";

type ViewType = "listing" | "create" | "edit";

const ReportManager = () => {
  const [currentView, setCurrentView] = useState<ViewType>("listing");
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(
    undefined
  );
  const [aiGeneratedData, setAiGeneratedData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { property_id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useToast();

  // 物件詳細情報を取得
  const { data: propertyData } = useSelector(
    (state: any) => state.properties.detailed
  );

  const handleReportSelect = (reportId: string) => {
    setSelectedReportId(reportId);
    setCurrentView("edit"); // Changed from 'create' to 'edit'
  };

  const handleBackToListing = () => {
    setCurrentView("listing");
    setSelectedReportId(undefined);
    setAiGeneratedData(null);
  };

  const handleCreateNew = async () => {
    if (!property_id) {
      addToast({
        type: "error",
        message: "物件IDが見つかりません。",
      });
      return;
    }

    if (!propertyData) {
      addToast({
        type: "error",
        message: "物件情報が見つかりません。",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // デフォルトで過去1週間の期間を設定
      const endDate = dayjs().format("YYYY-MM-DD");
      const startDate = dayjs().subtract(7, "day").format("YYYY-MM-DD");

      const payload = {
        property_id: property_id,
        client_id: propertyData.client_id || "", // 物件詳細からclient_idを取得
        property_name: propertyData.name || "", // 物件名を取得
        report_start_date: startDate,
        report_end_date: endDate,
      };

      const result = await dispatch(generateReportWithAI(payload)).unwrap();
      setAiGeneratedData(result);
      setSelectedReportId(undefined);
      setCurrentView("create");
    } catch (error) {
      console.error("Error generating AI report:", error);
      addToast({
        type: "error",
        message: "AI報告書の生成中にエラーが発生しました。",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSuccess = () => {
    // Optional: Refresh listing data or perform other actions after successful save
    setAiGeneratedData(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "listing":
        return (
          <ReportListing
            onReportSelect={handleReportSelect}
            onCreateNew={handleCreateNew}
            property_id={property_id}
          />
        );
      case "create":
      case "edit":
        return (
          <ReportCreate
            reportId={currentView === "edit" ? selectedReportId : undefined}
            propertyId={property_id}
            aiGeneratedData={
              currentView === "create" ? aiGeneratedData : undefined
            }
            onBack={handleBackToListing}
            onSaveSuccess={handleSaveSuccess}
          />
        );
      default:
        return (
          <ReportListing
            onReportSelect={handleReportSelect}
            onCreateNew={handleCreateNew}
            property_id={property_id}
          />
        );
    }
  };

  if (isGenerating) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          width: "100%",
        }}
      >
        {/* <CircularProgress size={60} sx={{ color: "#344052" }} /> */}
        <Box sx={{ mt: 2, color: "#344052", fontSize: "14px" }}>
          AIが報告書を作成中
        </Box>
      </Box>
    );
  }

  return <>{renderCurrentView()}</>;
};

export default ReportManager;
