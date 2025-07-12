import { Add } from "@mui/icons-material";
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
import Table from "../../../components/Table";
import SectionTitle from "../../../components/SectionTitle";
import CustomButton from "../../../components/CustomButton";
import { CustomClientTableProps, PaginationInfo } from "../../../types";
import { Link, useNavigate } from "react-router";
import { GridColDef } from "@mui/x-data-grid";
import { formatDateTime } from "../../../common/formatDate";
import PerPageSelectBox from "../../../components/PerPageSelectBox";
import { useEffect, useState } from "react";
import { InquiryTableChip } from "../../Inquiry/Listing/InquiryTableChip";
import { AppDispatch, RootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeNames } from "../../../store/employeeSlice";
import { updateDetailedInquiry } from "../../../store/inquirySlice";
import { DropDownArrowIcon } from "../../../common/icons";
import MobileAccordionTable from "../../../components/MobileAccordionTable";
import { spInquiryFieldConfig } from "../../../common/spTableRows";
import { getRole } from "../../../utils/authUtils";

// Extended interface to include method prop, data, pagination, and callbacks
interface ExtendedCustomClientTableProps extends CustomClientTableProps {
  method?: string | null;
  data?: any[];
  loading?: boolean;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  perPage?: number;
  onPerPageChange?: (perPage: number) => void;
  onEmployeeUpdate?: () => void; // Updated callback signature
}

const getInquiryColumns = (
  addAction: boolean,
  employees: any[],
  dispatch: AppDispatch,
  onEmployeeUpdate?: () => void
): GridColDef<any>[] => {
  const baseColumns: GridColDef<any>[] = [
    {
      field: "method",
      headerName: "反響元",
      flex: 0.8,
      disableColumnMenu: true,
      headerClassName: "headerStyle",
      renderCell: (params) => (
        <InquiryTableChip sourceOfResponse={params.row.method} />
      ),
    },
    {
      field: "name",
      headerName: "名前",
      flex: 1,
      disableColumnMenu: true,
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
      flex: 1,
      disableColumnMenu: true,
      headerClassName: "headerStyle",
      renderCell: (params: any) => (
        <Link to={`/properties/${params.row.property_id}`} style={{ color: "#000" }}>
          {`${params.row.property_name || ""}`}
        </Link>
      ),
    },
    {
      field: "type",
      headerName: "種別",
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "registration_timestamp",
      headerName: "日時",
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => (
        <span>{formatDateTime(params.row.registration_timestamp)}</span>
      ),
    },
    {
      field: "content",
      headerName: "お問い合わせ内容",
      disableColumnMenu: true,
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

          // Check if customer_id exists
          if (!customerId) {
            console.error("Customer ID is missing from row data:", params.row);
            alert("エラー: 顧客IDが見つかりません。");
            return;
          }

          try {
            // Create FormData with current inquiry data, only changing employee_id
            const formData = new FormData();

            // Preserve all existing data from params.row and only update employee_id
            const currentData = params.row;

            // Personal Information - preserve existing values
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
            formData.append("customer_id", customerId);
            formData.append(
              "customer_created_at",
              currentData.customer_created_at || currentData.created_at
            );
            formData.append(
              "inquiry_created_at",
              currentData.inquiry_created_at ||
                currentData.registration_timestamp
            );
            formData.append("updated_at", new Date().toISOString());

            // Dispatch the update using customer_id as the id
            await dispatch(
              updateDetailedInquiry({
                id: customerId, // Use customer_id for the API call
                payload: formData,
              })
            ).unwrap();

            // Call the refresh callback to update the table
            if (onEmployeeUpdate) {
              onEmployeeUpdate();
            }
          } catch (error: any) {
            console.error("Failed to update employee assignment:", error);
            // You might want to show an error message here
            alert("担当者の更新中にエラーが発生しました。");
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

const InquiryTable = ({
  title,
  checkbox,
  fullList,
  addAction,
  data = [],
  loading = false,
  pagination,
  onPageChange,
  perPage = 10,
  onPerPageChange,
  onEmployeeUpdate, // Updated prop
}: ExtendedCustomClientTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  // Handle per page change - call parent callback
  const handlePerPageChange = (value: number) => {
    if (onPerPageChange) {
      onPerPageChange(value);
    }
  };

  useEffect(() => {
    dispatch(getEmployeeNames({}));
  }, [dispatch]);

  const { data: employeeNames } = useSelector(
    (state: RootState) => state.employees.names
  );

  const employeeOptions =
    employeeNames?.map((employee: any) => ({
      value: employee.id,
      label: employee.last_name + " " + employee.first_name,
    })) || [];

  const inquiryColumns = getInquiryColumns(
    addAction,
    employeeOptions,
    dispatch,
    onEmployeeUpdate
  );
  const navigate = useNavigate();
  const role = getRole();

  // Use the data passed from parent component
  const inquiry = data || [];

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

  const handleManagerChange = (rowId: string, newValue: string) => {
    setUpdatedManagers((prev) => ({ ...prev, [rowId]: newValue }));
  };

  const fieldConfig = spInquiryFieldConfig(
    employeeOptions,
    updatedManagers,
    handleManagerChange
  );

  console.log(inquiry);

  return (
    <Box sx={{ padding: { xs: "0", sm: "24px 0" } }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap={"wrap"}
        sx={{ mb: { xs: "12px", sm: "20px" } }}
      >
        {/* Left side - Section Title */}
        <Box>
          <SectionTitle title={title} addBorder={false} />
        </Box>

        {/* Right side - Buttons and controls */}
        {role === "admin" && (
          <Stack direction="row" alignItems="center" gap={1}>
            {fullList ? (
              <>
                <CustomButton
                  label="問い合わせ新規登録"
                  onClick={() => {
                    navigate("/inquiry/create");
                  }}
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
            ) : (
              <Box>
                <CustomButton label="物件一覧" />
              </Box>
            )}
          </Stack>
        )}
      </Stack>
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
          isLoading={loading}
          rows={inquiry}
          checkBoxOpen={false}
          columns={inquiryColumns}
          checkbox={checkbox}
          pagination={pagination}
          onPageChange={onPageChange}
        />
      )}
    </Box>
  );
};

export default InquiryTable;
