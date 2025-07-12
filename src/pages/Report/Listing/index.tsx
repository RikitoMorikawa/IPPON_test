// import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

import { formatDateTime } from "../../../common/formatDate";
import SectionTitle from "../../../components/SectionTitle";
import PerPageSelectBox from "../../../components/PerPageSelectBox";
import Table from "../../../components/Table";
import TableMobile from "../../../components/TableMobile";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal";
import ReportSearch from "./ReportSearch";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import {
  searchReports,
  fetchPropertyReports,
  deleteReports,
  downloadReportsExcel,
} from "../../../store/reportSlice";
import { PaginationInfo } from "../../../types";
import { useTheme, useMediaQuery } from "@mui/material";
import { getRole } from "../../../utils/authUtils";
import { ButtonDeleteIcon } from "../../../common/icons";
import { useToast } from "../../../components/Toastify";

// Updated interface to match ReportSearch component
interface SearchParams {
  period?: string;
  weekStartDay?: string;
  autoGenerate?: boolean; // Changed from string to boolean
}

// API payload interface (what the API expects)
interface ApiSearchParams {
  period?: string;
  weekStartDay?: string;
  autoGenerate?: string; // API expects string
  page?: number;
  limit?: number;
}

interface ReportListingProps {
  onReportSelect?: (reportId: string) => void; // Callback when report is selected for editing
  onCreateNew?: (period?: { start_date: string; end_date: string }) => void; // Callback when creating a new report
  property_id?: string; // Optional property ID for filtering reports by property
}

const ReportListing: React.FC<ReportListingProps> = ({
  onReportSelect,
  onCreateNew,
  property_id,
}) => {
  const [perPage, setPerPage] = useState<number>(10);
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [isDeletButtonActive, setIsDeletButtonActive] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { addToast, toasts } = useToast();

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
  };

  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const getReportColumns = (): GridColDef<any>[] => {
    const baseColumns: GridColDef<any>[] = [
      {
        field: "created",
        headerName: "作成日",
        flex: 1,
        disableColumnMenu: true,
        renderCell: (params) => (
          <span>{formatDateTime(params.row.created)}</span>
        ),
      },
      {
        field: "period",
        headerName: "期間",
        flex: 1,
        disableColumnMenu: true,
        headerClassName: "headerStyle",
      },
      {
        field: "report_title",
        headerName: "報告書名",
        sortable: false,
        flex: 1,
        disableColumnMenu: true,
        headerClassName: "headerStyle",
        renderCell: (params) => (
          <span
            style={{
              cursor: "pointer",
              color: "#1976d2",
              textDecoration: "underline",
              fontWeight: 500,
            }}
            onClick={() => {
              onReportSelect?.(params.row.id);
            }}
          >
            {params.row.report_title}
          </span>
        ),
      },
      {
        field: "status",
        headerName: "種別",
        headerClassName: "headerStyle",
        flex: 1,
        disableColumnMenu: true,
      },
    ];
    return baseColumns;
  };

  const reportColumns = getReportColumns();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const navigate = useNavigate();
  const role = getRole();
  const { data: reportData } = useSelector(
    (state: any) => state.reports.searched
  );
  const [report, setReport] = useState<any>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({});

  const fetchReport = async (
    params: SearchParams = {},
    page: number = 1,
    limit: number = perPage
  ) => {
    try {
      setIsLoading(true);

      // Convert boolean to string for API
      const searchPayload: ApiSearchParams = {
        period: params.period,
        weekStartDay: params.weekStartDay,
        autoGenerate:
          params.autoGenerate !== undefined
            ? String(params.autoGenerate)
            : undefined,
        page: page,
        limit: limit,
      };

      const cleanedPayload = Object.fromEntries(
        Object.entries(searchPayload).filter(
          ([_, value]) => value !== undefined
        )
      );

      let result;
      if (property_id) {
        // Use property-specific reports endpoint
        result = await dispatch(
          fetchPropertyReports({
            property_id,
            ...cleanedPayload,
          })
        );
      } else {
        // Use general reports endpoint
        result = await dispatch(searchReports(cleanedPayload));
      }

      const responseData = result.payload;
      setPagination({
        total: responseData.total || 0,
        page: responseData.page || page,
        limit: responseData.limit || limit,
      });
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(searchParams, pagination.page, perPage);
  }, []); // Only run on mount

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    fetchReport(searchParams, page, pagination.limit);
  };

  const handleSearch = (searchData: SearchParams) => {
    setSearchParams(searchData);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when searching
    fetchReport(searchData, 1, pagination.limit);
  };

  const handleClearSearch = () => {
    setSearchParams({});
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when clearing
    fetchReport({}, 1, pagination.limit);
  };

  //  const handleDataRefresh = () => {
  //   fetchReport(searchParams, pagination.page, pagination.limit);
  // };

  useEffect(() => {
    if (pagination.limit !== perPage) {
      fetchReport(searchParams, 1, perPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage]);

  useEffect(() => {
    if (reportData.items) {
      if (reportData.items.length > 0) {
        const rows = reportData?.items?.map((report: any, index: number) => ({
          id: report.id || index,
          created: report.created_at || "",
          period:
            report.report_start_date + " ~ " + report.report_end_date || "",
          report_title: report.title || "",
          status: report.is_draft ? "下書き" : "出力済み",
        }));
        setReport(rows);
      } else {
        setReport([]);
      }
    }
  }, [reportData]);

  const handleRowSelection = (selectedRows: any[]) => {
    setSelectedIds(selectedRows);
    setIsDeletButtonActive(selectedRows.length > 0);
  };

  const clearRowSelection = () => {
    setSelectedIds([]);
    setIsDeletButtonActive(false);
  };

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);

  const handleDelete = async () => {
    setOpenDeleteModal(false);
    try {
      const deleteResult = await dispatch(deleteReports(selectedIds));
      
      if (deleteReports.fulfilled.match(deleteResult)) {
        clearRowSelection();
        // 削除後にデータを再取得
        fetchReport(searchParams, pagination.page, pagination.limit);
        addToast({
          message: "削除しました!",
          type: "deleted",
        });
      } else if (deleteReports.rejected.match(deleteResult)) {
        const response = deleteResult.payload as any;
        const errorMessage = response.message || "削除に失敗しました";
        addToast({
          message: errorMessage,
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error deleting reports:", err);
      addToast({
        message: "削除に失敗しました",
        type: "error",
      });
    }
  };

  const handleExcelDownload = async () => {
    try {
      const downloadResult = await dispatch(downloadReportsExcel(selectedIds));
      
      if (downloadReportsExcel.fulfilled.match(downloadResult)) {
        addToast({
          message: "エクセルファイルをダウンロードしました!",
          type: "success",
        });
      } else if (downloadReportsExcel.rejected.match(downloadResult)) {
        const response = downloadResult.payload as any;
        const errorMessage = response.message || "ダウンロードに失敗しました";
        addToast({
          message: errorMessage,
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error downloading excel:", err);
      addToast({
        message: "ダウンロードに失敗しました",
        type: "error",
      });
    }
  };

  return (
    <Box>
      <Box>
        <ReportSearch
          onSearch={handleSearch}
          onClear={handleClearSearch}
          // totalCount={pagination.total}
          currentSearchParams={searchParams}
          onCreateNew={onCreateNew}
          property_id={property_id}
        />
      </Box>
      <Box pt={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Box>
            <SectionTitle title={"報告書一覧"} addBorder={false} />
          </Box>

          {role === "admin" && (
            <Stack direction="row" spacing={1}>
              <CustomButton
                label="Excelダウンロード"
                type="button"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                onClick={handleExcelDownload}
                className={`${!isDeletButtonActive ? "disabled" : ""}`}
              />
              <CustomButton
                label="削除"
                type="button"
                sx={{
                  width: "65px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                startIcon={<ButtonDeleteIcon />}
                onClick={handleOpenDeleteModal}
                className={`delete ${
                  isDeletButtonActive ? "active" : "disabled"
                }`}
              />
            </Stack>
          )}
        </Stack>

        {role === "admin" && (
          <Stack
            direction={"row"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            gap={1}
            sx={{ mb: 1.5 }}
          >
            <Box>
              <Typography
                sx={{ fontWeight: "700", color: "#3e3e3e", fontSize: "12px" }}
              >
                表示件数
              </Typography>
            </Box>
            <Box>
              <PerPageSelectBox
                value={perPage}
                onChange={handlePerPageChange}
              />
            </Box>
          </Stack>
        )}
      </Box>

      {/* Delete Confirmation Modal */}
      <CustomModal
        title="削除の確認"
        openModal={openDeleteModal}
        handleCloseModal={() => setOpenDeleteModal(false)}
        bodyText="選択した報告書を削除してよろしいですか？"
      >
        <Box sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <CustomButton
            label="削除"
            onClick={handleDelete}
            buttonCategory="delete"
          />
          <CustomButton
            label="戻る"
            type="button"
            onClick={() => setOpenDeleteModal(false)}
          />
        </Box>
      </CustomModal>

      {isMobile ? (
        <TableMobile
          isLoading={isLoading}
          rows={report}
          columns={reportColumns}
          pagination={pagination}
          onPageChange={handlePageChange}
          checkbox={true}
          onRowSelection={handleRowSelection}
          selectedIds={selectedIds}
        />
      ) : (
        <Table
          isLoading={isLoading}
          rows={report}
          columns={reportColumns}
          checkbox={true}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowSelection={handleRowSelection}
          selectedIds={selectedIds}
        />
      )}
      {toasts}
    </Box>
  );
};

export default ReportListing;
