// import { useEffect, useState } from "react";
import { Add } from "@mui/icons-material";
import Cookies from "js-cookie";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { formatDateTime } from "../../../common/formatDate";
import SectionTitle from "../../../components/SectionTitle";
import CustomButton from "../../../components/CustomButton";
import PerPageSelectBox from "../../../components/PerPageSelectBox";
import Table from "../../../components/Table";
import InquirySearch from "./InquirySearch";
import { InquiryTableChip } from "./InquiryTableChip";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
  searchInquiry,
  updateDetailedInquiry,
} from "../../../store/inquirySlice"; // Add updateDetailedInquiry import
import { PaginationInfo } from "../../../types";
import { getEmployeeNames } from "../../../store/employeeSlice";
import { DropDownArrowIcon } from "../../../common/icons";
import { spInquiryFieldConfig } from "../../../common/spTableRows";
import MobileAccordionTable from "../../../components/MobileAccordionTable";

// Define the search parameters interface - Updated to match API requirements
interface SearchParams {
  firstName?: string;
  lastName?: string;
  inquiryTimestamp?: string;
  inquiryMethod?: string;
  employeeId?: string;
}

// Add pagination interface
const getInquiryColumns = (
  addAction: any,
  employees: any,
  dispatch: AppDispatch,
  onDataRefresh?: () => void
): GridColDef<any>[] => {
  const baseColumns: GridColDef<any>[] = [
    {
      field: "method",
      headerName: "反響元",
      // width: 160,
      flex: 0.8,
      headerClassName: "headerStyle",
      renderCell: (params) => (
        <InquiryTableChip sourceOfResponse={params.row.method} />
      ),
    },
    {
      field: "name",
      headerName: "名前",
      // width: 160,
      flex: 1,
      headerClassName: "headerStyle",
      renderCell: (params: any) => (
        <Link to={`/inquiry/${params.row.id}`} style={{ color: "#000" }}>
          {`${params.row.name || ""}`}
        </Link>
      ),
    },
    {
      field: "property_name",
      headerName: "物件名",
      sortable: false,
      // width: 220,
      flex: 1,
      headerClassName: "headerStyle",
      renderCell: (params: any) => (
        <Link to={`/inquiry/${params.row.id}`} style={{ color: "#000" }}>
          {`${params.row.property_name || ""}`}
        </Link>
      ),
    },
    {
      field: "type",
      headerName: "種別",
      // width: 240,
      flex: 1,
    },
    {
      field: "register_timestamp",
      headerName: "日時",
      // width: 240,
      flex: 1,
      renderCell: (params) => (
        <span>{formatDateTime(params.row.register_timestamp)}</span>
      ),
    },
    {
      field: "content",
      headerName: "お問い合わせ内容",
      // width: 240,
      flex: 1,
    },
  ];

  if (addAction) {
    baseColumns.push({
      field: "manager",
      headerName: "担当者",
      width: 240,
      renderCell: (params: any) => {
        const selectedEmployee = employees.find(
          (employee: any) => employee.value === params.row.employee_id
        );

        const handleManagerChange = async (
          event: SelectChangeEvent<string>
        ) => {
          const newEmployeeId = event.target.value;
          const customerId = params.row.customer_id;
          try {
            // Create FormData with current inquiry data, only changing employee_id
            const formData = new FormData();

            // Preserve all existing data from params.row and only update employee_id
            const currentData = params.row;

            // Personal Information - preserve existing values
            // Note: You might need to fetch more detailed data if params.row doesn't contain all fields
            formData.append("first_name", currentData.first_name || "");
            formData.append("last_name", currentData.last_name || "");
            formData.append("middle_name", currentData.middle_name || "sample");
            formData.append(
              "first_name_kana",
              currentData.first_name_kana || ""
            );
            formData.append(
              "middle_name_kana",
              currentData.middle_name_kana || "sample"
            );
            formData.append("last_name_kana", currentData.last_name_kana || "");
            formData.append("birthday", currentData.birthday || "");
            formData.append("gender", currentData.gender || "");
            formData.append("mail_address", currentData.mail_address || "");
            formData.append("phone_number", currentData.phone_number || "");

            // Update only the employee_id
            formData.append("employee_id", newEmployeeId);

            // Address Information - preserve existing values
            formData.append("postcode", currentData.postcode || "");
            formData.append("prefecture", currentData.prefecture || "");
            formData.append("city", currentData.city || "");
            formData.append("street_address", currentData.street_address || "");
            formData.append(
              "building_room_and_number",
              currentData.building_room_and_number || ""
            );

            // Inquiry Information - preserve existing values
            formData.append("property_name", currentData.property_name || "");
            formData.append("category", currentData.category || "");
            formData.append("type", currentData.type || "");
            formData.append("method", currentData.method || "");
            formData.append(
              "summary",
              currentData.summary || currentData.content || ""
            );

            // Additional Information - preserve existing values
            formData.append("client_id", currentData.client_id || "");
            formData.append("customer_id", customerId || "");
            formData.append(
              "customer_created_at",
              currentData.customer_created_at || currentData.created_at
            );
            formData.append(
              "inquiry_created_at",
              currentData.inquiry_created_at || currentData.register_timestamp
            );
            formData.append("updated_at", new Date().toISOString());

            // Dispatch the update using customer_id as the id
            await dispatch(
              updateDetailedInquiry({
                id: customerId, // Use customer_id for the API call
                payload: formData,
              })
            ).unwrap();

            // Refresh the data to show updated assignment
            if (onDataRefresh) {
              onDataRefresh();
            }

            // You might want to show a success message here
            // addToast({ type: "success", message: "担当者が正常に更新されました。" });
          } catch (error: any) {
            console.error("Failed to update employee assignment:", error);
            // You might want to show an error message here
            // addToast({ type: "error", message: "担当者の更新中にエラーが発生しました。" });
          }
        };

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              width: "100%",
              height: "100%",
            }}
          >
            <FormControl
              variant="outlined"
              size="small"
              sx={{ minWidth: "100%" }}
            >
              <Select
                value={selectedEmployee ? selectedEmployee.value : ""}
                onChange={handleManagerChange}
                IconComponent={DropDownArrowIcon}
                sx={{
                  fontSize: "14px",
                  "& .MuiSelect-select": {
                    padding: "4px 10px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#D9D9D9",
                    borderRadius: "4px",
                  },
                  "&:hover": {
                    backgroundColor: "transparent !important",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#D9D9D9 !important",
                  },
                  "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#D9D9D9 !important",
                    },
                  "&.MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#D9D9D9 !important",
                    },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#D9D9D9 !important",
                  },
                  ".MuiSelect-icon": {
                    fontSize: "12px",
                  },
                }}
              >
                <MenuItem
                  value=""
                  sx={{
                    fontSize: "12px",
                    minHeight: { xs: "25px", sm: "30px" },
                  }}
                >
                  <em>未割当</em>
                </MenuItem>
                {employees.map((employee: any) => (
                  <MenuItem
                    key={employee.value}
                    value={employee.value}
                    sx={{
                      fontSize: "12px",
                      minHeight: { xs: "25px", sm: "30px" },
                    }}
                  >
                    {employee.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      },
    });
  }

  return baseColumns;
};

const InquiryListing = () => {
  const [perPage, setPerPage] = useState<number>(10);
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updateFlag, setUpdateFlag] = useState<boolean>(false);

  // Add pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
  });

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setPagination((prev) => ({ ...prev, limit: value, page: 1 }));
  };

  const { data: employeeNames } = useSelector(
    (state: RootState) => state.employees.names
  );

  const employeeOptions =
    employeeNames?.map((employee: any) => ({
      value: employee.id,
      label: employee.first_name + " " + employee.family_name,
    })) || [];

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const role = Cookies.get("role");
  const { data: inquiryData } = useSelector(
    (state: any) => state.inquiry.searched
  );
  const [inquiry, setInquiry] = useState<any>([]);
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const isMobile = useMediaQuery("(max-width:600px)");

  const fetchInquiry = async (
    params: SearchParams = {},
    page: number = 1,
    limit: number = perPage
  ) => {
    try {
      setIsLoading(true);
      const searchPayload = {
        firstName: params.firstName,
        lastName: params.lastName,
        inquiryTimestamp: params.inquiryTimestamp,
        inquiryMethod: params.inquiryMethod,
        employeeId: params.employeeId,
        page: page,
        limit: limit,
      };

      // Remove undefined values to clean up the payload
      const cleanedPayload = Object.fromEntries(
        Object.entries(searchPayload).filter(
          ([_, value]) => value !== undefined
        )
      );

      const result = await dispatch(searchInquiry(cleanedPayload));

      // Update pagination info if the API returns it
      if (searchInquiry.fulfilled.match(result)) {
        const responseData = result.payload;
        setPagination({
          total: responseData.total || 0,
          page: responseData.page || page,
          limit: responseData.limit || limit,
        });
      }
    } catch (err) {
      console.error("Error fetching inquiry:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    fetchInquiry(searchParams, page, pagination.limit);
  };

  // Handle search from InquirySearch component
  const handleSearch = (searchData: SearchParams) => {
    setSearchParams(searchData);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when searching
    fetchInquiry(searchData, 1, pagination.limit);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchParams({});
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when clearing
    fetchInquiry({}, 1, pagination.limit);
  };

  // Add refresh function for after employee updates
  const handleDataRefresh = () => {
    fetchInquiry(searchParams, pagination.page, pagination.limit);
  };

  // Generate inquiry columns with refresh callback
  const inquiryColumns = getInquiryColumns(
    true,
    employeeOptions,
    dispatch,
    handleDataRefresh
  );

  // Fetch inquiry data on mount
  useEffect(() => {
    fetchInquiry(searchParams, pagination.page, perPage);
  }, [updateFlag]); // Only run on mount

  // Update when perPage changes
  useEffect(() => {
    if (pagination.limit !== perPage) {
      fetchInquiry(searchParams, 1, perPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage]);

  useEffect(() => {
    if (inquiryData?.items) {
      if (inquiryData?.items.length > 0) {
        const rows = inquiryData?.items.map((inquiry: any, index: number) => ({
          id: inquiry?.inquiry?.id || index,
          customer_id: inquiry?.inquiry?.customer?.id || "",
          employee_id: inquiry?.inquiry?.customer?.employee_id || "",
          method: inquiry?.inquiry?.method,
          name:
            inquiry?.inquiry?.customer?.first_name +
            " " +
            inquiry?.inquiry?.customer?.last_name,
          property_name: inquiry?.inquiry?.property?.name,
          type: inquiry?.inquiry?.type,
          content: inquiry?.inquiry?.summary,
          manager: inquiry?.manager || "",
          register_timestamp: inquiry?.inquiry?.created_at,
          // Add additional fields that might be needed for the update
          first_name: inquiry?.inquiry?.customer?.first_name,
          last_name: inquiry?.inquiry?.customer?.last_name,
          mail_address: inquiry?.inquiry?.customer?.mail_address,
          phone_number: inquiry?.inquiry?.customer?.phone_number,
          created_at: inquiry?.inquiry?.created_at,
        }));
        setInquiry(rows);
      } else {
        setInquiry([]);
      }
    }
  }, [inquiryData]);

  useEffect(() => {
    dispatch(getEmployeeNames({}));
  }, [dispatch]);

  /***sp****/
  const handleRowSelection = (id: number) => {
    const isSelected = selectedIds.includes(id);

    const updatedSelectedIds = isSelected
      ? selectedIds.filter((selectedId: any) => selectedId !== id) // remove if already selected
      : [...selectedIds, id]; // add if not selected

    setSelectedIds(updatedSelectedIds); // update local state

    // If onRowSelection is passed as a prop, call it
    // onRowSelection?.(updatedSelectedIds);
  };

  const [updatedManagers, setUpdatedManagers] = useState<
    Record<string, string>
  >({});

  //sp manager update
  const handleManagerChange = (row: any, rowId: string, newValue: string) => {
    setUpdatedManagers((prev) => ({ ...prev, [rowId]: newValue }));
    const formData = new FormData();
    formData.append("employee_id", newValue);
    formData.append("customer_created_at", row.created_at);
    formData.append("inquiry_created_at", row?.register_timestamp);
    updateManager(row?.customer_id, formData);
  };

  const updateManager = async (id: string, uploadFormData: any) => {
    try {
      const updateResult = await dispatch(
        updateDetailedInquiry({
          id: id, // Use customer_id for the API call
          payload: uploadFormData,
        })
      );
      if (updateDetailedInquiry.fulfilled.match(updateResult)) {
        setUpdateFlag(!updateFlag);
        handleDataRefresh();
      }
    } catch (err) {
      console.error("Error creating properties:", err);
    }
  };

  const fieldConfig = spInquiryFieldConfig(
    employeeOptions,
    updatedManagers,
    handleManagerChange
  );

  return (
    <Box py={3}>
      <Box>
        <InquirySearch
          onSearch={handleSearch}
          onClear={handleClearSearch}
          totalCount={pagination.total}
          currentSearchParams={searchParams}
        />
      </Box>
      <Box sx={{ pt: { xs: "16px", sm: "40px" } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: { xs: "12px", sm: "20px" } }}
        >
          <Box>
            <SectionTitle title={"顧客一覧"} addBorder={false} />
          </Box>

          {role == "admin" && (
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              gap={1}
              alignItems={"center"}
            >
              <>
                <CustomButton
                  label="新規顧客登録"
                  onClick={() => navigate(`/inquiry/create`)}
                  startIcon={<Add sx={{ fontSize: "18px !important" }} />}
                />
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography
                    sx={{
                      fontWeight: "700",
                      fontSize: "14px",
                      color: "#3e3e3e",
                    }}
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
              </>
            </Stack>
          )}
        </Stack>
      </Box>
      {isMobile ? (
        <MobileAccordionTable
          rows={inquiry}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onRowSelection={handleRowSelection}
          checkBoxOpen={false}
          fieldConfig={fieldConfig}
        />
      ) : (
        <Table
          isLoading={isLoading}
          rows={inquiry}
          columns={inquiryColumns}
          checkBoxOpen={false}
          checkbox={false}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  );
};

export default InquiryListing;
