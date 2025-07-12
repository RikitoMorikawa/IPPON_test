import { useEffect, useState } from "react";
import { Add, Search } from "@mui/icons-material";
import { Box, Stack, useMediaQuery } from "@mui/material";
import { getRole } from "../../../utils/authUtils";
import Table from "../../../components/Table";
import { employeeColumns } from "../../../common/tableColumns";
import SectionTitle from "../../../components/SectionTitle";
import { useToast } from "../../../components/Toastify";
import CustomButton from "../../../components/CustomButton";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import { deleteEmployee, searchEmployees } from "../../../store/employeeSlice";
import CustomTextField from "../../../components/CustomTextField";
import { formatDateTime } from "../../../common/formatDate";
import { ButtonDeleteIcon } from "../../../common/icons";
import CreateEmployee from "../Create";
import CustomModal from "../../../components/CustomModal";
import { PaginationInfo } from "../../../types";
import { sendEmail } from "../../../store/membersSlice";
import MobileAccordionTable from "../../../components/MobileAccordionTable";
import { spEmployeeFieldConfig } from "../../../common/spTableRows";

const EmployeesListing = () => {
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [formattedDataToDelete, setFormattedDataToDelete] = useState<any[]>([]);
  const [isDeletButtonActive, setIsDeletButtonActive] =
    useState<boolean>(false);
  const [, setIsLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<any>({
    search: "",
  });
  const [perPage] = useState<number>(10);
  const { addToast, toasts } = useToast();
  const [deleteFlag, setDeleteFlag] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, setValue } = useForm();
  // const clientId = getClientID()
  const role = getRole();
  const { data: employeesData, loading: isSearchLoading } = useSelector(
    (state: any) => state.employees.searched
  );
  const [employees, setEmployees] = useState<any>([]);
  const [changeFlag, setChangeFlag] = useState(false);
  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const isMobile = useMediaQuery("(max-width:600px)");

  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
  });

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    fetchEmployees(page, pagination.limit);
  };

  /*** checkbox checked handler for sp view ***/
  const spRowCheckedHandler = (selectedRows: any) => {
    handleRowSelection(selectedRows);
  };
  /***checkbox checked handler for sp view ***/

  const handleRowSelection = (selectedRows: any[]) => {
    setSelectedIds(selectedRows);
    const selectedData = selectedRows
      .map((id) => {
        const row = employees.find((row: any) => row.id === id);
        return row
          ? {
              employee_id: row.id,
              mail_address: row.email,
            }
          : null;
      })
      .filter(Boolean);
    setFormattedDataToDelete(selectedData);
    if (selectedRows.length > 0) {
      setIsDeletButtonActive(true);
    } else {
      setIsDeletButtonActive(false);
    }
  };

  const clearRowSelection = () => {
    setSelectedIds([]);
    setFormattedDataToDelete([]);
    setIsDeletButtonActive(false);
  };

  const handleDelete = async () => {
    setOpenDeleteModal(false);
    if (formattedDataToDelete.length > 0) {
      try {
        const deleteResult = await dispatch(
          deleteEmployee(formattedDataToDelete)
        );
        const result = (await deleteResult?.payload) as any;
        if (result?.deleted_employees?.length > 0) {
          setDeleteFlag(true);
          clearRowSelection();
          addToast({
            message: "削除しました!",
            type: "deleted",
          });
        } else if (result?.failedDeletes?.length > 0) {
          addToast({
            message: "fail to delete",
            type: "error",
          });
        }
      } catch (err) {
        console.error("Error deleting employees:", err);
      }
    }
  };

  const onSubmit = (data: any) => {
    setSearchParams({
      search: data.search || "",
    });
  };

  const clearSearch = () => {
    setSearchParams({
      search: "",
    });
    setValue("search", "");
  };

  const fetchEmployees = async (page: number = 1, limit: number = perPage) => {
    try {
      setIsLoading(true);

      const searchPayload = {
        ...searchParams,
        page: page,
        limit: limit,
      };

      const result = await dispatch(searchEmployees(searchPayload));

      if (searchEmployees.fulfilled.match(result)) {
        const responseData = result.payload;
        setPagination({
          total: responseData.total,
          page: responseData.page,
          limit: responseData.limit,
        });
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  useEffect(() => {
    fetchEmployees(pagination.page, perPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, changeFlag, deleteFlag]);

  useEffect(() => {
    if (pagination.limit !== perPage) {
      fetchEmployees(1, perPage);
    }
  }, [perPage]);

  const createMemberSuccessHandler = () => {
    setChangeFlag(!changeFlag);
  };

  const handleChangePassword = async (rowData: any) => {
    try {
      const sendingMailResult = await dispatch(sendEmail(rowData?.email));
      // const result = await sendingMailResult?.payload as any;
      const requestStatus = (await sendingMailResult?.meta
        ?.requestStatus) as any;
      if (requestStatus === "fulfilled") {
        addToast({
          message: "メールを正常に送信いたしました。",
          type: "success",
        });
      }
    } catch (err) {
      console.error("Error changing status", err);
    }
  };

  // Pass the handleEditEmployee function to columns
  const columns = employeeColumns({
    handleChangePassword,
    role,
  });

  useEffect(() => {
    if (employeesData && employeesData.length !== 0) {
      const rows = employeesData?.items?.map(
        (employee: any, index: number) => ({
          id: employee.id || index,
          lastName: employee.last_name || "",
          firstName: employee.first_name || "",
          firstNameOfFurigana: employee.first_name_kana || "",
          lastNameOfFurigana: employee.last_name_kana || "",
          email: employee.mail_address || "",
          adminStatus: employee.is_admin ? "管理者" : "-",
          registration_timestamp: formatDateTime(employee.created_at),
          iso_registration_timestamp: employee.created_at,
          update_timestamp: formatDateTime(employee.updated_at),
        })
      );
      setEmployees(rows);
    }
  }, [employeesData]);

  const handleOpenModal = () => setOpenModal(true);

  /***sp ***/
  const fieldConfig = spEmployeeFieldConfig(handleChangePassword);

  return (
    <Box py={3}>
      <SectionTitle title="管理アカウント" />
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent={"space-between"}
        sx={{
          margin: { xs: "15px 0", sm: "20px 0" },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            direction={{ xs: "row", sm: "row" }}
            justifyContent={"flex-start"}
            gap={1}
            sx={{ width: "100%" }}
          >
            <CustomTextField
              fullWidth
              placeholder="キーワードで絞り込む"
              {...register("search")}
              slotProps={{
                input: {
                  startAdornment: (
                    <Search sx={{ color: "#989898", fontSize: 20 }} />
                  ),
                },
              }}
              sx={{
                width: "401px",
                height: 34,
                ".MuiInputBase-root": {
                  height: 34,
                  borderRadius: "8px",
                  borderColor: "#989898",
                  paddingLeft: 1,
                  fontFamily: "Noto Sans JP",
                },
                input: {
                  fontSize: "12px",
                  padding: "7px 8px",
                  "&::placeholder": {
                    color: "#989898",
                    opacity: 1,
                  },
                },
              }}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <CustomButton
                type="submit"
                label={`${isMobile ? "" : "検索"}`}
                className={`${isMobile ? "serchSp" : ""}`}
                startIcon={<Search sx={{ fontSize: "18px !important" }} />}
              />
              <CustomButton
                type="button"
                label="クリア"
                sx={{ whiteSpace: "nowrap" }}
                className={`${isMobile ? "serchSp" : ""}`}
                onClick={clearSearch}
              />
            </Box>
          </Stack>
        </form>
        {role === "admin" && (
          <Stack
            direction={{ xs: "row", sm: "row" }}
            justifyContent={"flex-end"}
            gap={1}
            sx={{ minWidth: "fit-content", mt: { lg: 0, xs: 1 } }}
          >
            <CustomButton
              label="新規追加"
              startIcon={<Add sx={{ fontSize: "18px !important" }} />}
              onClick={handleOpenModal}
            />
            <CustomButton
              label="削除"
              startIcon={<ButtonDeleteIcon />}
              onClick={handleOpenDeleteModal}
              className={`delete ${
                isDeletButtonActive ? "active" : "disabled"
              }`}
            />
          </Stack>
        )}
      </Stack>

      {/* Create Employee Modal */}
      <CreateEmployee
        openModal={openModal}
        setOpenModal={setOpenModal}
        onCreateSuccess={createMemberSuccessHandler}
      />

      {/* Delete Confirmation Modal */}
      <CustomModal
        title="削除の確認"
        openModal={openDeleteModal}
        handleCloseModal={() => setOpenDeleteModal(false)}
        bodyText="削除してよろしいですか？"
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
        <MobileAccordionTable
          rows={employees}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onRowSelection={spRowCheckedHandler}
          checkBoxOpen={true}
          fieldConfig={fieldConfig}
        />
      ) : (
        <Table
          isLoading={isSearchLoading}
          rows={employees}
          columns={columns}
          checkBoxOpen={true}
          checkbox={true}
          onRowSelection={handleRowSelection}
          selectedIds={selectedIds}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
      {toasts}
    </Box>
  );
};

export default EmployeesListing;
