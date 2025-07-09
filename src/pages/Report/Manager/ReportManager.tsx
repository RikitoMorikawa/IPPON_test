import { useState } from "react";
import ReportListing from "../Listing";
import ReportCreate from "../Create";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { fetchInquiriesForReport } from "../../../store/reportSlice";
import { Box } from "@mui/material";
import { useToast } from "../../../components/Toastify";

type ViewType = "listing" | "create" | "edit";

const ReportManager = () => {
  const [currentView, setCurrentView] = useState<ViewType>("listing");
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(
    undefined
  );
  const [inquiryData, setInquiryData] = useState<any>(null);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<{
    start_date: string;
    end_date: string;
  } | null>(null);
  const { property_id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useToast();


  const handleReportSelect = (reportId: string) => {
    setSelectedReportId(reportId);
    setCurrentView("edit"); // Changed from 'create' to 'edit'
  };

  const handleBackToListing = () => {
    setCurrentView("listing");
    setSelectedReportId(undefined);
    setInquiryData(null);
    setSelectedPeriod(null);
  };

  const handleCreateNew = async (period?: { start_date: string; end_date: string }) => {
    if (!property_id) {
      addToast({
        type: "error",
        message: "物件IDが見つかりません。",
      });
      return;
    }

    // 期間が指定されている場合は問い合わせデータを取得
    if (period && period.start_date && period.end_date) {
      console.log("Fetching inquiries for period:", period);
      console.log("Property ID:", property_id);
      
      setIsLoadingInquiries(true);
      try {
        const result = await dispatch(fetchInquiriesForReport({
          property_id: property_id,
          start_date: period.start_date,
          end_date: period.end_date,
        })).unwrap();
        
        console.log("Inquiry data fetched successfully:", result);
        setInquiryData(result);
        setSelectedPeriod(period);
        
        addToast({
          type: "success",
          message: `問い合わせデータを取得しました（${Array.isArray(result) ? result.length : 0}件）`,
        });
      } catch (error) {
        console.error("Error fetching inquiries:", error);
        addToast({
          type: "error",
          message: "問い合わせデータの取得中にエラーが発生しました。",
        });
      } finally {
        setIsLoadingInquiries(false);
      }
    } else {
      // 期間が指定されていない場合はそのまま手動作成モードに遷移
      console.log("No period specified, creating manual report");
      setInquiryData(null);
      setSelectedPeriod(null);
    }

    setSelectedReportId(undefined);
    setCurrentView("create");
  };

  const handleSaveSuccess = (reportId?: string) => {
    // Optional: Refresh listing data or perform other actions after successful save
    setInquiryData(null);
    setSelectedPeriod(null);
    
    // Log the created report ID if available
    if (reportId) {
      console.log("Report successfully created with ID:", reportId);
    }
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
              currentView === "create" ? { 
                customer_interactions: inquiryData || [],
                period: selectedPeriod
              } : undefined
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

  if (isLoadingInquiries) {
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
          問い合わせデータを取得中
        </Box>
      </Box>
    );
  }

  return <>{renderCurrentView()}</>;
};

export default ReportManager;
