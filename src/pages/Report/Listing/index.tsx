// import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Box, Stack, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { formatDateTime } from "../../../common/formatDate";
import SectionTitle from "../../../components/SectionTitle";
import PerPageSelectBox from "../../../components/PerPageSelectBox";
import Table from "../../../components/Table";
import ReportSearch from "./ReportSearch";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import { searchReports, fetchPropertyReports } from "../../../store/reportSlice";
import { PaginationInfo } from "../../../types";

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
  onCreateNew?: () => void; // Callback when creating a new report
  property_id?: string; // Optional property ID for filtering reports by property
}

const ReportListing: React.FC<ReportListingProps> = ({
  onReportSelect,
  onCreateNew,
  property_id,
}) => {
  const [perPage, setPerPage] = useState<number>(10);

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
  };

  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
  });

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
  const role = Cookies.get("role");
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
        result = await dispatch(fetchPropertyReports({
          property_id,
          ...cleanedPayload
        }));
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

  return (
    <Box>
      <Box>
        <ReportSearch
          onSearch={handleSearch}
          onClear={handleClearSearch}
          // totalCount={pagination.total}
          currentSearchParams={searchParams}
          onCreateNew={onCreateNew}
        />
      </Box>
      <Box pt={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2.5 }}
        >
          <Box>
            <SectionTitle title={"報告書一覧"} addBorder={false} />
          </Box>

          {role === "admin" && (
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={1}
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
        </Stack>
      </Box>
      <Table
        isLoading={isLoading}
        rows={report}
        columns={reportColumns}
        checkbox={false}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </Box>
  );
};

export default ReportListing;
